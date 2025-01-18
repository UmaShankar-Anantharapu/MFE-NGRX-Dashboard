// shared/shared.module.ts

import { isDevMode, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { chartReducer, reducers } from './reducers/reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // Import StoreDevtoolsModule


@NgModule({
  imports: [
    StoreModule.forRoot(reducers), 
    StoreDevtoolsModule.instrument({
    maxAge: 25, logOnly: !isDevMode()})],
  exports: [StoreModule]
})
export class SharedModule { }
