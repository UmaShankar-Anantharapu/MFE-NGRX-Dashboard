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
    { id: '1', title: 'Zone Wise Power Consumption' },
    { id: '2', title: 'Day Wise Power Consumption' },
    { id: '3', title: 'State Wise Share In Power Generation' },
    { id: '4', title: 'Solar and Wind Power Generation' },
    { id: '5', title: 'Wind Speed Vs Direction' },

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
