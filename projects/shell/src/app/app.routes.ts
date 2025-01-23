import { Routes } from '@angular/router';
import { CreateChartComponent } from './create-chart/create-chart.component';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import { ThemesComponent } from './themes/themes.component';

export const routes: Routes = [
    {
        path: 'chart', component: CreateChartComponent
    },
    {
        path: 'dashboard', component: CreateDashboardComponent
    },
    {
        path: 'themes', component: ThemesComponent
    }
];
