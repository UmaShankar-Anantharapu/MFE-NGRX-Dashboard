import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AgGridAngular,CommonModule,MatIconModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableObject: any;
  @Input() rowData: any[] = [];
  @Input() title!:string;
  columns: ColDef[] = [];

  constructor() {
    this.rowData[0]
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData']) {
      this.rowData = changes['rowData'].currentValue;
      if(this.rowData){
        this.columns = [];
        this.tableObject.usedColumns.forEach((col: string, index: number) => {
          this.columns.push({
            field: this.tableObject.usedColumns[index],
            headerName: `${this.tableObject.usedColumnNames[index]}`,
            flex: 1,
            sortable: true,
            sort: 'asc',
            filter: 'agTextColumnFilter'
          });
        })
        // Object.keys(this.rowData[0]).forEach((col: string) => {
        //   if(col !== '__typename' && col !== '_id')
        //   this.columns.push({
        //     field: col, flex: 1, sortable: true, sort: 'asc', filter: 'agTextColumnFilter'
        //   })
        // })
      }
    }
  }
  ngOnInit() {
    
  }
  onColumnDragStarted(event: any) {
    event.stopPropagation();
  }

}
