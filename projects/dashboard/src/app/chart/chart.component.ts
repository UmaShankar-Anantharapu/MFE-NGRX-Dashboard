import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import Highcharts, { PointOptionsType, SeriesOptions, SeriesOptionsType } from 'highcharts';
import { coreModule } from '../../../../shared/libs/core.module';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import { updateChartOptions } from '../../../../shared/store/actions/action';
import { WebSocketServiceService } from '../services/web-socket-service.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [MaterialModule, HighChartsModule, coreModule],
  providers: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsFinal: Highcharts.Options = {
    "chart": {
      "type": "column"
    },
    "xAxis": {
      "title": {
        "text": ""
      },
      "categories": [
        "Three Gorges Dam",
        "Itaipu Dam",
        "Guri Dam"
      ]
    },
    "yAxis": [
      {
        "title": {},
        "opposite": false
      }
    ],
    "series": [
      {
        "data": [
          101000,
          98800,
          55600
        ],
        "stacking": null
      } as unknown as SeriesOptionsType
    ],
    "navigation": {
      "buttonOptions": {
        "enabled": true
      }
    },
    "exporting": {
      "enabled": true,
      "buttons": {
        "contextButton": {
          "menuItems": [
            "viewFullscreen",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG"
          ]
        }
      }
    },
    "credits": {
      "enabled": false
    }
  }
  isChartLoaded: boolean = true;
  data$: Observable<any>;
  chart!: ChartOptionsState
  HighChartChartInstance!: Highcharts.Chart;

  constructor(private store: Store<{ chartState: ChartOptionsState }>, private webSocketService: WebSocketServiceService) {
    this.data$ = this.store.select('chartState');
  }
  url = 'ws://localhost:8080';
  ngOnInit() {
    const socket$ = this.webSocketService.connect(this.url);
    socket$.subscribe(({
      next: (data) => {
        this.addChartPoint(data)
      },
      error: (err) => console.log(err),
      complete: () => console.log('WS closed')
    }))
  }

  chartInstance(event: any){
    this.HighChartChartInstance = event;
  }

  // addChartPoint(data: any){
  //   let point: PointOptionsType = {y: data.value}
  //   this.HighChartChartInstance.xAxis[0].categories.push(data.category)
  //   this.HighChartChartInstance.series[0].addPoint(point)
  // }

  addChartPoint(data: any) {
    let point: PointOptionsType = { y: data.value };

    this.HighChartChartInstance.xAxis[0].categories.push(data.category);
    this.HighChartChartInstance.series[0].addPoint(point);
    if (this.HighChartChartInstance.xAxis[0].categories.length > 12) {
      this.HighChartChartInstance.xAxis[0].categories.shift();

      this.HighChartChartInstance.series[0].data[0].remove();
    }
  }

}
