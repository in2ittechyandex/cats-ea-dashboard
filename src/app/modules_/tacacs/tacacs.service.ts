
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TacacsService {
 /**
     * 
     * @param http 
     * @param commonService 
     */
    constructor(private http: HttpClient
    ) { }
    /**
     * 
     * to get all tacacs logs
     * 
     */

    gettacacsLogList(){
      var URL = environment._AlarmURL + "tacacs/get_logs";
        // URL ="http://192.168.137.5:7000/tacacs/get_logs";
      return this.http.get(URL).map(res=><any>res);
    }

getTacacsDetailById(id) {
  var URL = environment._AlarmURL + "tacacs/get_logs_cmd?id=" + id; 
  return this.http.get(URL).map(res=><any>res);
}
getDeviceIp()
{
  var URL = environment._AlarmURL + "tacacs/get_device_ip"; 
return this.http.get(URL).map(res=><any>res);
}
getUserByIp(ip){
       
  var URL = environment._AlarmURL + "tacacs/get_user?ip=" + ip; 
  return this.http.get(URL).map(res=><any>res);
}  
getRemoteIp(ip,user){
       
  var URL = environment._AlarmURL + "tacacs/get_rem_ip?ip=" + ip+"&user="+user; 
  return this.http.get(URL).map(res=><any>res);
}    
getCommands(ip,user,remoteIp){
       
  var URL = environment._AlarmURL + "tacacs/get_cmds?ip=" + ip+"&user="+user+"&rem_ip="+remoteIp; 
  return this.http.get(URL).map(res=><any>res);
} 
search_device_ip(startTime,endTime,ip,user,rem_ip,searchString){
  var URL = environment._AlarmURL + "tacacs/search_device_ip?start=" + startTime+"&end="+endTime+"&ip="+ip+"&user="+user+"&rem_ip="+rem_ip+"&command="+searchString; 
  return this.http.get(URL).map(res=><any>res);
} 
search_user(startTime,endTime,ip,user,rem_ip,searchString){
  var URL = environment._AlarmURL + "tacacs/search_user?start=" + startTime+"&end="+endTime+"&ip="+ip+"&user="+user+"&rem_ip="+rem_ip+"&command="+searchString;
  return this.http.get(URL).map(res=><any>res);
} 
search_rem_ip(startTime,endTime,ip,user,rem_ip,searchString){
  var URL = environment._AlarmURL + "tacacs/search_rem_ip?start=" + startTime+"&end="+endTime+"&ip="+ip+"&user="+user+"&rem_ip="+rem_ip+"&command="+searchString;
  return this.http.get(URL).map(res=><any>res);
} 
search_cmds(startTime,endTime,ip,user,rem_ip,searchString){
  var URL = environment._AlarmURL + "tacacs/search_cmds?start=" + startTime+"&end="+endTime+"&ip="+ip+"&user="+user+"&rem_ip="+rem_ip+"&command="+searchString; 
  return this.http.get(URL).map(res=><any>res);
} 
search_all_cmds(startTime,endTime,ip,user,rem_ip,command){
  var URL = environment._AlarmURL + "tacacs/search_all_cmds?start=" + startTime+"&end="+endTime+"&ip="+ip+"&user="+user+"&rem_ip="+rem_ip+"&command="+command; 
  return this.http.get(URL).map(res=><any>res);
}  
}
