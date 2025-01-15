import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { coreModule } from '../../../../../shared/libs/core.module';
import { DragDropService } from '../../../../../shared/services/drag-drop.service';
import { CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-chart-config',
  standalone: true,
  imports: [coreModule, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './create-chart-config.component.html',
  styleUrl: './create-chart-config.component.scss'
})
export class CreateChartConfigComponent implements OnInit {
  droppedCharts: string[] = ['chart1', 'chart2', 'chart3', 'chart4']
  chartData$: Observable<any>;
  chartList: string[] = ['chart1', 'chart2', 'chart3', 'chart4']
  constructor(private store: Store<any>, public dragDropService: DragDropService){
    this.chartData$ = this.store.select('chartState')
  }
  ngOnInit() {
    this.dragDropService.getDragStart().subscribe((chart) => {
      console.log('Drag started:', chart);
    });  }
  onDrop(event: any) {
    const droppedChart = event.item.data;
    this.droppedCharts.push(droppedChart);
    console.log('Dropped chart:', droppedChart);
  }

}
