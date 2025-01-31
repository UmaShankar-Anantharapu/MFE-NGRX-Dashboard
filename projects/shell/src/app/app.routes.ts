import { Routes } from '@angular/router';
import { CreateChartComponent } from './create-chart/create-chart.component';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import { ViewDashboardComponent } from './view-dashboard/view-dashboard.component';

export const routes: Routes = [
    {
        path: 'chart', component: CreateChartComponent
    },
    {
        path: 'dashboard', component: CreateDashboardComponent
    },
    {
        path:'view-dashboard', component:ViewDashboardComponent
    }
];
