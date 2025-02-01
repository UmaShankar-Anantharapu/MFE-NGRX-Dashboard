import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/materialUI/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-chart-popup',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './edit-chart-popup.component.html',
  styleUrl: './edit-chart-popup.component.scss'
})
export class EditChartPopupComponent {
  chart: any
  addYAxisKey(){

  }
  addSeriesKey(){}
  saveChartOptions(){}
  cancelChartOptions(){}
}
