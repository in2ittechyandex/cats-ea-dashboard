import { TabSummary } from './../../../models_/tab';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import themeConf_ from '../../../config/theme-settings';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import pageSettings from 'src/app/config/page-settings';
import { Subscription } from 'rxjs';
import { HomeSummaryService } from 'src/app/services_/homesummary.services';
import { ReportService } from 'src/app/services_/report.services';
import { UserTab } from './../../../models_/tab';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';

export interface HomeSummaryReportVM {
  title: String;
  url: String;
  chartType: String;
  isChartLoaded: Boolean;
  chartData: any;
  heightPixel: number;
  widthPer: number;
  colSpan: number;
}



@Component({
  selector: 'cats-home-summary',
  templateUrl: './home-summary.component.html',
  styleUrls: ['./home-summary.component.css']
})
export class HomeSummaryComponent implements OnInit, OnDestroy, AfterViewInit {
  themeConf_;
  pageSettings;
  closeResult: string;
  summaryCollapsed: boolean = false;

  widthPer = 100;
  heightPixel = 300;

  timeRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last Month', 'This Month'];

  public summaryReportUrl: Array<TabSummary> = [{ "summaryReportId": 0, "name": "Open Incidents", "title": "Open Incidents", "url": "incident/summary/openincidents", "summaryData": "", "isSummaryLoaded": false, "link": "", "ticketsUrl": "incident/summary/data/openincidents" }, { "name": "Open Incidents (High Priority)", "url": "incident/summary/total_incident_high", "summaryReportId": 0, "title": "Open Incidents (High Priority)", "summaryData": "", "isSummaryLoaded": false, "link": "", "ticketsUrl": "incident/summary/data/total_incident_high" }, { "summaryReportId": 0, "name": "Open Incidents (Critical Priority)", "title": "Open Incidents (Critical Priority)", "url": "incident/summary/total_incident_critical", "summaryData": "", "isSummaryLoaded": false, "link": "", "ticketsUrl": "incident/summary/data/total_incident_critical" }, { "summaryReportId": 0, "name": "Todays Resolved Incidents", "title": "Todays Resolved Incidents", "url": "incident/summary/resolved_today", "summaryData": "", "isSummaryLoaded": false, "link": "", "ticketsUrl": "incident/summary/data/resolved_today" }];
  public summaryArray: Array<TabSummary> = [];
  public _smry = {
    colorIcon: [{ "color": "bg-gradient-blue", "icon": "fa fa-dollar-sign fa-fw" }, { "color": "bg-gradient-teal", "icon": "fa fa-globe fa-fw" }, { "color": "bg-gradient-purple", "icon": "fa fa-archive fa-fw" }, { "color": "bg-gradient-blue", "icon": "fa fa-comment-alt fa-fw" }]
  }

  public summaryChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
  };

  @ViewChild('summaryTicketsData') summaryTicketsData;

  public homeReports: Array<HomeSummaryReportVM> = [{ "chartType": "radial-histogram-chart", "title": "Incident Home Trend Hour", "url": "incident/home/trend_hour", "widthPer": 100, "isChartLoaded": false, "chartData": null, "colSpan": 4, "heightPixel": 300 }, { "chartType": "solid-gauge-chart", "title": "Source Wise Incident", "url": "incident/home/source_incident", "widthPer": 100, "isChartLoaded": false, "chartData": null, "colSpan": 4, "heightPixel": 300 }, { "chartType": "bars-with-moving-bullets", "title": "Assignee Wise Incident", "url": "incident/home/assignee", "widthPer": 100, "isChartLoaded": false, "chartData": null, "colSpan": 4, "heightPixel": 300 }, { "chartType": "dumbbell-plot-charts", "title": "Status Wise Trend Date", "url": "incident/home/status_wise_trand_date", "widthPer": 100, "isChartLoaded": true, "chartData": null, "colSpan": 7, "heightPixel": 400 }, { "chartType": "radar-timeline-chart", "title": "Assignee Group Wise Assignee Incident", "url": "incident/home/assineegroup_assignee_incidents", "widthPer": 100, "isChartLoaded": true, "chartData": null, "colSpan": 5, "heightPixel": 400 }, { "chartType": "micro-charts-sparklines", "title": "Multi Series SparkLine chart", "url": "incident/home/multi_series_trand", "widthPer": 100, "isChartLoaded": true, "chartData": null, "colSpan": 12, "heightPixel": 310 }];

  public timeServicesSubsc$: Subscription;

  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };

  globalFilterModal = {
    isListenOnBlur: false,
    isListenOnBlur_AssigneeGroup: false,
    identifier: 'global-customer-filter',
    identifier_AssigneeGroup: 'global-assigneegroup-filter',
    filtersToggle: false,
    customers: [],
    assigneeGroup: [{ name: "ASD", value: false }, { name: "Non-ASD", value: false }]
  };
  tabList: any;

  constructor(private modalService: NgbModal,
    private timeServices_: TimeFilterService,
    private homeSummaryService_: HomeSummaryService, private reportService_: ReportService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.pageSettings = pageSettings;
    // this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
    //   this.onTsModified(obj);
    // });
  }

  ngOnInit() {
    this.getUserTab();
    // this.getSummaryReports();
    // this.themeConf_ = themeConf_;
    // this.loadGFCustomers();
    // this.fetchReportsData();
  }

  getUserTab(){
    // this.tabList =  this.reportService_.getUserTabsSubscriber().subscribe(tabs => {
    //   this.tabList = <UserTab[]>tabs;
    // });
    this.tabList =  this.reportService_.getUserTabsSubscriber()
    .subscribe(res =>{
      // console.log(res)
    return res['data'];
    });
    // console.log(this.tabList)
    if(this.tabList){
      // console.log('inside if')
      const url = '/dashboard/custom-widget/' + this.tabList[0].id;
      this.router.navigateByUrl(url);
    } else{
      const url = '/dashboard/home';
      this.router.navigateByUrl(url);
    }

    // console.log(this.tabList)
  }

  ngOnDestroy() {
    this.pageSettings.pageSidebarMinified = false;
  }

  ngAfterViewInit() {
    setTimeout(() => { this.pageSettings.pageSidebarMinified = true; }, 200)
  }


  modalReferenceAddReport: any;
  // open(content, size) {
  //   this.modalReferenceAddReport = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
  //   this.modalReferenceAddReport.result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  // loadGFCustomers() {
  //   this.homeSummaryService_.fetchGFCustomers().subscribe(res => {
  //     let data = res.status ? res.data : [];
  //     data.map(fil => {
  //       fil['value'] = false;
  //     });
  //     this.globalFilterModal.customers = data;
  //   }, err => {

  //   });
  // }


  // onGlobalFilterChange() {
  //   // TODO:fetch chart reports
  //   this.fetchReportsData();
  // }

  // onGlobalFilterToggle() {
  //   $('.gf_box').animate({
  //     width: 'toggle'
  //   });
  // }

  // showDD(event, obj_) {
  //   setTimeout(function () {
  //     const element_: Element = (event.target as Element);
  //     const elementDD: Element = element_.nextElementSibling;
  //     const existingClass = elementDD.getAttribute('class');
  //     const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
  //     obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
  //     elementDD.setAttribute('class', toggleClass);
  //   }, 100);
  // }

  // showDDAssigneeGroup(event, obj_) {
  //   setTimeout(function () {
  //     const element_: Element = (event.target as Element);
  //     const elementDD: Element = element_.nextElementSibling;
  //     const existingClass = elementDD.getAttribute('class');
  //     const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
  //     obj_['isListenOnBlur_AssigneeGroup'] = (toggleClass.indexOf('show') > -1);
  //     elementDD.setAttribute('class', toggleClass);
  //   }, 100);
  // }

  // onAssigneeGroupChange(obj, status, index) {
  //   // single select
  //   this.globalFilterModal.assigneeGroup.forEach((element, ndx) => {
  //     if (ndx == index) {
  //       //
  //     } else {
  //       element['value'] = false;
  //     }
  //   });
  // }

  // globalFilterClickOutSide(event) {
  //   const identifir = event.Identifier;
  //   this.globalFilterModal.isListenOnBlur = false;
  //   document.getElementById(identifir).click();
  // }

  // globalFilterClickOutSideAssigneeGroup(event) {
  //   const identifir = event.Identifier;
  //   this.globalFilterModal.isListenOnBlur_AssigneeGroup = false;
  //   document.getElementById(identifir).click();
  // }

  // onTsModified(info) {
  //   const str = {
  //     timestamp_start: info.timestamp.start,
  //     timestamp_end: info.timestamp.end,
  //     date_start: info.date.start,
  //     date_end: info.date.end,
  //     timeType: info.timeType.value
  //   };
  //   this.selectedTimeRange = str;
  // }

  // public fetchReportsData() {
  //   for (let i = 0; i < this.homeReports.length; i++) {
  //     this.makeCallToFetchReportData(this.homeReports[i], i);
  //   }

  // }


  // public makeCallToFetchReportData(obj: HomeSummaryReportVM, index) {
  //   this.homeReports[index].isChartLoaded = false;
  //   const urlToCall_ = this.homeReports[index].url;
  //   this.homeSummaryService_.getHomeReportsChartDataByURL(urlToCall_, index,
  //     this.selectedTimeRange,
  //     this.globalFilterModal).subscribe(res => {
  //       if (res.status) {
  //         this.homeReports[index].chartData = res.data.charts;
  //         this.homeReports[index].chartData.drill = res.data.drill;
  //         this.homeReports[index].chartData.reportDataInfo = res.reportDataInfo;
  //         this.homeReports[index].isChartLoaded = true;
  //       }
  //     }, err => {

  //     });
  // }

  // //#region summarydetails
  // public getSummaryHtmlConf(index, type) {
  //   index = (index > 3) ? (index % this._smry.colorIcon.length) : index;
  //   return this._smry.colorIcon[index][type];
  // }
  // getSummaryReports() {
  //   this.summaryReportUrl.forEach((element, index) => {
  //     let summary: TabSummary = new TabSummary(element);
  //     this.homeSummaryService_.fetchHomeSummaryTab(summary.url, this.selectedTimeRange,
  //       this.globalFilterModal).subscribe(res => {
  //         if (res.status) {
  //           summary.summaryData = res.data;
  //           summary.isSummaryLoaded = true;
  //           this.summaryReportUrl[index] = summary;
  //         }
  //       });
  //   });
  // }

  // getSumarytickets(summary: TabSummary, index) {
  //   let ticketsUrl = summary.ticketsUrl;
  //   this.summaryChartDrillDataStr['hTitle'] = summary.name;
  //   this.open(this.summaryTicketsData, 'lg');
  //   this.summaryChartDrillDataStr.isPanelLoading = true;
  //   if (ticketsUrl && ticketsUrl != '') {
  //     this.homeSummaryService_.fetchHomeSummaryTabTicketData(ticketsUrl, this.selectedTimeRange,
  //       this.globalFilterModal).subscribe(res => {
  //         if (res.status) {
  //           this.summaryChartDrillDataStr.header = res.data.charts.header;
  //           this.summaryChartDrillDataStr.data = res.data.charts.data;
  //           this.summaryChartDrillDataStr.isPanelLoading = false;
  //         } else {
  //           this.summaryChartDrillDataStr.isPanelLoading = false;
  //         }
  //       });
  //   }
  // }

  // //#region  summarydetails end
  // public reportChartDrillDataStr = {
  //   header: [],
  //   data: [],
  //   isPanelLoading: false,
  //   expand: false,
  //   hTitle: 'Report Data'
  // };


  // public TootTipStr_ = {
  //   left: 0,
  //   top: 0,
  //   ddItems: [],
  //   reportId: 0,
  //   reportSequence: 0,
  //   open: false,
  //   clickedData: []
  // };

  // calTooltipCordY(scrY, ClientY) {
  //   const winHeight = window.innerHeight;
  //   const diff = winHeight - scrY;
  //   return (diff >= 300) ? ClientY : (ClientY - (300 - diff));
  // }

  // calTooltipCordX(leftWidth) {
  //   const winWidth = window.innerWidth;

  //   const diff = winWidth - leftWidth;
  //   if (diff <= 300) {
  //     return (leftWidth - (300 - diff));
  //   } else {
  //     return leftWidth;
  //   }
  // }

  // onRightClickDetection(event) {
  //   // console.log(event)
  //   this.TootTipStr_.top = this.calTooltipCordY(event.screenY, event.clientY);
  //   this.TootTipStr_.left = this.calTooltipCordX(event.clientX);
  //   this.TootTipStr_.reportId = event.reportId;
  //   this.TootTipStr_.reportSequence = event.reportSequence;
  //   this.TootTipStr_.open = false;
  //   const report: HomeSummaryReportVM = this.homeReports[event.reportSequence];
  //   this.TootTipStr_.ddItems = report.chartData.drill ? report.chartData.drill : [];

  //   this.TootTipStr_.clickedData = event.clickedData ? event.clickedData : [];
  //   if (this.TootTipStr_.ddItems.length > 0) {
  //     this.TootTipStr_.open = true;
  //   }
  // }

  // onContextMenu(event) {
  //   return false;
  // }

  // onLeftClickDetection(event) {
  //   const cordinates_ = {
  //     left: event.clientX,
  //     top: event.clientY,
  //     open: true
  //   };

  //   let homeReportSequence = event.reportSequence;
  //   let report = this.homeReports[event.reportSequence];
  //   let urlToCall_ = report.chartData.reportDataInfo ? report.chartData.reportDataInfo['url'] : '';

  //   if (urlToCall_ && urlToCall_ != '') {
  //     this.open(this.summaryTicketsData, 'lg');
  //     this.reportChartDrillDataStr.isPanelLoading = true;
  //     const clickedData = event.clickedData ? event.clickedData : [];
  //     this.homeSummaryService_.getHomeSummaryReportsDrillData(urlToCall_, clickedData,
  //       this.selectedTimeRange, this.globalFilterModal).subscribe(res => {
  //         if (res.status) {
  //           this.summaryChartDrillDataStr.header = res.data.charts.header;
  //           this.summaryChartDrillDataStr.data = res.data.charts.data;
  //           this.summaryChartDrillDataStr.isPanelLoading = false;
  //         } else {
  //           this.summaryChartDrillDataStr.isPanelLoading = false;
  //         }

  //       });

  //   } else {
  //     //// // console.log("Data URL Not present ");
  //   }

  // }




}
