import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.scss'
})
export class ThemesComponent {

  predefinedThemes: { [key: string]: { [key: string]: string } } = {
    indigoPink: {
      'primary-color': '#3f51b5',
      'accent-color': '#e91e63',
      'warn-color': '#f44336',
    },
    azureBlue: {
      'primary-color': '#007FFF',
      'accent-color': '#00BCD4',
      'warn-color': '#FFC107',
    },
  };

  // Custom theme
  customTheme: { [key: string]: string } = {
    'primary-color': '#673ab7',
    'accent-color': '#ff5722',
    'warn-color': '#f44336',
  };

  // Light or Dark mode
  themeMode: 'light-mode' | 'dark-mode' = 'light-mode';

  // Apply a predefined theme
  setPredefinedTheme(themeName: string) {
    const theme = this.predefinedThemes[themeName];
    if (theme) {
      this.applyTheme(theme);
    }
  }

  // Toggle between light and dark modes
  toggleMode() {
    this.themeMode = this.themeMode === 'light-mode' ? 'dark-mode' : 'light-mode';
  }

  // Apply a custom theme
  applyCustomTheme() {
    this.applyTheme(this.customTheme);
  }

  // Apply a theme by updating CSS variables
  private applyTheme(theme: { [key: string]: string }) {
    Object.keys(theme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  }
}
