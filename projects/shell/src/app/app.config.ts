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
import { InMemoryCache, ApolloLink, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

export const appConfig: ApplicationConfig = {
  providers: [
    CommonService,
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
  provideApollo(() => {
    const httpLink = inject(HttpLink).create({
      uri: 'http://10.91.97.102:5000/graphql',
    });

    const wsLink = new WebSocketLink({
      uri: 'ws://10.91.97.102:5000/graphql',
      options: {
        reconnect: true,
      },
    });

    // Use split for proper routing of queries and subscriptions
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );

    return {
      link: ApolloLink.from([link]),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    };
  }),
  
  provideHttpClient()
  ]
};
