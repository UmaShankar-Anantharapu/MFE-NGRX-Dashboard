import { Component, OnDestroy, OnInit } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import Highcharts, { SeriesOptionsType } from 'highcharts';
import { coreModule } from '../../../../shared/libs/core.module';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartOptionsState, GlobalState } from '../../../../shared/store/states/state';
import { HighchartsComponent } from '../highcharts/highcharts.component';
import { selectChartData } from '../../../../shared/store/selectors/selector';
import { CommonService } from '../../../../shared/common-services/common-service.service';
import { v4 as uuidv4 } from 'uuid';
import { LoadChartService } from '../services/load-chart.service';
import { MaterialModule } from '../../../../shared/angular-themes/material.module';
import { GraphqlService } from '../services/graphql.service';
import { TableComponent } from '../table/table.component';
import { updateChartOptions } from '../../../../shared/store/actions/chart.action';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [MaterialModule, HighChartsModule, coreModule, HighchartsComponent,TableComponent],
  providers: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit,OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsFinal: Highcharts.Options = {}
  isChartLoaded: boolean = false;
  chartOptionsSubs: Observable<any>;
  chart!: ChartOptionsState;
  chartOptionsLocal:ChartOptionsState={};
  tableChartOptions:any={};
  data:any;
  chartOptionsForHighCharts:Highcharts.Options={};
  constructor(private store: Store<GlobalState>,private commonService:CommonService, public loadChartService: LoadChartService,private graphqlService:GraphqlService) {
    this.chartOptionsSubs = this.store.select(selectChartData)
    this.chartOptionsSubs.subscribe((res: any) => {
      if (res) {
        this.chartOptionsLocal = res;
        this.fetchDataForChartAnLoad();
      }
    })
  }
  ngOnDestroy(): void {
    this.store.dispatch(updateChartOptions({data:{}}));
  }

  fetchDataForChartAnLoad(){
    if(this.chartOptionsLocal && this.chartOptionsLocal.dataset){
      this.chartOptionsLocal.type === 'table' ? this.loadTableChart() :this.onChartLoad();
    }
  }
  ngOnInit() {

  }
  private getAllKeysInChart(chartData: any): string[] {
    let keys: string[] = [];
    // console.log(chartData);
    switch(chartData.type){
      case 'line':
      case 'bar':
      case 'area':
      case 'column':
        keys.push(chartData.xAxis.axisKey);
        chartData.yAxis.forEach((axis: any) => {
          axis.seriesConf.forEach((series: any) => {
            keys.push(series.axisKey)
          })
        })
        break;
      case 'windrose':
        keys.push(chartData.xAxis.axisKey);
        keys = [...keys, ...chartData.windRoseFrequencies]
        break;
      default:
        break;
    }
    return keys;
  }

  async onChartLoad() {
    const usedKeys = this.getAllKeysInChart(this.chartOptionsLocal);
    const dataset = this.chartOptionsLocal.dataset || '';
    if (this.chartOptionsLocal.dataset !== undefined) {
      this.graphqlService.fetchDataFromCollectionByKeys(usedKeys, dataset).valueChanges.subscribe((res: any) => {
        // console.log(res);
        this.loadChartService.updateData(res.data[dataset], dataset);
        this.chartOptionsForHighCharts = { ...this.loadChartService.loadChart(this.chartOptionsLocal) }
        this.chartOptionsForHighCharts = this.loadChartService.loadChart(this.chartOptionsLocal)});
    }
    return;
}

loadTableChart(){
  const usedKeys = this.chartOptionsLocal.usedColumns || [];
  const dataset = this.chartOptionsLocal.dataset || '';
  this.graphqlService.fetchDataFromCollectionByKeys(usedKeys,dataset).valueChanges.subscribe((res: any) => {
    this.tableChartOptions={};
    this.tableChartOptions.data = res.data[dataset];
    this.tableChartOptions.title = this.chartOptionsLocal.title
    // this.setTableData();
  });
}

fetchTableChartData(){

}

  setBarChartData() {
  
    if (this.chartOptionsLocal?.xAxis?.axisKey !== undefined) {
      // this.chartOptionsForHighCharts.title = { text: this.chartOptionsLocal?.title?.text ?? 'Default Title' };
      this.chartOptionsForHighCharts.xAxis = {
        title: { text: this.chartOptionsLocal.xAxis.axisName ? this.chartOptionsLocal.xAxis.axisName : '' },
        // categories: this.data.map((item: any) => item[this.chartOptionsLocal?.xAxis?.axisKey!])
        categories: Array.from(new Set(this.data.map((item: any) => item[this.chartOptionsLocal?.xAxis?.axisKey!])))
      };
      this.chartOptionsForHighCharts.yAxis = [];
      this.setSeriesObject();
    }
  }

  setSeriesDataForPieChart() {
    if (this.chartOptionsForHighCharts.chart && this.chartOptionsLocal.seriesConfigurations && this.chartOptionsLocal.seriesConfigurations.label !== undefined) {
      this.chartOptionsForHighCharts.title = { text: this.chartOptionsLocal.title?.text }
      let seriesObj: any[] = []
      if (this.chartOptionsLocal.isDrillDownEnabled) {
        this.chartOptionsForHighCharts.drilldown = { series: [] }
        seriesObj = this.data.map((item: any) => {
          let id = uuidv4()
          let obj = {
            name: item[String(this.chartOptionsLocal.seriesConfigurations?.label)],
            y: Number(item[String(this.chartOptionsLocal.seriesConfigurations?.value)]),
            drilldown: id
          }
          this.createDrillDownSeriesObj(item, id)
          return obj;
        });
      } else {
        // series object with summation of filtered labels
        let categries: string[] = Array.from(new Set(this.data.map((item: any) => item[String(this.chartOptionsLocal.seriesConfigurations?.label)])))
        categries.forEach((cat: any) => {
          let filteredData = this.data.filter((item: any) => item[String(this.chartOptionsLocal.seriesConfigurations?.label)] === cat)
          let data = filteredData.reduce((sum: number, item: any) => sum + (Number(item[String(this.chartOptionsLocal.seriesConfigurations?.value)])) || 0, 0)
          seriesObj.push({
            name: cat,
            y: data
          })
        })

        // code for basic data of chart

        // seriesObj = this.data.map((item: any) => ({
        //   name: item[String(this.chartOptionsLocal.seriesConfigurations?.label)],
        //   y: Number(item[String(this.chartOptionsLocal.seriesConfigurations?.value)])
        // }));
      }
      if (this.chartOptionsLocal.type === 'donut') {
        this.chartOptionsForHighCharts.chart.type = 'pie'
        this.chartOptionsForHighCharts.plotOptions = { pie: { innerSize: '50%' } }
      }
      else if (this.chartOptionsLocal.type === 'pareto') {
        this.chartOptionsForHighCharts.chart.type = 'column'
      }
      if (this.chartOptionsLocal.threeDOptions) {
        this.chartOptionsForHighCharts.plotOptions = {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 20
          }
        }
        this.chartOptionsForHighCharts.chart.options3d = {
          enabled: true,
          alpha: Number(this.chartOptionsLocal.threeDOptions.alpha) || 0,
          depth: Number(this.chartOptionsLocal.threeDOptions.depth) || 0
        }
      }
      this.chartOptionsForHighCharts = { ...this.chartOptionsForHighCharts, series: [{ data: seriesObj }] as SeriesOptionsType[] }
    }
  }

  setSeriesObject() {
    if (this.chartOptionsLocal.yAxis) {
      // let series: { name?: string, data?: any[], yAxis?: number, plotOptions?: { series: { stacking: string } } }[] = [];
      let series: any | SeriesOptionsType[] = []
      let opposite = false;
      let addyAxisInx: boolean = this.chartOptionsLocal?.yAxis?.length > 1
      this.chartOptionsLocal.yAxis?.forEach((axis: any, axisInx: number) => {
        let yAxisObj = {
          title: { text: axis.title },
          opposite: opposite
        }
        let paretoYAxisObj = {};
        if (this.chartOptionsLocal.type === 'pareto') {
          paretoYAxisObj = {
            title: { text: 'cumilative percentage' },
            opposite: true,
            // labels: {
            //   formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            //     return Number(this.value).toFixed(2) + '%'; // Ensures two decimal points
            //   }
            // },
            min: 0,
            max: 100,
          }
        }
        axis.seriesConf.forEach((yAxisSeries: any, seriesInx: number) => {
          let seriesObj: { type?: string, name?: string, data?: any[], yAxis?: number, stacking?: string | null } = {}
          if (addyAxisInx) {
            seriesObj.yAxis = axisInx;
          }
          if (yAxisSeries.axisName) {
            seriesObj.name = yAxisSeries.axisName
          }
          if (this.chartOptionsLocal.type === 'pareto') {
            seriesObj.type = 'column'
          }
          if (this.chartOptionsLocal.isDrillDownEnabled) {
            this.chartOptionsForHighCharts.xAxis = { type: 'category', title: { text: this.chartOptionsLocal.xAxis?.axisName ? this.chartOptionsLocal.xAxis?.axisName : '' } }
            this.chartOptionsForHighCharts.drilldown = { series: [] }
            let serData;
            let xAxisKey = this.chartOptionsLocal.xAxis?.axisKey
            if (xAxisKey) {

              let data = this.data.map((item: any) => {
                let uuid = uuidv4()
                let obj = {
                  name: item[xAxisKey],
                  y: item[yAxisSeries.axisKey],
                  drilldown: uuid
                };
                this.createDrillDownSeriesObj(item, uuid)
                return obj;
              })
              serData = data
              // console.log(data);
            }
            seriesObj.data = serData
          } else {
            // for summation of data based on similar categories
            if (!Array.isArray(this.chartOptionsForHighCharts.xAxis)) {
              let categories = this.chartOptionsForHighCharts.xAxis?.categories
              let xAxisKey = this.chartOptionsLocal.xAxis?.axisKey
              let yAxisKey = yAxisSeries.axisKey
              let seriesObjData: any = []
              if (categories && xAxisKey) {
                categories?.forEach((cat: string) => {
                  let filteredData = this.data.filter((item: any) => item[xAxisKey] === cat)
                  let data = filteredData.reduce((sum: number, item: any) => sum + (Number(item[yAxisKey]) || 0), 0)
                  seriesObjData.push(data)
                })
              }
              seriesObj.data = seriesObjData
            }


            // code for series object without any aggregation
            // seriesObj.data = this.data.map((item: any) => Number(item[yAxisSeries.axisKey]))
          }
          seriesObj.stacking = axis.isStackable ? 'normal' : null
          if (this.chartOptionsLocal.type === 'combination') {
            seriesObj.type = yAxisSeries.chartType
          }
          series.push(seriesObj)
          if (this.chartOptionsLocal.type === 'pareto') {
            let paretoSeriesObj: { type?: string, name?: string, yAxis?: number, baseSeries?: number } = {}
            paretoSeriesObj.type = 'pareto';
            paretoSeriesObj.name = (yAxisSeries?.axisName ? yAxisSeries?.axisName : '') + ' percentage';
            paretoSeriesObj.yAxis = 1;
            paretoSeriesObj.baseSeries = seriesInx * 2;
            series.push(paretoSeriesObj)
          }
        })
        if (Array.isArray(this.chartOptionsForHighCharts.yAxis)) {
          this.chartOptionsForHighCharts.yAxis?.push(yAxisObj)
          if (this.chartOptionsLocal.type === 'pareto') {
            this.chartOptionsForHighCharts.yAxis?.push(paretoYAxisObj)
          }
        }
        opposite = !opposite

      })
      this.chartOptionsForHighCharts.series = series as SeriesOptionsType[];
    }
  }
  setFrequencyDataForWindRoseChart() {
    if (this.chartOptionsForHighCharts.chart) {
      this.chartOptionsForHighCharts.chart.polar = true;
      this.chartOptionsForHighCharts.chart.type = 'column'
      this.chartOptionsForHighCharts.pane = {
        size: '85%'
      }
    }
    let xAxisKey = this.chartOptionsLocal.xAxis?.axisKey
    if (xAxisKey) {
      this.chartOptionsForHighCharts.title = { text: this.chartOptionsLocal.title?.text }
      this.chartOptionsForHighCharts.xAxis = {
        categories: this.data.map((item: any) => item[xAxisKey])
      }
    }
    if (this.chartOptionsLocal.yAxis) {
      this.chartOptionsForHighCharts.yAxis = [{
        title: { text: this.chartOptionsLocal.yAxis[0].title || '' },
      }]
    }
    this.chartOptionsForHighCharts.plotOptions = {
      series: {
        stacking: 'normal',
        shadow: false,
        // groupPadding: 0
      }
    }
    if (this.chartOptionsLocal.windRoseFrequencies) {
      let series = this.chartOptionsLocal.windRoseFrequencies.map(range => ({
        name: range,
        data: this.data.map((item: any) => item[range]),
        type: 'column'
      }));
      // console.log(series)
      this.chartOptionsForHighCharts.series = series as any
    }
  }

  createDrillDownSeriesObj(data: any, id: string, drillDownInx: number = 0) {
    if (this.chartOptionsLocal.drillDownOptions) {
      let drillDownOpt = this.chartOptionsLocal.drillDownOptions[drillDownInx];
      let seriesObj: { id: string, name: string, data: any[] } = { id: id, name: drillDownOpt.axisName ? drillDownOpt.axisName : '', data: [] }

      const nestedAttr = drillDownOpt.nestedAttr
      let xAxisKey = drillDownOpt.xAxis?.axisKey
      let yAxisKey = drillDownOpt.yAxis?.axisKey
      if (nestedAttr && xAxisKey && yAxisKey) {
        seriesObj.data = data[nestedAttr].map((item: any) => {
          let obj
          if (this.chartOptionsLocal && this.chartOptionsLocal.drillDownOptions && this.chartOptionsLocal.drillDownOptions[drillDownInx + 1]) {
            let drillDownId = uuidv4()
            obj = {
              name: item[xAxisKey],
              y: item[yAxisKey],
              drilldown: drillDownId
            }
            this.createDrillDownSeriesObj(item, drillDownId, drillDownInx + 1)
            return obj;
          } else {
            obj = {
              name: item[xAxisKey],
              y: item[yAxisKey]
            }
          }
          return obj
        })
        // console.log(seriesObj);
        if (this.chartOptionsForHighCharts.drilldown && this.chartOptionsForHighCharts.drilldown.series)
          this.chartOptionsForHighCharts.drilldown?.series.push(seriesObj as SeriesOptionsType)
      }
    }
  }

}
