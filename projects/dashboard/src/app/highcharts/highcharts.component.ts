import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts from 'highcharts';
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
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartId!:string;
  @Input() isChartLoaded: boolean = false;
  chart!: ChartOptionsState
  @Input() chartOptions: Highcharts.Options = {};
  
  private socket!: Socket;

  constructor(private store: Store<{ chartState: ChartOptionsState }>) {
    this.socket = io('http://localhost:3000'); // WebSocket server URL

  }

  onChartDataUpdate(callback: (data: any) => void) {
    this.socket.on('chartDataUpdate', callback);
  }

  // Send updates to the server
  sendChartUpdate(data: any) {
    this.socket.emit('updateChart', data);
  }

  ngOnChanges(changes: SimpleChanges): void {
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
  
  // Apply the changes to the chart
  // chart.update(this.chartOptions, true);
  
  }


  ngOnInit() {
    this.socket.on('updateChart', (data: any[]) => {
      console.log('Received chart updates:', data);
      // this.charts = data;
    });
  }

  ngOnDestroy(): void {
    // Clean up the socket connection
    this.socket.disconnect();
  }

  get hasChartOptions(): boolean {
    return this.chartOptions && Object.keys(this.chartOptions).length > 0;
  }

}
