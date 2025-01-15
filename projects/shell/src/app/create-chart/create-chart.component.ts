import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { coreModule } from '../../../../shared/libs/core.module';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-create-chart',
  standalone: true,
  imports: [MaterialModule, coreModule],
  providers: [],
  templateUrl: './create-chart.component.html',
  styleUrl: './create-chart.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class CreateChartComponent implements OnInit {
  @ViewChild('chartContainer', { read: ViewContainerRef, static: false }) chartContainer!: ViewContainerRef;
  @ViewChild('configContainer', { read: ViewContainerRef, static: false }) configContainer!: ViewContainerRef;
  @ViewChild('designContainer', { read: ViewContainerRef, static: false }) designContainer!: ViewContainerRef;
  ngOnInit() {
    this.loadRemotes()
  }
  async loadRemotes() {
    const remoteComp1 = await loadRemoteModule({
      type: "module",
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './ChartComponent'
    }).then(c => c.ChartComponent)
    this.chartContainer.createComponent(remoteComp1)


    const remoteComp2 = await loadRemoteModule({
      type: "module",
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './CreateChartConfigComponent'
    }).then(c => c.CreateChartConfigComponent)
    this.configContainer.createComponent(remoteComp2)
    
    
    const remoteComp3 = await loadRemoteModule({
      type: "module",
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './CreatChartDesignComponent'
    }).then(c => c.CreateChartDesignComponent)
    this.designContainer.createComponent(remoteComp3)
  }
  
}
