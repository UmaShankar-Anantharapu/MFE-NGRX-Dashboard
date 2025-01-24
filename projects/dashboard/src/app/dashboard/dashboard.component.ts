import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { HighchartsChartComponent, HighchartsChartModule } from 'highcharts-angular';
import Highcharts, { chart } from 'highcharts';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterModule, GridType } from 'angular-gridster2';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { CommonModule } from '@angular/common';
import { coreModule } from '../../../../shared/libs/core.module';
import { HttpClient } from '@angular/common/http';
import { HighchartsComponent } from '../highcharts/highcharts.component';
import { LoadChartService } from '../services/load-chart.service';
import { WebSocketService } from '../services/websocket.service';
import { ChartOptionsState, axisConfiguration } from '../../../../shared/store/states/state';
import { update } from 'lodash';
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
  chartIdsByDataSetNamesMap: {[key: string]:  string[]} = {};
  latestDataFromWebSocketByChartIds: {[key: string]: any} = {};
  highChartsOptionsMap: { [key: string]: any } = {};
  highChartInstanceMap: {[key: string]: any} = {}
  dashboard: GridsterItem[] = [];
  options: GridsterConfig = {
    gridType: GridType.VerticalFixed,
    compactType: CompactType.None,
    useTransformPositioning: true,
    fixedRowHeight: 70,
    pushItems: true,
    maxCols: 12,
    minCols: 12,
    minRows: 12,
    maxRows: 1200,
    draggable: {
      enabled: true,
    },
    resizable: {
      enabled: true
    },
    displayGrid: DisplayGrid.OnDragAndResize, 
    disableWarnings: true,
    swap: true,
    swapWhileDragging: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    disableAutoPositionOnConflict: false,
    scrollToNewItems: true,
    enableOccupiedCellDrop: true,
    
  }
  constructor(private http: HttpClient, public loadChartService: LoadChartService, private webSocketService: WebSocketService) {
    this.webSocketService.updatedData$.subscribe((res: any) => {
      console.log(res);
      if(res.event in Object.keys(this.chartIdsByDataSetNamesMap)){
        this.updateChartData(res.payload)
      }
    })
  }

  ngOnInit() {
    this.webSocketService.connect()
    // this.dashboard.push({ x: 0, y: 0, rows: 2, cols: 2, id: 20 })
    window.addEventListener('mfe-drag-end', (event: any) => {
      this.onDrop(event);
    });
  }
  async onDrop(event: any) {
    this.http.get('/assets/charts-list.json').subscribe((res: any) => {
      let recievedData = res[event.detail.data.id - 1];
      this.load(recievedData)
      this.dashboard.push({ x: 0, y: 0, rows: 6, cols: 6, id: recievedData.id });
    })
  }

  async load(recievedData: any) {
    await this.loadChartService.fetchData(recievedData.dataset)
    this.highChartsOptionsMap[recievedData.id] = this.loadChartService.loadChart(recievedData)
    if(!this.chartIdsByDataSetNamesMap[recievedData.dataset])
      this.chartIdsByDataSetNamesMap[recievedData.dataset] = [];
    this.chartIdsByDataSetNamesMap[recievedData.dataset].push(recievedData)
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

  updateChartData(updatedObj: any) {
    switch(updatedObj.action) {
      case 'update':

        break;
      case 'insert':
        this.insertNewDataInChart(updatedObj.document, updatedObj.collection)
        break;
    }
  }

  insertNewDataInChart(document: any, dataSetName: string){
    this.chartIdsByDataSetNamesMap[dataSetName].forEach((chartOptLocal: any) => {
      let updatedVal: any = []
      chartOptLocal.yAxis.forEach((axis: any, axisInx: number) => {
        axis.seriesConf.forEach((series: any, seriesInx: number) => {
          let val = {
            axisInx: axisInx,
            seriesInx: seriesInx,
            axisKey: series.axisKey,
            value: document[series.axisKey]
          }
          updatedVal.push(val)
        })
      })
      let updatedObj: UpdateObjectType = {action: 'insert',
                                          chartType: chartOptLocal.type, 
                                          category: chartOptLocal.xAxis.axisKey,
                                          categoryValue: document[chartOptLocal.xAxis.axisKey],
                                          value: updatedVal}
      console.log(updatedVal);
      this.latestDataFromWebSocketByChartIds[chartOptLocal.id] = updatedObj
    })
  }
  insert(id: string){
    this.insertNewDataInChart({time: 'abc', power_mw: "233", blade_angle: "2.1", pitch_angle: "2.3", pitch_angle_set: "3"}, 'activepower')
    // this.latestDataFromWebSocketByChartIds[id] = {insert: {updatedFields: {power: 55}}}
  }

}

export class UpdateObjectType {
  action!: string
  chartType!: string;
  category!: string;
  categoryValue!: string;
  value!: {axisInx: number,
           seriesInx: number,
           axisKey: string,
           value: any }[]
}