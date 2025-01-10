import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { coreModule } from '../../../../../shared/libs/core.module';

@Component({
  selector: 'app-create-chart-config',
  standalone: true,
  imports: [coreModule],
  templateUrl: './create-chart-config.component.html',
  styleUrl: './create-chart-config.component.scss'
})
export class CreateChartConfigComponent {
  chartData$: Observable<any>;
  constructor(private store: Store<any>){
    this.chartData$ = this.store.select('chartState')
  }

}
