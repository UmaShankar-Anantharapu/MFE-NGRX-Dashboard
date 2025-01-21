import { Component, Input, OnInit } from '@angular/core';
import { HighchartsChartComponent, HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { GridsterItem, GridsterModule, GridType } from 'angular-gridster2';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { CommonModule } from '@angular/common';
import { coreModule } from '../../../../shared/libs/core.module';
import { HttpClient } from '@angular/common/http';
import { HighchartsComponent } from '../highcharts/highcharts.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    coreModule,
    MaterialModule,
    GridsterModule,
    HighchartsComponent,
    HighchartsChartModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  hostID!: string;
  Highcharts = Highcharts;
  highChartsOptionsMap: { [key: string]: any } = {};
  dashboard: GridsterItem[] = [];
  options = {
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 70,
    maxCols: 12,
    minCols: 12,
    minRows: 12,
    maxRows: 1200,
    draggable: {
      enabled: true,
    },
    resizable: {
      enabled: true
    }
  }
  recievedData: any;
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    // this.dashboard.push({ x: 0, y: 0, rows: 2, cols: 2, id: 20 })
    window.addEventListener('mfe-drag-end', (event: any) => {
      this.onDrop(event);
    });
  }
  onDrop(event: any) {
    this.dashboard.push({ x: 0, y: 0, rows: 6, cols: 6, id: event.detail.data.id });
    this.http.get('/assets/charts-folder.json').subscribe((res: any) => {
      this.recievedData = res;
      this.highChartsOptionsMap[event.detail.data.id] = this.recievedData[event.detail.data.id - 1];
      console.log(event.detail.data.id);
    })
  }

  trackById(ind: any, item: any) {
    return item['id'];
  }
  mouse(val: string) {
    if (localStorage.getItem('dragState')) {
      if (val === 'leave') {
        localStorage.setItem('dragState', 'false');
      }
      else {
        localStorage.setItem('dragState', 'true');
      }
    }
  }

}
