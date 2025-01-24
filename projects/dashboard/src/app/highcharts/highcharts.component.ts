import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, output } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts, { PointOptionsType } from 'highcharts';
import { Store } from '@ngrx/store';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import HighchartsMore from 'highcharts/highcharts-more';
import ExportingModule from 'highcharts/modules/exporting';
import { io, Socket } from 'socket.io-client';


HighchartsMore
ExportingModule
@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [HighChartsModule, coreModule],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss'
})
export class HighchartsComponent implements OnChanges,OnInit {
  @Input() showRemoveOption!:boolean;
  @Input() latestData:any;
  @Input() 
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartId!:string;
  @Input() isChartLoaded: boolean = false;
  chart!: ChartOptionsState
  @Input() chartOptions: Highcharts.Options = {};
  HighChartInstance: any;
  
  private socket!: Socket;

  constructor(private store: Store<{ chartState: ChartOptionsState }>) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.removeOptions()
    const latestData: any = changes['latestData']
    if(latestData && latestData.currentValue){
      const document = latestData.currentValue
      switch(document.action){
        case 'insert':
          this.addPointsInChart(document)
          break;
        case 'update':
          break;
      }
    } 
  
  }

  removeOptions(){
    if(this.showRemoveOption){

      let buttons:any={}
      if (Highcharts && Highcharts.getOptions()?.exporting?.buttons?.contextButton?.menuItems) {
        buttons = Highcharts.getOptions().exporting?.buttons?.contextButton?.menuItems?.slice();
        buttons?.push({
            text: 'Export to PNG (small)',
            onclick: function () {
                this.exportChart({
                    width: 250,
                });
            },
        });
    
        // Safely merge and update the menuItems
        this.chartOptions.exporting = this.chartOptions.exporting || {};
        this.chartOptions.exporting.buttons = this.chartOptions.exporting.buttons || {};
        this.chartOptions.exporting.buttons.contextButton = this.chartOptions.exporting.buttons.contextButton || {};
        this.chartOptions.exporting.buttons.contextButton.menuItems = [
            ...(this.chartOptions.exporting.buttons.contextButton.menuItems || []),
            ...buttons,
        ];
    }
  }
  }


  ngOnInit() {
    this.socket.on('updateChart', (data: any[]) => {
      console.log('Received chart updates:', data);
      // this.charts = data;
    });
  }

  onChartLoad(event:any){
    this.HighChartInstance = event;
  }

  ngOnDestroy(): void {
    // Clean up the socket connection
    this.socket.disconnect();
  }

  get hasChartOptions(): boolean {
    return this.chartOptions && Object.keys(this.chartOptions).length > 0;
  }

  addPointsInChart(data: any) {
    // this.HighChartInstance.xAxis[0].categories.push(data.category);
    // this.HighChartInstance.series[0].addPoint(data.value)
    this.HighChartInstance.xAxis[0].categories.push(data.categoryValue);
    data.value.forEach((updatedVal: any) => {
      const point: PointOptionsType = {y: Number(updatedVal.value)}
      let series = this.HighChartInstance.series.filter((s:any) => s.yAxis.index === updatedVal.axisInx)[updatedVal.seriesInx];
      console.log(series);
      series.addPoint(point)
      this.HighChartInstance.series[series.index] = series
      // this.HighChartInstance.yAxis[updatedVal.axisInx].series[updatedVal.seriesInx].data.push({y: updatedVal.value})
    })
  }

  updatePointsInChart(data: any) {
    let inx = this.HighChartInstance.xAxis[0].categories.findInx((cat:any) => cat === data.category)
    if(inx!==1){
      this.HighChartInstance.xAxis[0].categories[0] = data.category;
      this.HighChartInstance.series[0].data[inx].update(data.value);
    }
  }

  deletePointsInChart(data: any){

  }

}
