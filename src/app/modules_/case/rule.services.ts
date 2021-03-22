
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/services_/user.services';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class RuleService {



    constructor(private http: HttpClient, private userService: UserService
    ) { }

    
    search_host(name) {
      // const URL = environment._EventURL + 'hosts/host/search_host?name=' + name;
  
      const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_host_list';
      const formData: FormData = new FormData();
      formData.append('name', name);
      return this.http.post(URL, formData).map(res => <any>res);
      // return this.http.get(URL).map(res => <any>res);
    }
    search_host_ip(name) {
      // const URL = environment._EventURL + 'hosts/host/search_host?name=' + name;
  
      const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_host_ip_address_list';
      const formData: FormData = new FormData();
      formData.append('ipAddress', name);
      return this.http.post(URL, formData).map(res => <any>res);
      // return this.http.get(URL).map(res => <any>res);
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
         
  getAllRules(){
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_all_rules';
    // const URL = 'https://run.mocky.io/v3/832984eb-82f4-4d35-a400-5507cbe3f481';
    return this.http.post(URL, {}).map(res => <any>res);
  }
  createRule(data){
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/create_rule_config';
    const formData: FormData = new FormData();
      formData.append('data', JSON.stringify(data));
      // formData.append('data', 'ytrew');
    return this.http.post(URL, formData).map(res => <any>res);
  }
}
