import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MaterialModule } from '../../../shared/materialUI/material.module';
import { coreModule } from '../../../shared/libs/core.module';
import { CustomThemeService } from '../../../shared/materialUI/custom-theme.service';
import { DynamicThemeService } from '../../../shared/materialUI/dynamic-theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MaterialModule, coreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'shell';
  isDark: boolean = false
  getTheme(event: any){
    console.log(event);
    this.isDark = event
  }

  constructor(private customThemeService: CustomThemeService, private dynamicThemeService: DynamicThemeService){
    // let palette = this.customThemeService.generateMaterialPalette2('#1976D2', '#000000', '#f44336')
    // console.log(palette);
    // let palette = this.dynamicThemeService.generatePalette('#fff000', '#0822d6', 'f44336')
    // this.dynamicThemeService.generatePalette('#cddc39', '#4caf50', '#f44336')
  }
  ngOnInit() {
  }

  @HostBinding('class')
  get returnTheme() {
    return this.isDark? 'dark-theme': 'light-theme'
  }
  // @HostBinding('class')
  // get addTheme() {
  //   return 'theme'
  // }
}
