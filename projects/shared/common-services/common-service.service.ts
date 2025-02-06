import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlService } from '../../dashboard/src/app/services/graphql.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl:string='';
  dashboardStatus = new Subject<string>();
  dashboardStatus$ = this.dashboardStatus.asObservable();
  constructor(private http:HttpClient,private graphqlService:GraphqlService) { }

  fetchDataSets(){
    
    //static names as of now
    return ['renewableenergymix', 'india-energy-consumption', 'industrialpower', 'activepower', 'wind', 'griddistribution', 'hydro', 'power-generation', 'position-monitoring', 'windrose', 'drilldown01', 'countries'];
    
    // this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((res)=>{
    //   console.log(res);
    // })
  }
  fetchData(datasetName: string) {
    return this.graphqlService.getSchemaForCollection(datasetName);
  }


  

}
