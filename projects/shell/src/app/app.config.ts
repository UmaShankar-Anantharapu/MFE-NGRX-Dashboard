import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore, StoreModule } from '@ngrx/store';
import { chartReducer } from '../../../shared/store/reducers/reducer';
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonService } from '../../../shared/common-services/common-service.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    CommonService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideStoreDevtools({ maxAge: 50, name: 'tarun', logOnly: !isDevMode() }),
    importProvidersFrom(
      BrowserAnimationsModule, 
      StoreModule.forRoot({ chartState: chartReducer }, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({maxAge: 50, logOnly: !isDevMode()}),
  ),
  provideHttpClient()
  ]
};
