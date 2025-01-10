import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import the required modules for Highcharts and Gridster
import { HighchartsChartModule } from 'highcharts-angular';

// Export them so they can be used in other modules
@NgModule({
  declarations: [],
  imports: [
    HighchartsChartModule,
  ],
  exports: [
    HighchartsChartModule
  ]
})
export class HighChartsModule { }
