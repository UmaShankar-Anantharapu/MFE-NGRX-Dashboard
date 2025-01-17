import { Component, OnDestroy, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { coreModule } from '../../../../../shared/libs/core.module';
import { MaterialModule } from '../../../../../shared/materialUI/material.module';
import { ChartOptionsState } from '../../../../../shared/store/states/state';
import Highcharts, { SeriesOptionsType } from 'highcharts';
import { v4 as uuidv4 } from 'uuid';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../config.service';
    @Component({
  selector: 'app-create-chart-config',
  standalone: true,
  imports: [coreModule,
    MaterialModule,
    MatIconModule
  ],
  templateUrl: './create-chart-config.component.html',
  styleUrl: './create-chart-config.component.scss'
})
export class CreateChartConfigComponent implements OnDestroy{
  chartData$: Observable<any> = new Observable;
  chartState = signal<ChartOptionsState>({});
  constructor(private store: Store<any>, private configService:ConfigService){
    this.fetchDataSets();
    this.fetchChartData();
  }

  fetchDataSets(){
    this.datasets = this.configService.fetchDataSets()
  }
  fetchChartData(){
    this.chartData$ = this.store.select('chartState');
    this.chartData$.subscribe((chartState:ChartOptionsState)=>{
      this.chartState.set(chartState);
    })
  }
  ngOnDestroy(): void {
  }
    chart: any = {};
    data: any;
    chartOptionsLocal: ChartOptionsState = {};
    chartType: string = ''
    isChartLoaded: boolean = false
    columnsList: string[] = [];
    datasets:any[]=[];
    // datasets = ['renewableenergymix', 'india-energy-consumption', 'industrialpower', 'active-power', 'wind', 'griddistribution', 'hydro', 'power-generation', 'position-monitoring', 'windrose', 'drilldown01', 'countries'];
    Highcharts: typeof Highcharts = Highcharts;
    drillDownCharts: string[] = ['bar', 'column', 'pie', 'funnel', 'pareto', 'donut']
    // chartTypes = ['bar', 'column', 'area', 'line', 'pie', 'radar', 'scatter', 'bubble', 'heatmap', 'donut', 'polar', 'funnel', 'pyramid', 'gauge', 'pareto', 'wind rose'];
    chartTypes = ['bar', 'column', 'area', 'line', 'pie', 'donut', 'pareto', 'wind rose', 'combination'];
    combinationChartTypes = ['bar', 'column', 'area', 'line']
    chartOptions: Highcharts.Options = { chart: {} }
    chartOptionsFinal: Highcharts.Options = {}
    selectedChartType!: string;
    selectedDrillDownLevel?: number;
    columnsListForDrillDownMap: { [key: number]: any } = {};
    
    onChartLoad(designproperty?: string) {
      if (this.chartOptions.chart && !designproperty) {
        this.isChartLoaded = false;
        if (this.selectedChartType !== 'combination')
          this.chartOptions.chart.type = this.selectedChartType as any
        switch (this.selectedChartType) {
          case 'bar':
          case 'column':
          case 'line':
          case 'area':
          case 'pareto':
          case 'combination':
            this.setBarChartData();
            break;
          case 'pie':
          case 'donut':
            this.setSeriesDataForPieChart();
            break;
          case 'wind rose':
            this.setFrequencyDataForWindRoseChart()
            break;
          default:
            break;
        }
        this.chartOptionsFinal = this.chartOptions as any
        this.chartOptionsFinal = {
          ...this.chartOptionsFinal,
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
        setTimeout(() => {
          this.isChartLoaded = true
        })
      }
      else {
        this.chartOptions = { ...this.chartOptionsFinal, [designproperty as keyof Highcharts.Options]: this.chartOptionsLocal[designproperty as keyof ChartOptionsState] } as any;
        this.chartOptionsFinal = { ...this.chartOptionsFinal, [designproperty as keyof Highcharts.Options]: this.chartOptionsLocal[designproperty as keyof ChartOptionsState] }
      }
    }
  
  
    setBarChartData() {
  
      if (this.chartOptionsLocal?.xAxis?.axisKey !== undefined) {
        // this.chartOptions.title = { text: this.chartOptionsLocal?.title?.text ?? 'Default Title' };
        this.chartOptions.xAxis = {
          title: { text: this.chartOptionsLocal.xAxis.axisName ? this.chartOptionsLocal.xAxis.axisName : '' },
          // categories: this.data.map((item: any) => item[this.chartOptionsLocal?.xAxis?.axisKey!])
          categories: Array.from(new Set(this.data.map((item: any) => item[this.chartOptionsLocal?.xAxis?.axisKey!])))
        };
        this.chartOptions.yAxis = [];
        this.setSeriesObject();
      }
    }
  
    setSeriesDataForPieChart() {
      if (this.chartOptions.chart && this.chartOptionsLocal.seriesConfigurations && this.chartOptionsLocal.seriesConfigurations.label !== undefined) {
        this.chartOptions.title = { text: this.chartOptionsLocal.title?.text }
        let seriesObj: any[] = []
        if (this.chartOptionsLocal.isDrillDownEnabled) {
          this.chartOptions.drilldown = { series: [] }
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
        if (this.selectedChartType === 'donut') {
          this.chartOptions.chart.type = 'pie'
          this.chartOptions.plotOptions = { pie: { innerSize: '50%' } }
        }
        else if (this.selectedChartType === 'pareto') {
          this.chartOptions.chart.type = 'column'
        }
        if (this.chartOptionsLocal.threeDOptions) {
          this.chartOptions.plotOptions = {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 20
            }
          }
          this.chartOptions.chart.options3d = {
            enabled: true,
            alpha: Number(this.chartOptionsLocal.threeDOptions.alpha) || 0,
            depth: Number(this.chartOptionsLocal.threeDOptions.depth) || 0
          }
        }
        this.chartOptions = { ...this.chartOptions, series: [{ data: seriesObj }] as SeriesOptionsType[] }
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
          if (this.selectedChartType === 'pareto') {
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
            if (this.selectedChartType === 'pareto') {
              seriesObj.type = 'column'
            }
            if (this.chartOptionsLocal.isDrillDownEnabled) {
              this.chartOptions.xAxis = { type: 'category', title: { text: this.chartOptionsLocal.xAxis?.axisName ? this.chartOptionsLocal.xAxis?.axisName : '' } }
              this.chartOptions.drilldown = { series: [] }
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
                console.log(data);
              }
              seriesObj.data = serData
            } else {
              // for summation of data based on similar categories
              if (!Array.isArray(this.chartOptions.xAxis)) {
                let categories = this.chartOptions.xAxis?.categories
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
            if (this.selectedChartType === 'combination') {
              seriesObj.type = yAxisSeries.chartType
            }
            series.push(seriesObj)
            if (this.selectedChartType === 'pareto') {
              let paretoSeriesObj: { type?: string, name?: string, yAxis?: number, baseSeries?: number } = {}
              paretoSeriesObj.type = 'pareto';
              paretoSeriesObj.name = (yAxisSeries?.axisName ? yAxisSeries?.axisName : '') + ' percentage';
              paretoSeriesObj.yAxis = 1;
              paretoSeriesObj.baseSeries = seriesInx * 2;
              series.push(paretoSeriesObj)
            }
          })
          if (Array.isArray(this.chartOptions.yAxis)) {
            this.chartOptions.yAxis?.push(yAxisObj)
            if (this.selectedChartType === 'pareto') {
              this.chartOptions.yAxis?.push(paretoYAxisObj)
            }
          }
          opposite = !opposite
  
        })
        this.chartOptions.series = series as SeriesOptionsType[];
      }
    }
    setFrequencyDataForWindRoseChart() {
      if (this.chartOptions.chart) {
        this.chartOptions.chart.polar = true;
        this.chartOptions.chart.type = 'column'
        this.chartOptions.pane = {
          size: '85%'
        }
      }
      let xAxisKey = this.chartOptionsLocal.xAxis?.axisKey
      if (xAxisKey) {
        this.chartOptions.title = { text: this.chartOptionsLocal.title?.text }
        this.chartOptions.xAxis = {
          categories: this.data.map((item: any) => item[xAxisKey])
        }
      }
      if (this.chartOptionsLocal.yAxis) {
        this.chartOptions.yAxis = [{
          title: { text: this.chartOptionsLocal.yAxis[0].title || '' },
        }]
      }
      this.chartOptions.plotOptions = {
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
        console.log(series)
        this.chartOptions.series = series as any
      }
    }
  
    onChartSave() {
      this.chartOptionsLocal.id = uuidv4()
      this.chartOptionsLocal.type = this.selectedChartType;
      this.chartOptionsLocal.dataset = this.selectedDataSet;
    }
    selectedDataSet: string = ''
    selectDataSet(event: any) {
      // this.chartService.fetchData(event.source.value).subscribe((res: any) => {
      //   this.selectedDataSet = event.source.value
      //   // this.chartOptionsLocal.dataset = event.source.value
      //   this.data = res
      //   this.columnsList = Object.keys(this.data[0])
      // })
    }
    selectChart(event: any) {
      switch (event.source.value) {
        case 'bar':
        case 'line':
        case 'column':
        case 'area':
        case 'pareto':
        case 'combination':
          this.chartOptionsLocal.xAxis = {}
          this.chartOptionsLocal.yAxis = [{ seriesConf: [{}] }];
          break;
        case 'pie':
        case 'donut':
          this.chartOptionsLocal.seriesConfigurations = {};
          break
        case 'wind rose':
          this.chartOptionsLocal.xAxis = {}
          this.chartOptionsLocal.windRoseFrequencies = [];
          break;
      }
    }
    onOptionChange(type: string, value: any, index: number = 0) {
  
    }
    onInputChange(type: string, event: any, index: number = 0) {
  
    }
  
    onChartTypeChange(chartType: string) {
      this.selectedChartType = chartType;
      // Reset the chart options when chart type changes
      this.chartOptions = { ...this.chartOptions, xAxis: { title: { text: '' } }, yAxis: [{ title: { text: '' } }] };
    }
    addSeriesForChart(index: number) {
      if (this.chartOptionsLocal.yAxis && this.chartOptionsLocal.yAxis[index]) {
        this.chartOptionsLocal.yAxis[index].seriesConf?.push({})
      }
    }
    addAxisForChart() {
      this.chartOptionsLocal.yAxis?.push({ seriesConf: [{}] });
    }
    addDrillDownLevel() {
      if (this.chartOptionsLocal.drillDownOptions) {
        this.chartOptionsLocal.drillDownOptions?.push({})
        this.selectedDrillDownLevel = this.chartOptionsLocal?.drillDownOptions.length - 1
      }
    }
    onDeleteClick(axisIndex: number, inx: number) {
      if (this.chartOptionsLocal.yAxis)
        this.chartOptionsLocal.yAxis[axisIndex].seriesConf?.splice(inx, 1);
    }
    enable3DOptions(event: any) {
      if (event.checked) {
        this.chartOptionsLocal.threeDOptions = { enabled: true }
      } else {
        delete this.chartOptionsLocal.threeDOptions
      }
    }
    onChangeOfFrequency(event: any, value: string) {
      if (event.checked) {
        this.chartOptionsLocal.windRoseFrequencies?.push(value)
      } else {
        let inx = this.chartOptionsLocal.windRoseFrequencies?.findIndex((item: string) => item === value);
        if (inx)
          this.chartOptionsLocal.windRoseFrequencies?.splice(inx, 1)
      }
    }
    onDrillDownSelect(event: any) {
      if (event.checked) {
        this.chartOptionsLocal.drillDownOptions = [{}]
      }
    }
  
    isPopupVisible = false;
  
    openPopup() {
      this.isPopupVisible = true;
    }
  
    closePopup() {
      this.isPopupVisible = false;
    }
    savePopup(event: any) {
      this.isPopupVisible = false;
      this.chartOptionsLocal.drillDownOptions = event
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
          console.log(seriesObj);
          if (this.chartOptions.drilldown && this.chartOptions.drilldown.series)
            this.chartOptions.drilldown?.series.push(seriesObj as SeriesOptionsType)
        }
      }
    }
  
    designChange(map: any) {
      this.chartOptionsLocal = { ...this.chartOptionsLocal, [map.mainCategory]: map.chartOptions }
      this.onChartLoad(map.mainCategory);
    }
}
