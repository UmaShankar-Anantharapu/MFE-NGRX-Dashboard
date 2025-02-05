import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../shared/angular-themes/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { coreModule } from '../../../../../shared/libs/core.module';

@Component({
  selector: 'app-edit-chart-popup',
  standalone: true,
  imports: [MaterialModule, coreModule],
  templateUrl: './edit-chart-popup.component.html',
  styleUrl: './edit-chart-popup.component.scss'
})
export class EditChartPopupComponent {
  chartType = 'Line Chart';
  chartTitle = '';
  chartTypes = ['line', 'bar', 'area', 'column'];

  xAxis = { key: '', name: '' };
  yAxes = [
    { name: 'Y-Axis 1', series: [{ key: '', name: '' }] }
  ];

  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  onSave() {
    this.dialogRef.close(this.data.chartOptions);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addMore(type: string, ind: number = 0){
    if(type === 'series'){
      this.data.chartOptions.yAxis[ind].seriesConf.push({ axisKey: '', axisName: '' })
    }else{
      this.data.chartOptions.yAxis.push({seriesConf: [], title: ''})
    }
  }
  delete(type: string, Axisinx: number, seriesInx?: number){
    if(type === 'series'){
      this.data.chartOptions.yAxis[Axisinx].seriesConf.splice(seriesInx, 1);
    }else{
      this.data.chartOptions.yAxis.splice(Axisinx, 1);
    }
  }
}
