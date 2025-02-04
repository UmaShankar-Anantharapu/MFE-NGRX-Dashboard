import { Routes } from '@angular/router';
import { CreateChartComponent } from './create-chart/create-chart.component';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import { ViewDashboardComponent } from './view-dashboard/view-dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'dashboard'
    },
    {
        path: 'chart', component: CreateChartComponent, canActivate: [authGuard]
    },
    {
        path: 'dashboard/:id', component: CreateDashboardComponent, canActivate: [authGuard]
    },
    {
        path: 'create-dashboard', component: CreateDashboardComponent, canActivate: [authGuard]
    },
    {
        path:'dashboard', component:ViewDashboardComponent, canActivate: [authGuard]
    },
    {
        path:'login',component:LoginComponent
    },
    {
        path:'sign-up',component:SignupComponent
    }
];
