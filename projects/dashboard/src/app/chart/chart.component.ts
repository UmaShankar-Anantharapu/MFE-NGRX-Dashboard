import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/materialUI/material.module';
import { HighChartsModule } from '../../../../shared/libs/highcharts.module';
import Highcharts from 'highcharts';
import { coreModule } from '../../../../shared/libs/core.module';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartOptionsState } from '../../../../shared/store/states/state';
import { updateChartOptions } from '../../../../shared/store/actions/action';
import { DragDropService } from '../../../../shared/services/drag-drop.service';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [MaterialModule, HighChartsModule, coreModule, DragDropModule],
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
  droppedCharts: any[] = [];
  chartList: string[] = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5']

  constructor(private store: Store<{chartState: ChartOptionsState}>, private dragDropService: DragDropService){
    this.data$ = this.store.select('chartState');
  }
  ngOnInit() {
    this.dragDropService.getDragStart().subscribe((chart) => {
      console.log('Drag started:', chart);
    });
  }
  onDrop(event: any) {
    console.log(event);
    const droppedChart = event.item.data;
    this.droppedCharts.push(droppedChart);
    console.log('Dropped chart:', droppedChart);
  }
  
}
