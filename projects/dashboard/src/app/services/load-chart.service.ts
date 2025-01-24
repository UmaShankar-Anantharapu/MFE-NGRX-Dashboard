import { Injectable } from '@angular/core';
import { SeriesOptionsType } from 'highcharts';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from '../../../../shared/common-services/common-service.service';
import { lastValueFrom } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LoadChartService {
  constructor(private commonService:CommonService, private webSocketService: WebSocketService) { }

  fetchData(datasetName: string) {
    return new Promise((resolve, reject) => {
      this.commonService.fetchData(datasetName).subscribe((res: any) => {
        this.dataSetData[datasetName] = res
        resolve(res)
      })
    })
  }

  dataSetData: {[key: string]: any} = {}


  loadChart(chartOptionsConfig: any) {
    this.webSocketService.subscribeToDataSet(chartOptionsConfig.dataset);
    // this.fetchData(chartOptionsConfig.dataset)
    let chartOptionsForHighCharts:Highcharts.Options={}
    if (chartOptionsConfig.type !== 'combination'){
      chartOptionsForHighCharts.chart={};
      chartOptionsForHighCharts.chart.type = chartOptionsConfig.type as any
    }
    switch (chartOptionsConfig.type) {
      case 'bar':
      case 'column':
      case 'line':
      case 'area':
      case 'pareto':
      case 'combination':
        this.setBarChartData(chartOptionsConfig, chartOptionsForHighCharts);
        break;
      case 'pie':
      case 'donut':
        this.setSeriesDataForPieChart(chartOptionsConfig, chartOptionsForHighCharts);
        break;
      case 'wind rose':
        this.setFrequencyDataForWindRoseChart(chartOptionsConfig, chartOptionsForHighCharts)
        break;
      default:
        break;
    }
    chartOptionsForHighCharts = {...chartOptionsForHighCharts} as any
    chartOptionsForHighCharts = {
      ...chartOptionsForHighCharts,
      navigation: {
        buttonOptions: {
          enabled: true
        }
      },
      "exporting": {
        enabled: true,
        "buttons": {
          "contextButton": {
            "menuItems": [
              "viewFullscreen",
              "separator",
              "downloadPNG",
              "downloadJPEG",
              "downloadPDF",
              "downloadSVG",
            ]
          }
        }
      },
      credits: {
        enabled: false
      }
    }
    return chartOptionsForHighCharts
  }

  setBarChartData(chartOptionsConfig: any, chartOptionsForHighCharts: Highcharts.Options) {
  
    if (chartOptionsConfig?.xAxis?.axisKey !== undefined) {
      // this.chartOptionsForHighCharts.title = { text: chartOptionsConfig?.title?.text ?? 'Default Title' };
      chartOptionsForHighCharts.xAxis = {
        title: { text: chartOptionsConfig.xAxis.axisName ? chartOptionsConfig.xAxis.axisName : '' },
        // categories: this.data.map((item: any) => item[chartOptionsConfig?.xAxis?.axisKey!])
        categories: Array.from(new Set(this.dataSetData[chartOptionsConfig.dataset].map((item: any) => item[chartOptionsConfig?.xAxis?.axisKey!])))
      };
      chartOptionsForHighCharts.yAxis = [];
      this.setSeriesObject(chartOptionsConfig, chartOptionsForHighCharts);
    }
  }

  setSeriesObject(chartOptionsConfig: any, chartOptionsForHighCharts: Highcharts.Options) {
    if (chartOptionsConfig.yAxis) {
      // let series: { name?: string, data?: any[], yAxis?: number, plotOptions?: { series: { stacking: string } } }[] = [];
      let series: any | SeriesOptionsType[] = []
      let opposite = false;
      let addyAxisInx: boolean = chartOptionsConfig?.yAxis?.length > 1
      chartOptionsConfig.yAxis?.forEach((axis: any, axisInx: number) => {
        let yAxisObj = {
          title: { text: axis.title },
          opposite: opposite
        }
        let paretoYAxisObj = {};
        if (chartOptionsConfig.type === 'pareto') {
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
          if (chartOptionsConfig.type === 'pareto') {
            seriesObj.type = 'column'
          }
          if (chartOptionsConfig.isDrillDownEnabled) {
            chartOptionsForHighCharts.xAxis = { type: 'category', title: { text: chartOptionsConfig.xAxis?.axisName ? chartOptionsConfig.xAxis?.axisName : '' } }
            chartOptionsForHighCharts.drilldown = { series: [] }
            let serData;
            let xAxisKey = chartOptionsConfig.xAxis?.axisKey
            if (xAxisKey) {

              let data = this.dataSetData[chartOptionsConfig.dataset].map((item: any) => {
                let uuid = uuidv4()
                let obj = {
                  name: item[xAxisKey],
                  y: item[yAxisSeries.axisKey],
                  drilldown: uuid
                };
                this.createDrillDownSeriesObj(chartOptionsConfig, chartOptionsForHighCharts, item, uuid)
                return obj;
              })
              serData = data
              console.log(data);
            }
            seriesObj.data = serData
          } else {
            // for summation of data based on similar categories
            if (!Array.isArray(chartOptionsForHighCharts.xAxis)) {
              let categories = chartOptionsForHighCharts.xAxis?.categories
              let xAxisKey = chartOptionsConfig.xAxis?.axisKey
              let yAxisKey = yAxisSeries.axisKey
              let seriesObjData: any = []
              if (categories && xAxisKey) {
                categories?.forEach((cat: string) => {
                  let filteredData = this.dataSetData[chartOptionsConfig.dataset].filter((item: any) => item[xAxisKey] === cat)
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
          if (chartOptionsConfig.type === 'combination') {
            seriesObj.type = yAxisSeries.chartType
          }
          series.push(seriesObj)
          if (chartOptionsConfig.type === 'pareto') {
            let paretoSeriesObj: { type?: string, name?: string, yAxis?: number, baseSeries?: number } = {}
            paretoSeriesObj.type = 'pareto';
            paretoSeriesObj.name = (yAxisSeries?.axisName ? yAxisSeries?.axisName : '') + ' percentage';
            paretoSeriesObj.yAxis = 1;
            paretoSeriesObj.baseSeries = seriesInx * 2;
            series.push(paretoSeriesObj)
          }
        })
        if (Array.isArray(chartOptionsForHighCharts.yAxis)) {
          chartOptionsForHighCharts.yAxis?.push(yAxisObj)
          if (chartOptionsConfig.type === 'pareto') {
            chartOptionsForHighCharts.yAxis?.push(paretoYAxisObj)
          }
        }
        opposite = !opposite

      })
      chartOptionsForHighCharts.series = series as SeriesOptionsType[];
    }
  }

  createDrillDownSeriesObj(chartOptionsConfig: any, chartOptionsForHighCharts: Highcharts.Options, data: any, id: string, drillDownInx: number = 0) {
    if (chartOptionsConfig.drillDownOptions) {
      let drillDownOpt = chartOptionsConfig.drillDownOptions[drillDownInx];
      let seriesObj: { id: string, name: string, data: any[] } = { id: id, name: drillDownOpt.axisName ? drillDownOpt.axisName : '', data: [] }

      const nestedAttr = drillDownOpt.nestedAttr
      let xAxisKey = drillDownOpt.xAxis?.axisKey
      let yAxisKey = drillDownOpt.yAxis?.axisKey
      if (nestedAttr && xAxisKey && yAxisKey) {
        seriesObj.data = data[nestedAttr].map((item: any) => {
          let obj
          if (chartOptionsConfig && chartOptionsConfig.drillDownOptions && chartOptionsConfig.drillDownOptions[drillDownInx + 1]) {
            let drillDownId = uuidv4()
            obj = {
              name: item[xAxisKey],
              y: item[yAxisKey],
              drilldown: drillDownId
            }
            this.createDrillDownSeriesObj(chartOptionsConfig, chartOptionsForHighCharts, item, drillDownId, drillDownInx + 1)
            return obj;
          } else {
            obj = {
              name: item[xAxisKey],
              y: item[yAxisKey]
            }
          }
          return obj
        })
        console.log(seriesObj);
        if (chartOptionsForHighCharts.drilldown && chartOptionsForHighCharts.drilldown.series)
          chartOptionsForHighCharts.drilldown?.series.push(seriesObj as SeriesOptionsType)
      }
    }
  }

  setSeriesDataForPieChart(chartOptionsConfig: any, chartOptionsForHighCharts: Highcharts.Options) {
    if (chartOptionsForHighCharts.chart && chartOptionsConfig.seriesConfigurations && chartOptionsConfig.seriesConfigurations.label !== undefined) {
      chartOptionsForHighCharts.title = { text: chartOptionsConfig.title?.text }
      let seriesObj: any[] = []
      if (chartOptionsConfig.isDrillDownEnabled) {
        chartOptionsForHighCharts.drilldown = { series: [] }
        seriesObj = this.dataSetData[chartOptionsConfig.dataset].map((item: any) => {
          let id = uuidv4()
          let obj = {
            name: item[String(chartOptionsConfig.seriesConfigurations?.label)],
            y: Number(item[String(chartOptionsConfig.seriesConfigurations?.value)]),
            drilldown: id
          }
          this.createDrillDownSeriesObj(chartOptionsConfig, chartOptionsForHighCharts, item, id)
          return obj;
        });
      } else {
        // series object with summation of filtered labels
        let categries: string[] = Array.from(new Set(this.dataSetData[chartOptionsConfig.dataset].map((item: any) => item[String(chartOptionsConfig.seriesConfigurations?.label)])))
        categries.forEach((cat: any) => {
          let filteredData = this.dataSetData[chartOptionsConfig.dataset].filter((item: any) => item[String(chartOptionsConfig.seriesConfigurations?.label)] === cat)
          let data = filteredData.reduce((sum: number, item: any) => sum + (Number(item[String(chartOptionsConfig.seriesConfigurations?.value)])) || 0, 0)
          seriesObj.push({
            name: cat,
            y: data
          })
        })

        // code for basic data of chart

        // seriesObj = this.data.map((item: any) => ({
        //   name: item[String(chartOptionsConfig.seriesConfigurations?.label)],
        //   y: Number(item[String(chartOptionsConfig.seriesConfigurations?.value)])
        // }));
      }
      if (chartOptionsConfig.type === 'donut') {
        chartOptionsForHighCharts.chart.type = 'pie'
        chartOptionsForHighCharts.plotOptions = { pie: { innerSize: '50%' } }
      }
      else if (chartOptionsConfig.type === 'pareto') {
        chartOptionsForHighCharts.chart.type = 'column'
      }
      if (chartOptionsConfig.threeDOptions) {
        chartOptionsForHighCharts.plotOptions = {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 20
          }
        }
        chartOptionsForHighCharts.chart.options3d = {
          enabled: true,
          alpha: Number(chartOptionsConfig.threeDOptions.alpha) || 0,
          depth: Number(chartOptionsConfig.threeDOptions.depth) || 0
        }
      }
      chartOptionsForHighCharts.series = [{data: seriesObj}] as SeriesOptionsType[]
      // chartOptionsForHighCharts = { ...chartOptionsForHighCharts, series: [{ data: seriesObj }] as SeriesOptionsType[] }
    }
  }

  setFrequencyDataForWindRoseChart(chartOptionsConfig: any, chartOptionsForHighCharts: Highcharts.Options) {
    if (chartOptionsForHighCharts.chart) {
      chartOptionsForHighCharts.chart.polar = true;
      chartOptionsForHighCharts.chart.type = 'column'
      chartOptionsForHighCharts.pane = {
        size: '85%'
      }
    }
    let xAxisKey = chartOptionsConfig.xAxis?.axisKey
    if (xAxisKey) {
      chartOptionsForHighCharts.title = { text: chartOptionsConfig.title?.text }
      chartOptionsForHighCharts.xAxis = {
        categories: this.dataSetData[chartOptionsConfig.dataset].map((item: any) => item[xAxisKey])
      }
    }
    if (chartOptionsConfig.yAxis) {
      chartOptionsForHighCharts.yAxis = [{
        title: { text: chartOptionsConfig.yAxis[0].title || '' },
      }]
    }
    chartOptionsForHighCharts.plotOptions = {
      series: {
        stacking: 'normal',
        shadow: false,
        // groupPadding: 0
      }
    }
    if (chartOptionsConfig.windRoseFrequencies) {
      let series = chartOptionsConfig.windRoseFrequencies.map((range: any) => ({
        name: range,
        data: this.dataSetData[chartOptionsConfig.dataset].map((item: any) => item[range]),
        type: 'column'
      }));
      console.log(series)
      chartOptionsForHighCharts.series = series as any
    }
  }
}
