import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl:string='';
  constructor(private http:HttpClient) { }

  fetchDataSets(){
    
    //static names as of now
    return ['renewableenergymix', 'india-energy-consumption', 'industrialpower', 'active-power', 'wind', 'griddistribution', 'hydro', 'power-generation', 'position-monitoring', 'windrose', 'drilldown01', 'countries'];
    
    // this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((res)=>{
    //   console.log(res);
    // })
  }
  fetchData(datasetName: string) {
    return this.http.get(`./assets/${datasetName}.json`)
  }

}
