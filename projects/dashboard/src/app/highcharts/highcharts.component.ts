import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts from 'highcharts';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore
@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [HighChartsModule, coreModule],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss'
})
export class HighchartsComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() isChartLoaded: boolean = false;
  chart!: ChartOptionsState
  @Input() chartOptions: Highcharts.Options = {}
  constructor(private store: Store<{ chartState: ChartOptionsState }>) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.isChartLoaded = false;
    this.chartOptions = { ...this.chartOptions };
    this.isChartLoaded = true;
  }
  ngOnInit() {

  }
  get hasChartOptions(): boolean {
    return this.chartOptions && Object.keys(this.chartOptions).length > 0;
  }

}
