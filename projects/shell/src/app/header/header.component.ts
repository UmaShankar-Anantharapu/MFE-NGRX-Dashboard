import { Component } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,MatFormFieldModule,MatOptionModule,MatSelectModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = false;
  selectedTheme='dark';
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
