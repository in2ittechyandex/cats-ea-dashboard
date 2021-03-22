
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/services_/user.services';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class EpisodeService {



    constructor(private http: HttpClient, private userService: UserService
    ) { }

    createEpisode(data){
      const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/create_episode_config';
      const formData: FormData = new FormData();
        // formData.append('data', JSON.stringify(data));
        // formData.append('data', 'ytrew');
      return this.http.post(URL, data).map(res => <any>res);
    }
    public getAlarmList() { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_alarm_list'; 
            return this.http.post(url, {}).map(res => <any>res);
        }
        public getOperatorList() { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_operator_list'; 
            return this.http.post(url, {}).map(res => <any>res);
        }
        public getFilterList() { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_filter_list'; 
            return this.http.post(url, {}).map(res => <any>res);
        }
/**
   *
   * to get all input source list
   *
   */
  getInputSourceList() {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_input_source_list';
    // const URL = 'https://run.mocky.io/v3/832984eb-82f4-4d35-a400-5507cbe3f481';
    return this.http.post(URL, {}).map(res => <any>res);
  }
         
  getAllEpisode(){
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_master_episode_list';
    // const URL = 'https://run.mocky.io/v3/832984eb-82f4-4d35-a400-5507cbe3f481';
    return this.http.post(URL, {}).map(res => <any>res);
  }
}
