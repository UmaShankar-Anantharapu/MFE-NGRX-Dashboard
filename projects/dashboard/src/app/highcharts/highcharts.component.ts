import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, output, viewChild } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts, { PointOptionsType } from 'highcharts';
import { Store } from '@ngrx/store';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import HighchartsMore from 'highcharts/highcharts-more';
import ExportingModule from 'highcharts/modules/exporting';


HighchartsMore
ExportingModule
@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [HighChartsModule, coreModule],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss'
})
export class HighchartsComponent implements OnChanges, OnInit {  
  @Input() showRemoveOption!: boolean;
  @Input() latestData: any;
  @Input()
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartId!: string;
  @Input() isChartLoaded: boolean = false;
  chart!: ChartOptionsState
  @Input() chartOptions: Highcharts.Options = {};
  HighChartInstance: any;
  @Output() editChartEvent = new EventEmitter<boolean>();
  reload: boolean = true;


  constructor(private store: Store<{ chartState: ChartOptionsState }>) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.removeOptions()
    const latestData: any = changes['latestData']
    const latestChartOptions: any = changes['chartOptions']
    if (latestData && latestData.currentValue) {
      const document = latestData.currentValue
      switch (document.action) {
        case 'insert':
          this.addPointsInChart(document)
          break;
          case 'update':
            this.updatePointsInChart(document)
            break;
          }
        }else if(latestChartOptions){
          this.chartOptions = {...this.chartOptions} as any;
          if(latestChartOptions?.currentValue?.edit){
            this.reload = false
            // this.chartOptions = {}
            setTimeout(() => {
              this.reload = true
              if(this.HighChartInstance){
                this.HighChartInstance.redraw()
              }
            })
            // this.HighChartInstance.redraw();
          }
          // this.HighChartInstance.redraw();
        }
        this.addEditChartInContextButtons();

  }
  handleEditChart(event: any){
    console.log(event);
    this.editChartEvent.emit(true);
  }

  addEditChartInContextButtons() {
    if (Highcharts && Highcharts.getOptions()?.exporting?.buttons?.contextButton?.menuItems) {
      let buttons: any = {};
      buttons = Highcharts.getOptions().exporting?.buttons?.contextButton?.menuItems?.slice();
      console.log(buttons);
      
      
      // Remove the "Print Chart" button
      const index = buttons.findIndex((item: any) => item === 'printChart');
      if (index !== -1) {
        buttons.splice(index, 1);
      }
  
      // Add the "Edit Chart" button at the beginning
      buttons.unshift({
        text: 'Edit Chart',
        onclick: () => {
          this.handleEditChart(this.chartOptions); // Call the edit chart method with options
        },
      });
  
      this.chartOptions.exporting = this.chartOptions.exporting || {};
      this.chartOptions.exporting.buttons = this.chartOptions.exporting.buttons || {};
      this.chartOptions.exporting.buttons.contextButton = this.chartOptions.exporting.buttons.contextButton || {};
      this.chartOptions.exporting.buttons.contextButton.menuItems = buttons;
    }
  }

  // removeOptions() {
  //   if (this.showRemoveOption) {

  //     let buttons: any = {}
  //     if (Highcharts && Highcharts.getOptions()?.exporting?.buttons?.contextButton?.menuItems) {
  //       buttons = Highcharts.getOptions().exporting?.buttons?.contextButton?.menuItems?.slice();
  //       buttons?.push({
  //         text: 'Export to PNG (small)',
  //         onclick: function () {
  //           this.exportChart({
  //             width: 250,
  //           });
  //         },
  //       });
  //       // buttons.push({
  //       //   text: 'edit chart',
  //       //   onclick: function () {
  //       //     this.editChartPopup()
  //       //   }
  //       // })

  //       // Safely merge and update the menuItems
  //       this.chartOptions.exporting = this.chartOptions.exporting || {};
  //       this.chartOptions.exporting.buttons = this.chartOptions.exporting.buttons || {};
  //       this.chartOptions.exporting.buttons.contextButton = this.chartOptions.exporting.buttons.contextButton || {};
  //       this.chartOptions.exporting.buttons.contextButton.menuItems = [
  //         ...(this.chartOptions.exporting.buttons.contextButton.menuItems || []),
  //         ...buttons,
  //       ];
  //     }
  //   }
  // }


  ngOnInit() {
  }

  onChartLoad(event: any) {
    this.HighChartInstance = event;
  }

  ngOnDestroy(): void {
  }

  get hasChartOptions(): boolean {
    return Boolean(this.chartOptions && this.chartOptions.series && this.chartOptions.series.length > 0);
  }

  addPointsInChart(data: any) {
    // this.HighChartInstance.xAxis[0].categories.push(data.category);
    // this.HighChartInstance.series[0].addPoint(data.value)
    this.HighChartInstance.xAxis[0].categories.push(data.categoryValue);
    data.value.forEach((updatedVal: any) => {
      const point: PointOptionsType = { y: Number(updatedVal.value) }
      let series = this.HighChartInstance.series.filter((s: any) => s.yAxis.index === updatedVal.axisInx)[updatedVal.seriesInx];
      series.addPoint(point)
      this.HighChartInstance.series[series.index] = series
      // this.HighChartInstance.yAxis[updatedVal.axisInx].series[updatedVal.seriesInx].data.push({y: updatedVal.value})
    })
  }

  updatePointsInChart(data: any) {
    let inx = this.HighChartInstance.xAxis[0].categories.findIndex((cat: string) => cat === data.categoryValue);
    if (inx !== 1) {
      data.values.forEach((updatedVal: any) => {
        const point: PointOptionsType = { y: Number(updatedVal.value) }
        let series = this.HighChartInstance.series.filter((s: any) => s.yAxis.index === updatedVal.axisInx)[updatedVal.seriesInx];
        series.data[inx].update(point)
        this.HighChartInstance.series[series.index] = series;
      })
    }
    // let inx = this.HighChartInstance.xAxis[0].categories.findInx((cat:any) => cat === data.category)
    // if(inx!==1){
    //   this.HighChartInstance.xAxis[0].categories[0] = data.category;
    //   this.HighChartInstance.series[0].data[inx].update(data.value);
    // }
  }

  deletePointsInChart(data: any) {

  }

}
