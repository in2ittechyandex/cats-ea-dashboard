import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as global from 'src/app/config/globals';
import { FormControl } from '@angular/forms';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subscription } from 'rxjs'; 
import { EventsService } from '../events/events.service'; 
import pageSettings from '../../config/page-settings';
import themeConf_ from '../../config/theme-settings';
import { SyslogService } from './syslog.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
@Component({
  selector: 'cats-syslog',
  templateUrl: './syslog.component.html',
  styleUrls: ['./syslog.component.css']
})
export class SyslogComponent implements OnInit {
  pageSettings;
  global = global;
  closeResult: string;
  results: any[] = [];
  queryFieldCi: FormControl; 
  query;
  allEventService;
  allTagsSub;
  public mData = [];
  public userTabSubscr_: Subscription;
  timeWidth="100px";
  eventWidth="1008px";

  public gridApi;
  public gridParams;
  public gridColumnApi;
  public columnDefs;
  public context;
  public defaultColDef;
  public rowData;
  public frameworkComponents;

  tableHeight='475';//588
  secondsToRefresh: number = 60;
  timeLeft: number = 60; 
  responseTime=0;
  public timeServicesSubsc$: Subscription;
  constructor(private timeService:TimeFilterService, private eventService:EventsService, private slimLoadingBarService: SlimLoadingBarService, private modalService: NgbModal,
    private eventsService: SyslogService,private numberToDatePipe_: NumberToDatePipe) {
    this.pageSettings = pageSettings;  
    this.queryFieldCi = new FormControl();
  
     // this.startSchedular();
     this.columnDefs = [
      
      { 
        headerName: 'Time',
        field: 'time', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        'isActive':true
      },
      { 
        headerName: 'Description', 
        field: 'description', 
        sortable: true, 
        filter: true, 
        editable: false,
        draggable:true,
        resizable: true,
        'isActive':true
      },
      {
        headerName: 'Host Name', 
        field: 'host', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      {
        headerName: 'state', 
        field: 'state', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      // {
      //   headerName: 'Severity Label', 
      //   field: 'severity_label', 
      //   sortable: true,
      //   editable: false,
      //   filter: true,
      //   resizable: true
      // },
      {
        headerName: 'Severity', 
        field: 'severity', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      }
    ];
    
    this.tableHeight=(window.innerHeight-this.topmargin).toString();
    this.startSchedular();
    this.timeServicesSubsc$ = this.timeService.getTimeFilterSubscriber().subscribe(obj => {
      
      this.onChangeTimeServices(obj);
    });
  }
  onChangeTimeServices(arg0: any): any {
    console.log(arg0);
    this.loading = true;
    this.callKpis();
  }
  topmargin=180;
  @HostListener("window:resize")
  onResize() {
      this.tableHeight=(window.innerHeight-this.topmargin).toString();
   
  }
 
  resetAllFilterAndTags() {
    this.model.host = "";
    this.model.severity = "";
    this.model.startDate = "";
    this.model.state = "";
    this.model.description = "";
    this.model.endDate = ""; 
  }
  themeConf_;
  summaryCollapsed: boolean = true;
  currentHost = "";
  loading:boolean=true;
  ngOnDestroy() {
    this.stopSchedular(); 
  }
  public subscription: Subscription;
public startSchedular() {
  this.scheduleTask();
  let timer = TimerObservable.create(100, 3000);
  this.subscription = timer.subscribe(t => {
    if(this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.scheduleTask();
      this.timeLeft = this.secondsToRefresh;
    }
    
  });
}
currentFilter="";
public scheduleTask() { 
  this.callKpis();
}

public stopSchedular() {
    this.subscription.unsubscribe();
}
  ngOnInit() {//1035
    this.themeConf_ = themeConf_; 
    this.eventService.toggleSidebar.subscribe(status=>{
      console.log("status"+status);
      if(status){
        this.timeWidth="100px";
        this.eventWidth="1008px";
      }else{
        this.timeWidth="100px";
  this.eventWidth="1168px";
      }
    });
    
    this.getAllTags(); 
    this.getEventStatusList();
    this.getEventSeverityList();
    this.initSearch();


  }
  callKpis() {

    this.getAllTags(); 
    this.getEvents(this.model.host, this.model.severity,this.model.state,this.model.description, this.timeService.getstartDateInTimestamp(),
    this.timeService.getendDateInTimestamp(),);

  }
  eventStatusList = [];
  filter = "";
  getEventStatusList() {
    // this.loading=true;
    this.eventsService.getEventStatus().subscribe((res) => {
      if (res.status) {
        this.eventStatusList = res.data;
      } else {
        alert(res.msg);
      }
      // this.loading=false;
    }, (err) => {
      // this.loading=false;
    });
  }
  eventSeverityList = []; 
  getEventSeverityList() {
    // this.loading=true;
    this.eventsService.getEventSeverityList().subscribe((res) => {
      if (res.status) {
        this.eventSeverityList = res.data;
      } else {
        alert(res.msg);
      }
      // this.loading=false;
    }, (err) => {
      // this.loading=false;
    });
  }
  onChange() { 
    this.callKpis();
  }
  startLoading() {
    this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
    });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }
  initSearch() {
    this.queryFieldCi.valueChanges
      // .debounceTime(200)
      // .distinctUntilChanged()
      .subscribe(result => this.getSearchData(result));

  }
  getSearchData(result) {
    console.log(result);
    this.model.host=result;
    this.eventsService.search_host(result).subscribe((res) => {

      if (res.status) {
        if (res.data.length > 0)
          this.results = res.data;
      }
    }, (err) => {
      this.completeLoading();
    });
  }
  checkResultLength() {
    if (this.results.length > 0) {
      return true;
    }
    return false;
  }
  allTags;

  getAllTags() { 
    if (this.allTagsSub) {
      this.allTagsSub.unsubscribe();
    }

    this.startLoading();
    this.allTagsSub=this.eventsService.getAllTags(this.model.host).subscribe((res) => {
      if (res.Status) {
        this.allTags = res.data;
 
        this.completeLoading();
        this.allEventService = null;
        
      }
      
    }, (err) => {
      this.completeLoading();
      this.allEventService = null;
       
    });
  } 
  model = {
    "host": "",
    "severity": "",
    "state": "",
    "description": "",
    "startDate": "",
    "endDate": ""
  }
  res;//''={"Status":true,"totalpage":1,"sidenav":[{"name":"Event Type","data":[{"name":"type1","count":123},{"name":"type2","count":123}]},{"name":"NMS","data":[{"name":"nms1","count":123},{"name":"nms2","count":123}]},{"name":"Service Now","data":[{"name":"serviceno1","count":123},{"name":"servicenow","count":123}]},{"name":"Syslog","data":[]}],"Data":[{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":613,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE ALERT"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":614,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":615,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]}]};
  getEvents(host,severity,state,description,startDate,endDate) {
    if (this.allEventService) {
      this.allEventService.unsubscribe();
    }

    this.startLoading();
    const startTime: number = new Date().getTime();
    this.allEventService = this.eventsService.getEventsByTagsFilter(
      host,severity,state,description,startDate,endDate).subscribe((res) => {
        if (res.status) {
          this.timeLeft=60;
          const endTime: number = new Date().getTime();
      const diffTime = endTime - startTime;
      this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
          this.mData = res.data;  
          this.checkNewRecord(this.mData);
          this.previousData=this.mData;
          this.completeLoading();
          this.allEventService = null;
          this.loading=false;
        }else{
          this.loading=false;
        }
      }, (err) => {
        this.completeLoading();
        this.loading=false;
        this.allEventService = null;
      });
    console.log("get data");
    this.timeRange = this.getHeaders(this.timeService.getstartDateInTimestamp(), this.timeService.getendDateInTimestamp())
  }
  timeRange = '';
  getHeaders(startDate, endDate) {
    const startTime = startDate;
    const endTime = endDate;
    let str = '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const myDateStart = new Date(startTime);
    const myDateEnd = new Date(endTime);
    str += '(';
    // if (this.performanceService_.timeRange.timeType == 'l1h') {
    str += this.getDatePart(myDateStart)['full'] + ' - ' + this.getDatePart(myDateEnd)['full'];
    // } else {
    //   str += this.getDatePart(myDateStart)['d_'] + '' + ' - ' + this.getDatePart(myDateEnd)['d_'] + '';
    // }

    str += ')'
    // var timestring=new Date().toTimeString();
    // var timeArray=timestring.split(' ');
    // var newstr="";
    // for(var i=1;i<timeArray.length;i++){
    // newstr+=timeArray[i]+' ';
    // }
    // str=str+' ( '+newstr+' )';
    return str;
    // WAN Device Performance (Last 7 Days) - <from> to <to>
  }

  getDatePart(myDateStart: Date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datePart_ = monthNames[myDateStart.getMonth()] + ' '
      + (myDateStart.getDate() < 10 ? '0' : '') + myDateStart.getDate() + ', ' + myDateStart.getFullYear();
    const timePart = (myDateStart.getHours() < 10 ? '0' : '') + myDateStart.getHours()
      + ':' + (myDateStart.getMinutes() < 10 ? '0' : '') + myDateStart.getMinutes() + ':'
      + (myDateStart.getSeconds() < 10 ? '0' : '') + myDateStart.getSeconds();

    return {
      d_: datePart_,
      t_: timePart,
      full: datePart_ + ' ' + timePart
    };
  }
  previousData=[];
  newTimeStamp=[];
  checkNewRecord(data){
    this.newTimeStamp=[];
    if(this.previousData.length>0){
for(var i=0;i<data.length;i++){
  var outData=data[i];
  // var dataSource=outData["_source"];
  var timeStamp=outData["id"];
  if(!this.checkDuplicate(timeStamp)){
    this.newTimeStamp.push(timeStamp);
  }
}
}
  }
  checkDuplicate(timeStamp){
    var flag:boolean =false;
    for(var j=0;j<this.previousData.length;j++){
      var inData=this.previousData[j];
    var indataSource=inData["id"];
    if(timeStamp==indataSource){
      flag=true;
     return flag;
    }
    }
    return flag;
  }
  containsTimestamp(timesamp){
    
    if(this.newTimeStamp.includes(timesamp)){
      // console.log(timesamp + "asghdsaj" + JSON.stringify(this.newTimeStamp));
      return true;
    }
    return false;
  }

  filterData() {
    // this.model.alert_type = this.filter;
    this.callKpis();
  }
  searchCiFilterMessage() {
    this.callKpis();
  } 
  searchCiFilter() {
    console.log("id " + this.queryFieldCi.value); 
    var id = "";
    if (this.queryFieldCi.value != "" && this.queryFieldCi.value != undefined) {

      if (this.results != undefined) {
        for (var i = 0; i < this.results.length; i++) {
          if (this.queryFieldCi.value == this.results[i].host) {
            id = this.results[i].host;
            this.model.host = id;
          }
        }
      }

    } else {
      this.model.host = id;
    } 
    
    this.callKpis();
  }
  onEventDetect(event){
    const type=event['type'];
    const data=event['data'];
    const event_=event['event']
    if(type=='reload'){
      this.callKpis();  
    } 
  }
}
