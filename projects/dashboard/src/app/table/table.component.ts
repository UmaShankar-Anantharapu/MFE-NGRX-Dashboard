import { Component, Input, OnInit, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() rowData: any[] = [];
  columns: ColDef[] = [];

  constructor(){ 
    this.rowData[0]
  }
  ngOnInit() {
    Object.keys(this.rowData[0]).forEach((col: string) => {
      this.columns.push({
        headerName: col,
        field: col,
        editable: true
      })
    })
    }
}
