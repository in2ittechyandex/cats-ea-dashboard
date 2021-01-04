
import { Injectable, EventEmitter } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Config } from 'src/app/config/app-configuartion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  /**
     *
     * @param http
     * @param commonService
     */

  constructor(private http: HttpClient,
    //  private config: Config
  ) { }
  /**
       *
       * to get events charts
       *
       */
  getAllEventsChart() {
    const URL = environment._AlarmURL + 'eventengine/events/event_to_alert_chart';
    // URL="https://api.myjson.com/bins/fpgey";
    return this.http.get(URL).map(res => <any>res);
  }
  /**
   *
   * to get all host details
   *
   */
  getAllAlarms(page, inputSource, hostName: string, severity, state, from, to) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_all_alarm';
      var formData:FormData=new FormData();
      formData.append("startDate",from);
      formData.append("endDate",to);
      formData.append("host",hostName);
      formData.append("severity",severity);
      formData.append("state",state); 
      formData.append("page",page);
      formData.append("message",'');
      formData.append("input_source",inputSource);
      http://172.27.63.182:8089/
      // const URL = 'https://run.mocky.io/v3/47654547-d9a2-451b-b267-7e29d13a3ee0';
    return this.http.post(URL,formData).map(res => <any>res);
  }
  /**
   *
   * to assign alarm
   *
   */
  assignAlarm(alarmId, description, state, input_source) {
    const URL = environment._AlarmURL + 'eventengine/assign_alarm';
    // URL="http://10.90.90.130:8000/eventengine/assign_alarm";
    var email = this.getUser().email;

    var formdata: FormData = new FormData();
    formdata.append('alarm_id', alarmId);
    formdata.append('desc', description);
    formdata.append('state', state);
    formdata.append('nms', input_source);
    formdata.append('name', this.getUser().userName);
    formdata.append('email', email != null ? email : '');
    return this.http.post(URL, formdata).map(res => <any>res);
  }
  /**
   *
   * to get all ActionFormData
   *
   */
  getalarmtotal_pop(id) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_alarm_child';
    var formData=new FormData();
    formData.append("alarm_id",id);
    return this.http.post(URL,formData).map(res => <any>res);
  }
  /**
     *
     * to get all ActionFormData
     *
     */
  getActionFormData(id, type) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_alarm_data';
    var formData=new FormData();
    formData.append("alarm_id",id);
    return this.http.post(URL,formData).map(res => <any>res);
  }
  /**
     *
     * to get all incident status
     *
     */
  getIncidentStatus() {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_incident_status';
    return this.http.post(URL,{}).map(res => <any>res);
  }
  getResolutionCode() {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_resolution_code';
    return this.http.post(URL,{}).map(res => <any>res);
  }
  getEmailLlist() {
    const URL = environment._AlarmURL + 'get_mail';
    return this.http.get(URL).map(res => <any>res);
  }
  getAnomalyData(type, day) {
    const URL = environment._AlarmURL + 'actionengine/forcasting?day=' + day + '&type=' + type;
    // URL="http://172.16.11.87:7000/actionengine/forcasting?day="+'1';
    return this.http.get(URL).map(res => <any>res);
  }
  sendMail(formData: FormData) {
    const URL = environment._AlarmURL + 'send_mail';
    // const URL = "http://172.27.64.61:8000/send_mail";
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendNotification(formData) {
    const URL = environment._AlarmURL + 'eventengine/send_notification';
    // URL = "http://10.64.96.174:8080/eventengine/send_notification";
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendMailWithEnrichment(formData: FormData) {
    // const URL = Config.ApiURL + "actionengine/mailenrichment";
    const URL = 'http://172.27.64.91:8000/actionengine/mailenrichment';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendSms(formData: FormData) {
    const URL = environment._AlarmURL + 'actionengine/sendmsg';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  getUser() {
    var currentUser = JSON.parse(localStorage.getItem('loggedUser'));
    return currentUser;
  }
}