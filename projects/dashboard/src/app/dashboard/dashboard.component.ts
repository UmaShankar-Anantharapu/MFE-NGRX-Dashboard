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
import { GraphqlService } from '../services/graphql.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChartPopupComponent } from './edit-chart-popup/edit-chart-popup.component';
import { CommonService } from '../../../../shared/common-services/common-service.service';
import { v4 as uuid } from 'uuid'
import { ActivatedRoute } from '@angular/router';
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
  constructor(private http: HttpClient, public loadChartService: LoadChartService, private webSocketService: WebSocketService, public graphqlService: GraphqlService, private dialog: MatDialog, private commonService: CommonService, private activatedRoute: ActivatedRoute) {
    if(this.activatedRoute.snapshot.routeConfig?.path !== 'create-dashboard'){
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.http.get(`http://localhost:3000/dashboard/${id}`).subscribe((res: any) => {
        console.log(res);
        this.dashboard = res.dashboard
        window.dispatchEvent(new CustomEvent('dashboard-name', {detail: res.name}));
        if(this.dashboard){
          this.loadDashboard()
        }
      })
      // this.dashboard = JSON.parse(this.activatedRoute.snapshot.queryParams['data']).dashboard
    }
    
    
    window.addEventListener('save-dashboard', (event: any) => {
      this.saveDashboard(event.detail);
    })
    this.webSocketService.updatedData$.subscribe((res: any) => {
      console.log(res);
      if(res.event in Object.keys(this.chartIdsByDataSetNamesMap)){
        this.updateChartData(res.payload)
      }
    });
  }

  ngOnInit() {
    this.webSocketService.connect()
    // this.dashboard.push({ x: 0, y: 0, rows: 2, cols: 2, id: 20 })
    window.addEventListener('mfe-drag-end', (event: any) => {
      this.onDrop(event);
    });
  }
  async onDrop(event: any) {
    this.http.get(`http://localhost:3000/charts/${event.detail.data.id}`).subscribe((res: any) => {
      let recievedData = res;
      this.load(recievedData)
      this.dashboard.push({ x: 0, y: 0, rows: 6, cols: 6, id: recievedData.id });
    })
  }

  loadDashboard(){
    this.dashboard.forEach((item: any) => {
      this.http.get(`http://localhost:3000/charts/${item.id}`).subscribe((res: any) => {
        console.log(res);
        this.load(res)
      })
    })
  }

  load(recievedData: any) {
    const usedKeys = this.getAllKeysInChart(recievedData)
    this.graphqlService.fetchDataFromCollectionByKeys(usedKeys, recievedData.dataset).valueChanges.subscribe((res: any) => {
      console.log(res);
      // this.loadChartService.fetchData(recievedData.dataset)
      this.loadChartService.updateData(res.data[recievedData.dataset], recievedData.dataset);
      this.highChartsOptionsMap[recievedData.id] = this.loadChartService.loadChart(recievedData)
      if(!this.chartIdsByDataSetNamesMap[recievedData.dataset])
        this.chartIdsByDataSetNamesMap[recievedData.dataset] = [];
      this.chartIdsByDataSetNamesMap[recievedData.dataset].push(recievedData)
    });
    this.graphqlService.subscriptionForCollection(usedKeys, recievedData.subscriptionName).subscribe((res: any) => {
      console.log(res);
      let data = res.data[recievedData.subscriptionName].publishObj
      if(data){
        switch(data.operationType){
          case 'insert': 
            this.insertNewDataInChart(data.fullDocument, recievedData.dataset);
            break;
          case 'update':
            this.updateDataInChart(data.fullDocument, data.documentKey, recievedData.dataset, usedKeys);
            break;
          case 'delete':
            break;
        }
      }
    });
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
        // this.updateDataInChart()
        break;
      case 'insert':
        this.insertNewDataInChart(updatedObj.document, updatedObj.collection)
        break;
    }
  }

  insertNewDataInChart(document: any, dataSetName: string){
    this.chartIdsByDataSetNamesMap[dataSetName].forEach((chartOptLocal: any) => {
      let insertedValues: any = []
      chartOptLocal.yAxis.forEach((axis: any, axisInx: number) => {
        axis.seriesConf.forEach((series: any, seriesInx: number) => {
          let val = {
            axisInx: axisInx,
            seriesInx: seriesInx,
            axisKey: series.axisKey,
            value: document[series.axisKey]
          }
          insertedValues.push(val)
        })
      })
      let updatedObj: UpdateObjectType = {action: 'insert',
                                          chartType: chartOptLocal.type, 
                                          category: chartOptLocal.xAxis.axisKey,
                                          categoryValue: document[chartOptLocal.xAxis.axisKey],
                                          value: insertedValues}
      this.latestDataFromWebSocketByChartIds[chartOptLocal.id] = updatedObj
    })
  }
  updateDataInChart(document: any,documentKey: string, dataSetName: string, usedKeys: string[]) {
    let commonKeys = Object.keys(document).some(item => usedKeys.includes(item))
    if(commonKeys){
      this.chartIdsByDataSetNamesMap[dataSetName].forEach((chartOptLocal: any) =>{
        let updatedVal: any = [];
        // if(Object.keys(document).includes(chartOptLocal.xAxis.axisKey)){

        // }
        chartOptLocal.yAxis.forEach((axis: any, axisInx: number) => {
          axis.seriesConf.forEach((series: any, seriesInx: number) => {
            if(Object.keys(document).includes(series.axisKey)){
              console.log(series);
              let val = {
                axisInx: axisInx,
                seriesInx: seriesInx,
                axisKey: series.axisKey,
                value: document[series.axisKey]
              }
              updatedVal.push(val)
            }
          })
        })
        const dataSetData = this.loadChartService.getDocumentFromDataSetById(dataSetName, documentKey)
        let updatedObj = {
          action: 'update',
          chartType: chartOptLocal.type,
          categoryValue: dataSetData[chartOptLocal.xAxis.axisKey],
          values: updatedVal
        }
        this.latestDataFromWebSocketByChartIds[chartOptLocal.id] = updatedObj;
      });
    }
  }


  insert(id: string){
    this.insertNewDataInChart({time: 'abc', power_mw: "233", blade_angle: "2.1", pitch_angle: "2.3", pitch_angle_set: "3"}, 'activepower')
    // this.latestDataFromWebSocketByChartIds[id] = {insert: {updatedFields: {power: 55}}}
  }

  private getAllKeysInChart(chartData: any): string[] {
    let keys: string[] = [];
    console.log(chartData);
    keys.push(chartData.xAxis.axisKey);
    chartData.yAxis.forEach((axis: any) => {
      axis.seriesConf.forEach((series: any) => {
        keys.push(series.axisKey)
      })
    })
    return keys;
  }
  // open a popup on event is true
  editChart(event: boolean, chartId: any){
    if(event){
      this.dialog.open(EditChartPopupComponent, {
        width: '70%',
        height: '60%',
        // disableClose: true
      })
    }
  }

  saveDashboard(dashboardName: string) {
    let saveObj:any = {
      user: 'shankar',
      id: uuid(),
      name: dashboardName,
      dashboard: this.dashboard
    }
    console.log(saveObj);
    this.http.post(`http://localhost:3000/charts`, saveObj)
    console.log('saved');
    
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