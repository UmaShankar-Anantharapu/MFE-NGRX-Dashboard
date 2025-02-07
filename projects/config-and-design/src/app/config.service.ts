import { Injectable } from '@angular/core';
import { CommonService } from '../../../shared/common-services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private commonService:CommonService) { 
  }

  fetchDataSets(){
    return [
      {dataset:'power',schemaType:'Power',subscriptionName:'dataChanged'},
      {dataset:'getPositionMonitorings',schemaType:'PositionMonitoring',subscriptionName:'powerChanged'},
      {dataset:'getWindRose',schemaType:'WindRose',subscriptionName:'windroseChanged'},
      {dataset:'getHydro',schemaType:'Hydro',subscriptionName:'hydroChanged'}
    ];
    // return this.commonService.fetchDataSets();
  }
}
