import { ApplicationConfig, importProvidersFrom, inject, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore, StoreModule } from '@ngrx/store';
import { chartReducer, reducers } from '../../../shared/store/reducers/reducer';
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonService } from '../../../shared/common-services/common-service.service';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';


export const appConfig: ApplicationConfig = {
  providers: [
    CommonService,
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({
          uri: 'http://10.91.97.160:5000/graphql',
        }),
        cache: new InMemoryCache(),
        connectToDevTools: true
      };
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideStoreDevtools({ maxAge: 50, name: 'tarun', logOnly: !isDevMode() }),
    importProvidersFrom(
      BrowserAnimationsModule, 
      StoreModule.forRoot(reducers, {
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
