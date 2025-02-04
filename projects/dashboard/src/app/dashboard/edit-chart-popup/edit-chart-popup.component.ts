import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../shared/angular-themes/material.module';

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
