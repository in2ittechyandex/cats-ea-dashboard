import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SyslogService {
    /**
     * 
     * @param http 
     * @param commonService 
     */
    constructor(private http: HttpClient) { }
    /**
     * 
     * to get all event status list
     * 
     */

    getEventStatusList(){
      var URL = environment._AlarmURL + "eventengine/sysseveritylist";
      return this.http.get(URL).map(res=><any>res);
    }

search_host(name) {
  var URL = environment._AlarmURL + "eventengine/syshostlist?host=" + name;
  return this.http.get(URL).map(res=><any>res);
}

  getAllTags(host){
    var URL;
    URL = environment._AlarmURL + "eventengine/alltag";  //?hostType=" + ciType + "&hostId=" + ci_id +"&page=" + pageNumber+ "&state=" + filter+"&from=" + from+"&to=" + to

    return this.http.get(URL).map(res=><any>res);
   }
   getSideNav(host,date_hour,date_mday,date_month,date_wday,date_year,timeObj,type,countTime){
    var URL;
    URL = environment._AlarmURL + "eventengine/alarmtype?host="+host+"&date_hour="+date_hour+"&date_mday="+date_mday+"&date_month="+date_month+"&date_wday="+date_wday+"&date_year="+date_year+"&timeobj="+timeObj+"&type="+type+"&counttime="+countTime;// + "&hostId=" + ci_id +"&page=" + pageNumber+ "&state=" + filter+"&from=" + from+"&to=" + to

    return this.http.get(URL).map(res=><any>res);
   }
   getEventsByTagsFilter(host,date_hour,date_mday,date_month,date_wday,date_year,
    alert_type,message,count,timeObj,type,countTime,filter){
    var URL;
    URL = environment._AlarmURL + "eventengine/getsyslogdata?host="+host+
    "&date_hour="+date_hour+
    "&date_mday="+date_mday+
    "&date_month="+date_month+
    "&date_wday="+date_wday+
    "&date_year="+date_year+
    "&severity="+alert_type+
    "&message="+message+
    "&count="+count+
    "&timeobj="+timeObj+
    "&type="+type+
    "&counttime="+countTime+
     "&alert_type=" + filter;   
    return this.http.get(URL).map(res=><any>res);
   }
   getEventsByTagsFilter1(host,date_hour,date_mday,date_month,date_wday,date_year,alert_type,topevent,page,timeObj,type,countTime,filter){
    var URL;
    URL = environment._AlarmURL + "eventengine/tagsearch?host="+host+
    "&date_hour="+date_hour+
    "&date_mday="+date_mday+
    "&date_month="+date_month+
    "&date_wday="+date_wday+
    "&date_year="+date_year+
    "&alert_type="+alert_type+
    "&topevent="+topevent+
    "&page="+page+
    "&timeobj="+timeObj+
    "&type="+type+
    "&counttime="+countTime+ 
    "&severity=" + filter;  //?hostType=" + ciType + "&hostId=" + ci_id +"&page=" + pageNumber+ "&state=" + filter+"&from=" + from+"&to=" + to

    return this.http.get(URL).map(res=><any>res);
   }
}
