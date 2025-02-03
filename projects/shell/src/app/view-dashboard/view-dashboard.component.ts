import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-dashboard.component.html',
  styleUrl: './view-dashboard.component.scss'
})
export class ViewDashboardComponent {

  gridView:boolean=true;
  userName: string;
  isLargeScreen: boolean = window.innerWidth >= 768;
  viewMode: 'grid' | 'list' = 'grid';
  dashboards: any = [
    { 
      name: 'Sales Dashboard', 
      creator: 'John Doe', 
      image: '../../assets/dummy-chart-image-1.png', 
      isFavorite: false 
    },
    { 
      name: 'Marketing Dashboard', 
      creator: 'Jane Smith', 
      image: '../../assets/dummy-chart-image-2.png', 
      isFavorite: true 
    },
    { 
      name: 'Finance Dashboard', 
      creator: 'Michael Lee', 
      image: '../../assets/dummy-chart-image-3.png', 
      isFavorite: false 
    },
    { 
      name: 'Employee Dashboard', 
      creator: 'Michael Lee', 
      image: '../../assets/dummy-chart-image-4.png', 
      isFavorite: false 
    }
  ];

  constructor(private router:Router, public http: HttpClient){
    this.userName = localStorage.getItem('user') || '{}' || 'dummy';
    console.log(this.userName);
    this.http.get(`./assets/dashboard-list.json`).subscribe((res: any) => {
      console.log(res);
      res = res.filter((dash: any) => dash.user === this.userName);
      this.dashboards = res
    })
    
  }
  setView(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 768;
  }
  navigateToCreateDashboard(){
    this.router.navigate(['/create-dashboard/']);
  }

  navigateToDashboard(dashboard: any){
    this.router.navigate([`/dashboard/${dashboard.id}`]);
  }
}
