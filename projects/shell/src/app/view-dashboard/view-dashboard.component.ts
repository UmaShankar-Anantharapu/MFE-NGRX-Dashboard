import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-dashboard.component.html',
  styleUrl: './view-dashboard.component.scss'
})
export class ViewDashboardComponent {
  gridView:boolean=true;
  isLargeScreen: boolean = window.innerWidth >= 768;
  viewMode: 'grid' | 'list' = 'grid';
  dashboards = [
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

  constructor(){

  }
  setView(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 768;
  }
}
