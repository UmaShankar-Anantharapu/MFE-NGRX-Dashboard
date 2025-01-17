import { Component } from '@angular/core';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import { coreModule } from '../../../../shared/libs/core.module';
import Highcharts from 'highcharts';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChartOptionsState } from '../../../../shared/store/states/state';

@Component({
  selector: 'app-highcharts',
  standalone: true,
  imports: [HighChartsModule,coreModule],
  templateUrl: './highcharts.component.html',
  styleUrl: './highcharts.component.scss'
})
export class HighchartsComponent {
  Highcharts: typeof Highcharts = Highcharts;
    chartOptionsFinal: Highcharts.Options = {}
    isChartLoaded: boolean = false;
    data$: Observable<any>;
    chart!: ChartOptionsState
  
    constructor(private store: Store<{chartState: ChartOptionsState}>){
      this.data$ = this.store.select('chartState');
    }
    ngOnInit() {
      
    }
}
