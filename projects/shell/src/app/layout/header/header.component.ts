import { Component, EventEmitter, Inject, OnInit, Output, Renderer2, importProvidersFrom } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../shared/materialUI/material.module';
import { coreModule } from '../../../../../shared/libs/core.module';
import { CustomThemeService } from '../../../../../shared/materialUI/custom-theme.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [coreModule, MaterialModule, MatDialogModule],
  // providers: [importProvidersFrom(HttpClientModule) ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  primaryColor: string = '';
  accentColor: string = '';
  warnColor: string = '';
  selectedTheme: string = ''
  availableThemes: string[] = [];
  themes: any;
  @Output() emitTheme = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog, private customThemeService: CustomThemeService, private commonService: CommonService) { 
    this.commonService.getTheme().subscribe((res: any) => {
      console.log(res.themes);
      this.themes = res.themes;
      this.availableThemes = this.themes.map((theme: any) => Object.keys(theme)[0])
      this.selectedTheme = this.availableThemes[0];
      this.applyTheme()
    })
  }
  ngOnInit() {
    // this.applyTheme()
  }

  applyTheme() {
    let themeValue: any = this.themes.filter((theme: any) => Object.keys(theme)[0] === this.selectedTheme)

    let themeObject = themeValue[0][this.selectedTheme]
    this.customThemeService.generateMaterialPalette2(themeObject.primary, themeObject.accent, themeObject.warn)
  }



  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.emitTheme.emit(this.isDarkMode)
  }

  openThemeDialog() {
    const dialog = this.dialog.open(DialogTemplateComponent, {
      data: { message: 'abc' },
      width: '400px',
    });
    dialog.afterClosed().subscribe((res) => {
      console.log(res);
      if(res.data.primary && res.data.accent){
        this.customThemeService.generateMaterialPalette2(res.data.primary, res.data.accent, res.data.warn)
      }
    })
  }

  onThemeChange(event: any){
    console.log(event);
    this.selectedTheme = event.value;
    this.applyTheme()
  }
}


@Component({
  selector: 'dialog-template',
  standalone: true,
  imports: [MaterialModule, coreModule],
  template: `
    <h2 mat-dialog-title>Dialog Title</h2>
    <mat-dialog-content>
    <mat-form-field>
    <input matInput [(ngModel)]="primary" placeholder="Primary Color" />
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="accent" placeholder="Accent Color" />
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="warn" placeholder="Warn Color" />
    </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-save (click)="saveDialog()">Save</button>
      <button mat-button mat-dialog-close (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
  `,
})
export class DialogTemplateComponent {
  primary = '#3f51b5';
  accent = '#ff4081';
  warn = '#f44336';
  constructor(public dialogRef: MatDialogRef<DialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  saveDialog() {
    this.dialogRef.close({ data: { primary: this.primary, accent: this.accent, warn: this.warn } })
  }
  closeDialog() {
    this.dialogRef.close()
  }
}

type Theme = {
  primary: string,
  accent: string,
  warn: string
}