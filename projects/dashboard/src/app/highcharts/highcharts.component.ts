import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts from 'highcharts';
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
export class HighchartsComponent implements OnChanges {
    @Input() showRemoveOption!:boolean;
  Highcharts: typeof Highcharts = Highcharts;
  @Input() isChartLoaded: boolean = false;
  chart!: ChartOptionsState
  @Input() chartOptions: Highcharts.Options = {}
  constructor(private store: Store<{ chartState: ChartOptionsState }>) {
  }
  ngOnChanges(changes: SimpleChanges): void {
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
  
  // Apply the changes to the chart
  // chart.update(this.chartOptions, true);
  
  }

  ngOnInit() {

  }
  get hasChartOptions(): boolean {
    return this.chartOptions && Object.keys(this.chartOptions).length > 0;
  }

}
