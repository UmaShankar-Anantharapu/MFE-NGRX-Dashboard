import { Component } from '@angular/core';

import { coreModule } from '../../../../../shared/libs/core.module';
import { MaterialModule } from '../../../../../shared/materialUI/material.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-dashboard-config',
  standalone: true,
  imports: [coreModule, MaterialModule],
  templateUrl: './create-dashboard-config.component.html',
  styleUrl: './create-dashboard-config.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class CreateDashboardConfigComponent {
  chartsList: any[] = [];
  constructor(public http: HttpClient){
    this.http.get('http://localhost:3000/charts').subscribe((res: any) => {
      this.chartsList = res
    })
  }
  onDragStart(event: any): void {
    localStorage.setItem('dragState', 'false');
    // const dragData = { id: 1, name: 'Item from MFE1' };
    // const customEvent = new CustomEvent('mfe-drag-start', { detail: dragData });
    // window.dispatchEvent(customEvent);
    // console.log('drag started');
  }

  onDragEnd(event: any): void {
    if (localStorage.getItem('dragState') === 'true') {
      let ele = event.event.target as HTMLElement
      const customEvent = new CustomEvent('mfe-drag-end', { detail: event.source });
      window.dispatchEvent(customEvent);
    }
    localStorage.removeItem('dragState')
  }
  trackById(ind: any, item: any) {
    return item.id;
  }
}
