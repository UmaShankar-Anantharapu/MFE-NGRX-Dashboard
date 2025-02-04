import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor( private apollo: Apollo) { }

  fetchDataFromCollectionByKeys(keys: string[], collection: string) {
    let finalStf = keys.join(' ')
    const query = gql`
      query{
        ${collection}{
          _id
          ${finalStf}
        }
      }
    `
    return this.apollo.watchQuery({query: query})
  }

  subscriptionForCollection(keys: string[], subscriptionName: string){
    let finalStr = keys.join(' ');
    const subscription = gql`
      subscription{
        ${subscriptionName}(role: "admin")
      }
    `
    return this.apollo.subscribe({query: subscription});
  }

  getSchemaForCollection(collection: string){
    const query = gql`
      {
        __type(name: "${collection}"){
          name
          fields{
            name
          }
        }
      }
    `
    return this.apollo.watchQuery({query: query})
  }

}
