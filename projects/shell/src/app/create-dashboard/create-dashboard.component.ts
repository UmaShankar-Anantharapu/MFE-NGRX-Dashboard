import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { coreModule } from '../../../../shared/libs/core.module';
import { MaterialModule } from '../../../../shared/angular-themes/material.module';

@Component({
  selector: 'app-create-dashboard',
  standalone: true,
  imports: [MaterialModule, coreModule],
  templateUrl: './create-dashboard.component.html',
  styleUrl: './create-dashboard.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class CreateDashboardComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isExistingDashboard = false;
  }
    @ViewChild('gridContainer', { read: ViewContainerRef, static: false }) gridContainer!: ViewContainerRef;
  @ViewChild('configContainer', { read: ViewContainerRef, static: false }) configContainer2!: ViewContainerRef;
  @ViewChild('designContainer', { read: ViewContainerRef, static: false }) designContainer!: ViewContainerRef;
  dashboardName: string = 'Dashboard'
  isExistingDashboard: boolean = false;
  ngOnInit() {
    this.loadRemotes();
    window.addEventListener('dashboard', (event: any) => {
      this.dashboardName = event.detail.name
      this.isExistingDashboard = event.detail.id? true: false
    })
  }

  saveDashboard(){
    window.dispatchEvent(new CustomEvent('save-dashboard', {detail: this.dashboardName}));
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
