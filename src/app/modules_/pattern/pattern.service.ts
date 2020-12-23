import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PatternService {

  /**
     * 
     * @param http 
     * @param commonService 
     */
    constructor(private http: HttpClient 
    ) { }

    /**
     * 
     * to get all Message Pattern
     * 
     */
    getAllMessagePattern(size) {
      var URL = environment._AlarmURL;
      URL=environment._WEBGATEWAY_BASIC_URL_+"menu/kpi/get_patterns_data";
      var form=new FormData();
      form.append("size",size);
      return this.http.post(URL,form).map(res=><any>res);
    }
    /**
     * 
     * to get hosts by message pattern
     * 
     */

    getAllCIByMesage(msg,size){
      var URL = environment._AlarmURL;
      URL=environment._WEBGATEWAY_BASIC_URL_+"menu/kpi/host_in_message";
      var form=new FormData();
      form.append("size",size);
      form.append("message",msg);
      return this.http.post(URL,form).map(res=><any>res);
    }
    /**
     * 
     * to get probability by message pattern
     * 
     */

    getAllProbabilityByMesage(msg){
      var URL=environment._WEBGATEWAY_BASIC_URL_+"menu/kpi/probable_message";
      var form=new FormData(); 
      form.append("message",msg);
      return this.http.post(URL,form).map(res=><any>res);
    }
    /**
     * 
     * to get probability by message pattern
     * 
     */

    getChartProbability(msg,days){
      var URL=environment._WEBGATEWAY_BASIC_URL_+"menu/kpi/get_trend_chart";
      var form=new FormData(); 
      form.append("message",msg);
      form.append("days",days);
      return this.http.post(URL,form).map(res=><any>res);
    }
    /**
     * 
     * to get system overview category wise 
     * 
     */

    getSystemOverviewCategorywise(){
      var URL = environment._AlarmURL + "eventengine/noisereduction3";
      // URL= "http://172.16.61.151:8000/eventengine/noisereduction3";
      return this.http.get(URL).map(res=><any>res);
    }
    
     /**
     * 
     * to get probability by message pattern
     * 
     */

    getProbabiliyByMesage(msg){
      var URL = environment._AlarmURL;
      URL=environment._AlarmURL+"eventengine/probable_message?messege="+msg;
      // URL= "http://172.16.61.151:8000/eventengine/noisereduction?time=1320076543";
      return this.http.get(URL).map(res=><any>res);
    }
     
    private getAuthorizedHeader(): Headers {
      let headers = new Headers();
      // headers.append('langCode', this.config.getUserLang().toUpperCase());
      var data = JSON.parse(localStorage.getItem("currentUser"));
      // headers.append('Token', ""+ data.token)
      headers.append('Authorization', 'Token ' + data.token)
      return headers;
  }

}
