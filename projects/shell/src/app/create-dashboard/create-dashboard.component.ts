import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MaterialModule } from '../../../../shared/materialUI/material.module';

@Component({
  selector: 'app-create-dashboard',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './create-dashboard.component.html',
  styleUrl: './create-dashboard.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class CreateDashboardComponent {
    @ViewChild('gridContainer', { read: ViewContainerRef, static: false }) gridContainer!: ViewContainerRef;
  @ViewChild('configContainer', { read: ViewContainerRef, static: false }) configContainer2!: ViewContainerRef;
  @ViewChild('designContainer', { read: ViewContainerRef, static: false }) designContainer!: ViewContainerRef;
  ngOnInit() {
    this.loadRemotes()
  }

  saveDashboard(){
    window.dispatchEvent(new CustomEvent('save-dashboard', {detail: true}));
  }

  async loadRemotes() {
    const remoteComp1 = await loadRemoteModule({
      type: "module",
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './DashboardComponent'
    }).then(c => c.DashboardComponent)
    this.gridContainer.createComponent(remoteComp1)

    const remoteComp2 = await loadRemoteModule({
      type: "module",
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './CreatDashboardConfigComponent'
    }).then(c => c.CreateDashboardConfigComponent)
    this.configContainer2.createComponent(remoteComp2)


    // const remoteComp3 = await loadRemoteModule({
    //   type: "module",
    //   remoteEntry: 'http://localhost:4202/remoteEntry.js',
    //   exposedModule: './CreatChartDesignComponent'
    // }).then(c => c.CreateChartDesignComponent)
    // this.designContainer.createComponent(remoteComp3)
  }
}
