import { Injectable } from '@angular/core';
import { CommonService } from '../../../shared/common-services/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private commonService:CommonService) { 
  }

  fetchDataSets(){
    return this.commonService.fetchDataSets();
  }
}
