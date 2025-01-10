import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';

// Export them so they can be used in other modules
@NgModule({
    declarations: [],
    imports: [
        GridsterModule
    ],
    exports: [
        GridsterModule
    ]
})
export class GridsterAngularModule { }
