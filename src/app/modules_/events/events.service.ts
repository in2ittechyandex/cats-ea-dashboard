import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Config } from 'src/app/config/app-configuartion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  eventtypeId = '';
  eventtypeNms = '';
  eventTypeFilter = '';
  eventTypeName = '';
  /**
   *
   * @param http
   * @param commonService
   */
  toggleSidebar = new EventEmitter<Boolean>();


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
   * to get all host details
   *
   */
  getAllHostDetails() {
    const URL = environment._EventURL + 'host/get_all';
    return this.http.get(URL).map(res => <any>res);
  }

  /**
 *
 * to get host wise counts
 *
 */
  getEventsCounts() {
    // const URL = Config.ApiURL + "eventengine/events/getcounts";
    // const URL = Config.ApiURL + "eventengine/events/getcountshostwise";

    const URL = environment._EventURL + 'eventengine/events/getcountsevents';
    return this.http.get(URL).map(res => <any>res);
  }
  /**
     *
     * to get Tech wise counts
     *
     */
  getEventsCountsTechwise() {
    // const URL = Config.ApiURL + "eventengine/events/getcounts";
    const URL = environment._EventURL + 'eventengine/events/getcountstechwise';
    return this.http.get(URL).map(res => <any>res);
  }
  /**
     *
     * to get all event severity list
     *
     */

  getEventSeverityList() {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_severity_list';
    return this.http.post(URL, {}).map(res => <any>res);
  }
  /**
   *
   * to get all event status list
   *
   */

  getEventStatus() {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_status_list';
    return this.http.post(URL, {}).map(res => <any>res);
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
  /**
   *
   * to get all events
   *
   */
  getAllEvents(message, host, severity, state, page, from, to, input_source) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_all_event';
      var formData: FormData = new FormData();
      formData.append('startDate', from);
      formData.append('endDate', to);
      formData.append('host', host);
      formData.append('severity', severity);
      formData.append('state', state);
      formData.append('message', message);
      formData.append('page', page);
      formData.append('input_source', input_source);
    return this.http.post(URL, formData).map(res => <any>res);
  }
  getAllTags(host) {
    const URL = environment._EventURL +
      'eventengine/alltag';

    return this.http.get(URL).map(res => <any>res);
  }
  getSideNavEvent(startDate,endDate) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_event_manage_count';
      var formData: FormData = new FormData();
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
    return this.http.post(URL, formData).map(res => <any>res);
  }
  getSideNavService(startDate,endDate) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_service_manage_count';
      var formData: FormData = new FormData();
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
    return this.http.post(URL, formData).map(res => <any>res);
  }
  get_nearby_service_request(startDate, endDate, type){
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_nearby_service_request';
    var formData: FormData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('type', type);
  return this.http.post(URL, formData).map(res => <any>res);
  }
  getEventsByTagsFilter(host, date_hour, date_mday,
    date_month, date_wday, date_year,
    alert_type, topevent, page,
    timeObj, type, countTime, filter) {
    const URL = environment._EventURL +
      'eventengine/tagsearch?host=' + host + '&date_hour=' + date_hour + '&date_mday=' + date_mday +
      '&date_month=' + date_month + '&date_wday=' + date_wday + '&date_year=' +
      date_year + '&alert_type=' + alert_type + '&topevent=' + topevent +
      '&page=' + page + '&timeobj=' + timeObj + '&type=' + type + '&counttime=' +
      countTime + '&severity=' + filter;
    return this.http.get(URL).map(res => <any>res);
  }
  getEventDataParticularHostpopup(timeObj, type, countTime, host, page) {
    const URL = environment._EventURL + 'eventengine/hostdata?timeobj=' + timeObj + '&type='
      + type + '&counttime=' + countTime + '&host=' + host + '&page=' + page;

    return this.http.get(URL).map(res => <any>res);

  }
  /**
    *
    * to get events charts
    *
    */
  getAllEventsChart(host, nms, statustype) {
    // const URL = environment._EventURL
    //   + 'eventengine/events/chart?host=' + host + '&severity=' + statustype + '&input_source=' + nms;
    // return this.http.get(URL).map(res => <any>res);

   const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_event_trend_chart';
   const formData: FormData = new FormData();
   formData.append('startDate', '1605921479000');
   formData.append('endDate', '1606094279000');
   formData.append('hostname', host);
    // const URL = 'https://run.mocky.io/v3/23166414-bc4b-40f1-870a-7ab6ccff8c54';
    // return this.http.get(URL).map(res => <any>res);
    return this.http.post(URL, formData).map(res => <any>res);
  }

  /**
    *
    * to get all child events
    *
    */
  getChildEvents(id) {
    const URL = environment._EventURL + 'eventengine/events/geteventchild?eventId=' + id;
    return this.http.get(URL).map(res => <any>res);
  }
  /**
   *
   * To get SIA Report
   *
   */

  getSIAReport(formData: FormData) {
    const URL = environment._EventURL + 'actionengine/sia_response';
    // URL ="https://api.myjson.com/bins/dqvwl";
    return this.http.post(URL, formData).map(res => <any>res);
  }
  /**
       *
       * to get all ActionFormData
       *
       */
  getActionFormData(id) {
    const URL = environment._EventURL + 'eventengine/events/geteventdata?event_id=' + id;
    return this.http.get(URL).map(res => <any>res);
  }
  executeAction(formData: FormData) {
    const URL = environment._EventURL + 'actionengine/executeAction';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendMail(formData: FormData) {
    // const URL = Config.ApiURL + "actionengine/sendmail";
    const URL = 'http://10.81.2.51:8000/actionengine/sendmail';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendMailWithEnrichment(formData: FormData) {
    // const URL = Config.ApiURL + "actionengine/mailenrichment";
    const URL = 'http://10.81.2.51:8000/actionengine/mailenrichment';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  sendSms(formData: FormData) {
    const URL = environment._EventURL + 'actionengine/sendmsg';
    return this.http.post(URL, formData).map(res => <any>res);
  }
  /**
    *
    * to get events with ci filter
    *
    */
  //  getCiFilter(id,pageNumber,filter){
  //      const URL = Config.ApiURL + "eventengine/events/getcifilter?ci_id="+id+"&page="+pageNumber+"&filter="+filter;
  //      return this.http.get(URL).map(res=><any>res);
  //  }

  /**
    *
    * to get events with ci type events
    *
    */
  //   getCiTypeFilter(name,pageNumber,filter) {
  //         const URL = Config.ApiURL + "eventengine/events/getcitypeevents?ciType="+name+"&page="+pageNumber+"&filter="+filter;
  //          return this.http.get(URL).map(res=><any>res);
  // }


  getfilterResult(ciType, ci_id, filter, pageNumber) {
    const URL = environment._EventURL +
      'eventengine/events/getall?hostType=' + ciType + '&hostId=' + ci_id + '&page=' + pageNumber + '&state=' + filter;

    return this.http.get(URL).map(res => <any>res);
  }

  getIncident(typeid, workorderid) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_incident_info';
    const formData: FormData = new FormData();
   formData.append('ticket_no', workorderid);
   formData.append('type_id', typeid); 
    // const URL = 'https://run.mocky.io/v3/23166414-bc4b-40f1-870a-7ab6ccff8c54';
    // return this.http.get(URL).map(res => <any>res);
    return this.http.post(URL, formData).map(res => <any>res);
  
    // return this.http.get(URL).map(res => <any>res);
  }
  getallworklog(typeid, workorderid) {
    const URL = environment._EventURL + 'actionengine/allworklog?sys_id=' + workorderid + '&type_id=' + typeid;
    return this.http.get(URL).map(res => <any>res);
  }

  /**
   * Ramji made changes , passing typeid
   * @param typeId
   * @param incidentId
   */
  getallworklogByIncidentId(typeId, incidentId) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/all_work_log';
    // const URL = environment._EventURL + "actionengine/allworklog?incident_id=" + incidentId+"&type_id="+typeId;
    const formData: FormData = new FormData();
    formData.append('ticket_no', incidentId);
    formData.append('type_id', typeId); 
     // const URL = 'https://run.mocky.io/v3/23166414-bc4b-40f1-870a-7ab6ccff8c54';
     // return this.http.get(URL).map(res => <any>res);
     return this.http.post(URL, formData).map(res => <any>res);
  }

  resolution(formdata: FormData) {
    const URL = environment._EventURL + 'actionengine/addresolution';
    return this.http.post(URL, formdata).map(res => <any>res);
  }

  addworklog(formData: FormData) {
    //  const URL =environment._EventURL + "actionengine/worklogincident";
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/add_work_log_incident';
    return this.http.post(URL, formData).map(res => <any>res);
  }

  search_host(name) {
    // const URL = environment._EventURL + 'hosts/host/search_host?name=' + name;

    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_host_list';
    const formData: FormData = new FormData();
    formData.append('name', name);
    return this.http.post(URL, formData).map(res => <any>res);
    // return this.http.get(URL).map(res => <any>res);
  }

  public getToken(): String {

    var data = JSON.parse(localStorage.getItem('currentUser'));
    data.access_token

    return data.access_token;
  }
  public selTab: any = { 'clickName': 'event', 'msgpattern': '', 'host': '', 'nms': '' };
  public subjectTabs = new BehaviorSubject(this.selTab);

  public getUserTabsSubscriber() {
    return this.subjectTabs.asObservable();
  }

  public bindUserTabsToSubscribers() {
    this.subjectTabs.next(this.selTab);
  }

  public changeSelectionType(newValue) {
    this.selTab = newValue;
    this.bindUserTabsToSubscribers();
  }

  /**
       *
       * to get events charts
       *
       */
  getAllEventsChartByHost(host) {
    const URL = environment._EventURL + 'actionengine/clustering?hostname=' + host;
    // URL="https://api.myjson.com/bins/fpgey";
    return this.http.get(URL).map(res => <any>res);
  }
  // private getAuthorizedHeader(): Headers {
  //   let headers = new Headers();
  //   headers.append('langCode', this.config.getUserLang().toUpperCase());
  //   var data = JSON.parse(localStorage.getItem('currentUser'));
  //   // headers.append('Token', ""+ data.token)
  //   headers.append('Authorization', 'Token ' + data.token)
  //   return headers;
  // }
  getAnomalyData(type, day) {
    const URL = environment._EventURL + 'actionengine/forcasting?day=' + day + '&type=' + type;
    // URL="http://172.16.11.87:7000/actionengine/forcasting?day="+'1';
    return this.http.get(URL).map(res => <any>res);
  }
  getRawData(id) {
    const URL = environment._EventURL + 'eventengine/getrowdata?id=' + id;
    // URL="http://172.27.64.92:7000/eventengine/getrowdata?id=EVENT-20200630-101609"
    return this.http.get(URL).map(res => <any>res);
  }


  getNearByServiceRequestData(filters_: any) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_nearby_service_request';
    const formData: FormData = new FormData();
    Object.keys(filters_).forEach(e_ => {
      formData.append(e_, filters_[e_]);
    });

    return this.http.post(URL, formData).map(res => <any>res);
  }

  getNearByEventManagementData(filters_: any) {
    const URL = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_all_event';
    const formData: FormData = new FormData();
    Object.keys(filters_).forEach(e_ => {
      formData.append(e_, filters_[e_]);
    });

    // formData.append("severity",severity);
    formData.append('state', '');
    formData.append('message', '');
    formData.append('page', '0');

    return this.http.post(URL, formData).map(res => <any>res);
  }

}
