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
      {dataset:'power',schemaType:'Power'},
      {dataset:'getPositionMonitorings',schemaType:'PositionMonitoring'},
      {dataset:'getWindRose',schemaType:'WindRose'},
      {dataset:'getHydro',schemaType:'Hydro'}
    ];
    // return this.commonService.fetchDataSets();
  }
}
