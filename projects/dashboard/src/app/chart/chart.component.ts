import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import Highcharts from 'highcharts';
import { coreModule } from '../../../../shared/libs/core.module';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import { updateChartOptions } from '../../../../shared/store/actions/action';
import { HighchartsChartComponent } from 'highcharts-angular';
import { HighchartsComponent } from '../highcharts/highcharts.component';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [MaterialModule, HighChartsModule, coreModule,HighchartsComponent],
  providers: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
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
