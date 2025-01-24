import { Component } from '@angular/core';

import { coreModule } from '../../../../../shared/libs/core.module';
import { MaterialModule } from '../../../../../shared/materialUI/material.module';

@Component({
  selector: 'app-create-dashboard-config',
  standalone: true,
  imports: [coreModule, MaterialModule],
  templateUrl: './create-dashboard-config.component.html',
  styleUrl: './create-dashboard-config.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class CreateDashboardConfigComponent {
  chartsList: any[] = [
    { id: '1', title: 'Active-power' },
    { id: '2', title: 'day wise power generation' },
    { id: '3', title: 'position-monitoring' },
    { id: '4', title: 'Active-power multi-y' },
    { id: '5', title: 'Energy consumption by state' },
    { id: '6', title: 'Energy Consumption by city' },

  ];
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
