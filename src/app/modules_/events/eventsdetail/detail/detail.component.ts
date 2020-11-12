// import { PagerService } from './../../../../services_/pager.services';
import { Component, OnInit, ViewEncapsulation,AfterViewInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../../config/theme-settings';
 import * as global from 'src/app/config/globals'; 
import pageSettings from '../../../../config/page-settings'; 
import { FormControl } from '@angular/forms';
import { EventsService } from '../../events.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { TimeFilterService } from '../../../../../time-filter/time-filter.service.component';
// import { PagerService } from '../../../../services_/pager.service';
import { Subscription } from 'rxjs';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { PagerService } from 'src/app/shared_/pager.service';
@Component({
  selector: 'cats-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  pageSettings; 
  global = global;
   closeResult: string;
   results: any[] = [];
   queryField: FormControl = new FormControl();
   query;
   allEventService;
   public mData=[];
   public userTabSubscr_: Subscription; 
   loading:boolean=true;
   data = {
    'chart': {
      'pYAxisName': '',
      'sYAxisName': '',
      'caption': '',
      'subcaption': '',
      'xaxisname': ' ',
      'yaxisname': '',
      'formatNumberScale': '0',
      'numberprefix': '',
      'exportenabled': '0',
      'theme': 'fusion',
      'bgColor': '#ffffff',
      'bgAlpha': '100',
      'showLabels': '1',
      'labelStep': '4',
      'rotateLabels': '0',
      'labelDisplay': 'wrap',
      'slantLabel': '1',
      'showCanvasBorder': '0',
      'divlinecolor': '#000000',
      'divLineColor': '#6699cc',
      'divLineAlpha': '0',
      'divLineDashed': '0',
      'showAlternateHGridColor': '0',
      'showValues': '0',
      'rotateValues': '1',
      'showYAxisValues': '0',
      'showLegend': '0',
      // "plotToolText": "$series $label : $value", 
    },
    'categories': [
        {
            'category': []
        }
    ],
    'dataset': [],
    'trendlines': []
}
  width = '100%';
  height = 200;
  type = 'msline';
  dataFormat = 'json';
  dataSource;
  chartId='chartDivColumn'
   constructor(
     private slimLoadingBarService: SlimLoadingBarService,
     private timeServices_: TimeFilterService,
     private modalService: NgbModal,
     private eventsService:EventsService,
     private pagerService:PagerService) { 
    this.pageSettings = pageSettings;
    this.dataSource = this.data;
    // this.pageSettings.pageWithoutSidebar=false;
    this.userTabSubscr_ = this.eventsService.getUserTabsSubscriber().subscribe(tabs => {
      
      this.currentPage = 1;
      // this.filter = ""; 
      this.currentHost=this.eventsService.eventtypeId;
      this.currentHost=localStorage.getItem('eventtypeId');  
      this.resetAllFilterAndTags();
      
      this.callKpis(); 
    });
   }
   resetAllFilterAndTags(){
    this.model.host='';
      this.model.date_hour='';
      this.model.date_mday='';
      this.model.date_month='';
      this.model.date_wday='';
      this.model.date_year='';
      this.model.alert_type='';
      this.model.topevent='';
      this.model.timeObj='';
      this.model.type='';
      this.model.countTime='';
      this.currentPage=1;
  }
   themeConf_;
   summaryCollapsed: boolean = true;
 currentHost;
   ngOnInit() {  
     this.currentHost=localStorage.getItem('eventtypeId');
     this.themeConf_ = themeConf_;
     this.res=undefined;
     this.initSearch();
     this.getAllTags();
     this.getSideNav();
     
   }
   amChartData=[];
   getAllEventsChart(host) {
   this.amChartData=[];
    this.eventsService.getAllEventsChartByHost(host).subscribe((res) => {
      if (res.Status) {
        this.data.categories = res.data.categories;
        this.data.dataset = res.data.dataset;
        this.dataSource = this.data; 
        for(var i=0;i<this.data.categories[0].category.length;i++){
          var obj={
            date:this.data.categories[0].category[i].label,
            actual:this.data.dataset[0].data[i].value,
            expected:this.data.dataset[0].data[i].value,
          }
          this.amChartData.push(obj);
        }
      } else {
        // this.data.categories = res.data.categories;
        // this.data.dataset = res.data.dataset;
        // this.dataSource = this.data;
      }
    }, (err) => { 
    });
  }
   callKpis(){ 
     
    this.getAllTags();
    this.getSideNav();
    this.getEvents(this.currentHost,this.model.date_hour,this.model.date_mday,
      this.model.date_month,this.model.date_wday,this.model.date_year,this.model.alert_type,this.model.topevent,this.currentPage,
      this.model.timeObj, this.model.type, this.model.countTime);
      this.getAllEventsChart(this.currentHost);
   }
   onChange(){
    this.currentPage=1;
    this.loading=true;
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
    this.queryField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(result => this.getSearchData(result));

  }
  getSearchData(result) {
    console.log(result);
    this.eventsService.search_host(result).subscribe((res) => {

      if (res.Status) {
        if(res.msg.length>0)
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
  getAllTags(){
     this.eventsService.getAllTags(this.currentHost).subscribe((res) => {
      if (res.Status) {
       this.allTags = res.data;
       
      //  this.count_critical = this.mData["count_critical"];
      //  this.count_major = this.mData["count_major"];
      //  this.count_minor = this.mData["count_minor"];
      //  this.count_warning = this.mData["count_warning"];
      // this.totalPages=res.totalpage;
      //  this.initPage(pageNumber);
       this.completeLoading();
       this.allEventService = null;
     }
   }, (err) => {
     this.completeLoading();
     this.allEventService = null;
    });
  }
  getSideNav(){
      this.eventsService.getSideNav(this.currentHost,this.model.date_hour,this.model.date_mday,
        this.model.date_month,this.model.date_wday,this.model.date_year,this.model.timeObj, this.model.type, this.model.countTime).subscribe((res) => {
      if (res.Status) {
       this.res = res;
       
      //  this.count_critical = this.mData["count_critical"];
      //  this.count_major = this.mData["count_major"];
      //  this.count_minor = this.mData["count_minor"];
      //  this.count_warning = this.mData["count_warning"];
      // this.totalPages=res.totalpage;
      //  this.initPage(pageNumber);
       this.completeLoading();
       this.allEventService = null;
     }
   }, (err) => {
     this.completeLoading();
     this.allEventService = null;
    });
  }
  model={
    'host':'',
    'date_hour':'',
    'date_mday':'',
    'date_month':'',
    'date_wday':'',
    'date_year':'',
    'alert_type':'',
    'topevent':'',
    'timeObj':'',
    'type':'',
    'countTime':''
  }
  res;//''={"Status":true,"totalpage":1,"sidenav":[{"name":"Event Type","data":[{"name":"type1","count":123},{"name":"type2","count":123}]},{"name":"NMS","data":[{"name":"nms1","count":123},{"name":"nms2","count":123}]},{"name":"Service Now","data":[{"name":"serviceno1","count":123},{"name":"servicenow","count":123}]},{"name":"Syslog","data":[]}],"Data":[{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":613,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE ALERT"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":614,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]},{"time":"2019-03-09T11:54:54.033Z","display_time":"09-03-2019 11:54:54","code":615,"Event":[{"tag":"message","value":"PING CRITICAL - Packet loss = 60%, RTA = 207.77 ms"},{"tag":"host_name","value":"BBSR_VPN_172.16.1.11"},{"tag":"severity","value":"CRITICAL"},{"tag":"type","value":"SERVICE NOTIFICATION"},{"tag":"user","value":"admin"},{"tag":"Input Source","value":"NAGIOS"}]}]};
  getEvents(host,date_hour,date_mday,date_month,date_wday,date_year,alert_type,topevent,pageNumber,
    timeObj,type,countTime){
    if (this.allEventService) {
     this.allEventService.unsubscribe();
   }
   
   this.startLoading();
   this.allEventService = this.eventsService.getEventsByTagsFilter(host,date_hour,date_mday,date_month,date_wday,date_year,alert_type,topevent,pageNumber,
    timeObj,type,countTime,'').subscribe((res) => {
      if (res.Status) {
       this.mData = res.Data;
      //  this.mData = this.res.Data;
      //  this.count_critical = this.mData["count_critical"];
      //  this.count_major = this.mData["count_major"];
      //  this.count_minor = this.mData["count_minor"];
      //  this.count_warning = this.mData["count_warning"];
      // this.totalPages=res.totalpage;
      //  this.initPage(pageNumber);
      this.totalPages=res.totalpage;
       this.initPage(pageNumber);
       this.completeLoading();
       this.allEventService = null;
       this.loading=false;
     }else{
      this.loading=false;
     }
   }, (err) => {
     this.completeLoading();
     this.allEventService = null;
     this.loading=false;
    });
    console.log('get data');
    
 }
 pager: any = {}; 
  pagedItems: any[];
  currentPage = 1;
  totalPages = 0;
 setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
  this.currentPage = page;
  this.loading=true;
   this.callKpis();
   this.pager = this.pagerService.getPager(this.totalPages, page);
}
 initPage(page: number) {
  // if (page < 1 || page > this.pager.totalPages) {
  //   return;
  // }
  this.pager = this.pagerService.getPager(this.totalPages, page);
  this.pagedItems = this.pagerService.range(1, this.totalPages);
}
pageNumber: any = 1;


 clickOnFilter(filter,subfilter){
   this.model.alert_type=subfilter.name;
   this.model.topevent=filter.name;
   this.currentPage=1;
   this.loading=true;
this.callKpis();
 }
 clickOnFilterMenu(filter){
  this.model.alert_type='';
  this.model.topevent=filter.name;
  this.currentPage=1;
  this.loading=true;
this.callKpis();
 }
   ngOnDestroy(): void { 
    // this.pageSettings.pageWithoutSidebar=false;
    this.userTabSubscr_.unsubscribe();
  }
  searchCiFilter(){
    console.log('id '+this.queryField.value);
    this.currentPage=1;
    var id = '';
    if(this.queryField.value!=''&&this.queryField.value!=undefined){
      
      if (this.results != undefined) {
        for (var i = 0; i < this.results.length; i++) {
          if (this.queryField.value == this.results[i].host) {
            id = this.results[i].host;
            this.eventsService.eventtypeId=id;
            localStorage.setItem('eventtypeId',id);
            this.currentHost=id;
          }
        }
      }
      
  }else{
    this.eventsService.eventtypeId='';
    localStorage.setItem('eventtypeId',id);
            this.currentHost=id;
  }
  this.currentPage=1;
  this.loading=true;
  this.resetAllFilterAndTags();
   this.callKpis();
  }
  expandMenu(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
   
    console.log('iddddd'+value );
     
    if (document.getElementById(value+'-content').style.display === 'block') {
      document.getElementById(value+'-content').style.display = 'none';
      } else {
        document.getElementById(value+'-content').style.display = 'block';
      }
  }
//   var dropdown = document.getElementsByClassName("dropdown-btn");
// var i;

// for (i = 0; i < dropdown.length; i++) {
//   dropdown[i].addEventListener("click", function() {
//   this.classList.toggle("active");
//   var dropdownContent = this.nextElementSibling;
//   if (dropdownContent.style.display === "block") {
//   dropdownContent.style.display = "none";
//   } else {
//   dropdownContent.style.display = "block";
//   }
//   });
// }
}
