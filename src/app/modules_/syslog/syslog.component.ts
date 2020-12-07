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
  constructor(private eventService:EventsService, private slimLoadingBarService: SlimLoadingBarService, private modalService: NgbModal,
    private eventsService: SyslogService,private numberToDatePipe_: NumberToDatePipe) {
    this.pageSettings = pageSettings;  
    this.queryFieldCi = new FormControl();
  
     // this.startSchedular();
     this.columnDefs = [
      
      { 
        headerName: 'Time',
        field: 'display_time', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        'isActive':true
      },
      { 
        headerName: 'Description', 
        field: 'message', 
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
        headerName: 'Type', 
        field: 'type', 
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
  }
  topmargin=180;
  @HostListener("window:resize")
  onResize() {
      this.tableHeight=(window.innerHeight-this.topmargin).toString();
   
  }
 
  resetAllFilterAndTags() {
    this.model.host = "";
    this.model.date_hour = "";
    this.model.date_mday = "";
    this.model.date_month = "";
    this.model.date_wday = "";
    this.model.date_year = "";
    this.model.alert_type = "";
    this.model.topevent = "";
    this.model.timeObj = "";
    this.model.type = "";
    this.model.countTime = ""; 
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
    this.initSearch();


  }
  callKpis() {

    this.getAllTags(); 
    this.getEvents(this.model.host, this.model.date_hour, this.model.date_mday,
      this.model.date_month, this.model.date_wday, this.model.date_year,
      this.model.alert_type, this.model.message, this.model.dataCount,
      this.model.timeObj, this.model.type, this.model.countTime);

  }
  eventStatusList = [];
  filter = "";
  getEventStatusList() {
    // this.loading=true;
    this.eventsService.getEventStatusList().subscribe((res) => {
      if (res.Status) {
        this.eventStatusList = res.msg;
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

      if (res.Status) {
        if (res.msg.length > 0)
          this.results = res.msg;
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
    "date_hour": "",
    "date_mday": "",
    "date_month": "",
    "date_wday": "",
    "date_year": "",
    "alert_type": "",
    "topevent": "",
    "timeObj": "",
    "type": "",
    "countTime": "",
    "dataCount": 10000,
    "message": ""
  }
  res;//''={"Status":true,"totalpage":1,"sidenav":[{"name":"Event Type","data":[{"name":"type1","count":123},{"name":"type2","count":123}]},{"name":"NMS","data":[{"name":"nms1","count":123},{"name":"nms2","count":123}]},{"name":"Service Now","data":[{"name":"serviceno1","count":123},{"name":"servicenow","count":123}]},{"name":"Syslog","data":[]}],"Data":[{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":613,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE ALERT"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":614,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":615,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]}]};
  getEvents(host, date_hour, date_mday, date_month, date_wday, date_year, alert_type, message, datacount,
    timeObj, type, countTime) {
    if (this.allEventService) {
      this.allEventService.unsubscribe();
    }

    this.startLoading();
    const startTime: number = new Date().getTime();
    this.allEventService = this.eventsService.getEventsByTagsFilter(
      host,
       date_hour,
        date_mday, 
        date_month, 
        date_wday, 
        date_year, 
        alert_type,
         message,
          datacount,
      timeObj, 
      type, 
      countTime,
       "").subscribe((res) => {
        if (res.Status) {
          this.timeLeft=60;
          const endTime: number = new Date().getTime();
      const diffTime = endTime - startTime;
      this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
          this.mData = res.Data;  
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
    this.model.alert_type = this.filter;
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
