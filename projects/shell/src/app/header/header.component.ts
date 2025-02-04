import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../../../../shared/angular-themes/material.module';
import { HttpClient } from '@angular/common/http';
import { coreModule } from '../../../../shared/libs/core.module';
import { ThemeService } from '../../../../shared/angular-themes/themes.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, coreModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  @Output() themeChanged = new EventEmitter();
  menuOpen = false;
  selectedTheme: string;
  themes: any;
  constructor(private http: HttpClient, private themeService: ThemeService) {
    this.selectedTheme = localStorage.getItem('theme') || 'light';
    this.onThemeChanged(this.selectedTheme);
  }
  ngOnInit() {
    this.http.get('http://localhost:3000/themes').subscribe((res: any) => {
      console.log(res);
      this.themes = res[0]
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  onThemeChanged(theme: string){
    this.selectedTheme = theme;
    this.themeChanged.emit(theme);
    localStorage.setItem('theme', theme);
  }
  applyTheme(theme: any){
    console.log(theme);
    this.themeService.generatePalette(theme.primary, theme.accent, theme.warn);
  }
}
