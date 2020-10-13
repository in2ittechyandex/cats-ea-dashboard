import { SharedServices } from './../../../../shared_/shared.services';
import { UserTab, Report, Filter, TabSummary, FilterValue } from './../../../../models_/tab';
import { ReportService } from './../../../../services_/report.services';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from '../../../../config/theme-settings';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { TimeFilterService } from '../../../../shared_/time-filter/time-filter.service.component';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

// import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
// import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
// import { PerformanceService } from 'src/app/services_/performance.services';

declare var moment;


@Component({
  selector: 'cats-custom-widget',
  templateUrl: './custom-widget.component.html',
  styleUrls: ['./custom-widget.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomWidgetComponent implements OnInit, OnDestroy {

  // name = 'Angular 5';
  public singleDate: any;
  @ViewChild(DaterangePickerComponent)
  public picker: DaterangePickerComponent;
  public singlePicker = {
    singleDatePicker: true,
    showDropdowns: true,
    opens: 'left',
    minDate: moment().startOf('day')
  };


  // dateFilter_timeType = '7d';
  // dateFilter_startDate = moment().subtract(6, 'days').startOf('day');
  // dateFilter_endDate =  moment().endOf('day');
  // dateFillter_customRanges = ['Last 1 Hour', 'Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month'];

  dateFilter_timeType = 'td';
  dateFilter_startDate = moment().startOf('day');  // moment().subtract(1, 'hours');
  dateFilter_endDate = moment(); // moment();
  dateFillter_customRanges = [
    'Last 1 Hour',
    'Today',
    'Yesterday',
    'Last 7 Days ',
    'This Month ',
    'Last Month',
  ];

  public repDetail = {
    // repName: 'Incident Report Data',
    timeType: '',
    customer: '',
    timeString: '',
    startDate: '',
    endDate: '',
    isLoaded: false
  };
  showMainLoader: boolean = true;



  constructor(
    // private performanceService_: PerformanceService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private reportService_: ReportService,
    private sharedServices_: SharedServices,
    private timeServices_: TimeFilterService,
    private daterangepickerOptions: DaterangepickerConfig
  ) {

    this.singleDate = Date.now();

    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
    });

    this.onTsModified({
      date: {
        start: this.dateFilter_startDate,
        end: this.dateFilter_endDate
      },
      timestamp: {
        start: Date.parse(this.dateFilter_startDate),
        end: Date.parse(this.dateFilter_endDate),
      },
      timeType: {
        value: this.dateFilter_timeType
      }
    });

    // this.timeServicesSubsc2$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
    //   this.onTsModified2(obj);
    // });

    this.userTabSubscr_ = this.reportService_.getUserTabsSubscriber().subscribe(tabs => {
      this.usrAllTabs = tabs;
    });

    this.reportService_.getExistingTabs();
  }

  public singleSelect(value: any) {
    this.singleDate = value.start;
    const startDateInTimeStamp = Date.parse(value.start);
    this.modAddScheduleReports_.selscheduleDate = '' + startDateInTimeStamp;
  }
  @ViewChild('modelDrillChartData') modelDrillChartData;
  @ViewChild('clickRightPopup') clickRightPopup;
  @ViewChild('summaryTicketsData') summaryTicketsData;


  chartIdNameMap = { '1': 'line', '2': 'bar', '3': 'grid', '4': 'pie', '5': 'stack', '6': 'msbar', '7': 'area', '8': 'funnel', '9': 'msbar3d', '10': 'heat', '11': 'calendar', '12': 'msline', '13': 'stack3d' };


  closeResult: string;
  themeConf_;
  summaryCollapsed = true;

  heightPixel = 300;
  widthPer = 100;

  panelReload = false;

  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };

  selecteddaterange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };

  selectedDateRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  }
  public timeServicesSubsc$: Subscription;
  public timeServicesSubsc2$: Subscription;
  // public amChartsThemeSubscr$:Subscription;
  public summaryChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
  };
  public amChartsTheme: string;
  
  globalFilterModal = {
    isListenOnBlur: false,
    isListenOnBlur_AssigneeGroup: false,
    identifier: 'global-customer-filter',
    identifier_AssigneeGroup: 'global-assigneegroup-filter',
    filtersToggle: false,
    customers: [],
    ScheduleReport: [],
    masterSelectedCustomer: false,
    assigneeGroup: [{ name: 'ASD', value: false }, { name: 'Non-ASD', value: false }],
    userTabFilters: null,

    editCustomers: [],
    modifyCustomer: [],

    masterSelectedAsigneeGroup: false,

    asd: [],
    editAsd: [],
    modifyAsd: [],
    isListenOnBlurASD: false,
    masterSelectedASD: false,


    nonAsd: [],
    editNonASD: [],
    modifyNonASD: [],
    isListenOnBlurNONASD: false,
    masterSelectedNONASD: false,

    timeType: 'cu'
  };

  public modAddReports_ = {
    'selCategory': '',
    'selReport': '',
    'selChartType': '',
    'selCoumnSpan': '',
    'selReportName': '',
    'selReportDesc': '',
    'categories': [],
    'reports': [],
    'charts': [],
    'colspan': [],
    'colspan_defaults': [
      { 'id': 6, 'value': 'Column Span 6' },
      { 'id': 12, 'value': 'Column Span 12' }]
  };

  themeName: 'default';
  public modAddSummary_ = {
    'selSummaryCategory': '',
    'selSummaryReport': '',
    'selSummaryName': '',
    'summaryCategory': [],
    'summaryReport': []
  };


  public modAddScheduleReports_ = {
    'selCategory': '',
    'selReport': '',
    'selscheduleReportName': '',
    'seldateRange': [{ 'selstartDate': '', 'selendDate': '' }],
    'selFormat': '',
    'selScheduleTime': { 'selHH': '', 'selMM': '', 'selAMPM': '' },
    'selIsRecurring': '',
    'selemail': '',
    'selscheduleDate': '',
    'categories': [],
    'reports': [],
    'format': [],
    'isReoccurring': 0,

  };

  public modDownloadReport_ = {
    'selCategory': '',
    'selReport': '',
    'selscheduleReportName': '',
    'seldateRange': [{ 'selstartDate': '', 'selendDate': '' }],
    'selFormat': '',
    'selScheduleTime': '',
    'selIsRecurring': '',
    'categories': [],
    'reports': [],
    'format': [],
    'isReoccurring': 0
  }

  public _smry = {
    isListenOnBlur: false,
    identifier: 'summaryTabDD',
    colorIcon: [{ 'color': 'bg-gradient-blue', 'icon': 'fa fa-dollar-sign fa-fw' },
    { 'color': 'bg-gradient-teal', 'icon': 'fa fa-globe fa-fw' },
    { 'color': 'bg-gradient-purple', 'icon': 'fa fa-archive fa-fw' },
    { 'color': 'bg-gradient-black', 'icon': 'fa fa-comment-alt fa-fw' }]
  };

  public TootTipStr_ = {
    left: 0,
    top: 0,
    ddItems: [],
    reportId: 0,
    reportSequence: 0,
    open: false,
    clickedData: []
  };

  public urlHome = '/dashboard/home'; // '/dashboard/static-widget/map-monitor'; //
  public usrAllTabs: UserTab[] = [];
  public userTabSubscr_: Subscription;



  public selectedTabId: number;
  public selectedcategoryId: number;
  public selectedTabName: String = '';
  public userTab_: UserTab;
  public scheduleReportId: number;

  public reportChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
    hTitle: 'Report Data',
    url: ''
  };


  modalReferenceAddReport: any;
  modalReferenceAddScheduleReport: any;

  onGlobalFilterToggle() {
    $('.gf_box').animate({
      width: 'toggle'
    });
  }

  onAssigneeGroupChange(obj, status, index) {
    // single select
    this.globalFilterModal.assigneeGroup.forEach((element, ndx) => {
      if (ndx == index) {
        //
      } else {
        element['value'] = false;
      }
    });
  }

  globalFilterClickOutSide(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur = false;
    document.getElementById(identifir).click();
  }
  globalFilterClickOutSideAssigneeGroup(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur_AssigneeGroup = false;
    document.getElementById(identifir).click();
  }

  onGlobalFilterChange() {
    this.TootTipStr_.open = false;
    setTimeout(() => {      
      this.compareUserTabGlobalFilterModification();
    }, 1000);
    // this.fetchReportsData();
    // this.fatchReportsdata();
    // this.fetchReportSummaryData();
  }

  updateUserTabFilters() {
    this.showMainLoader = true;
    this.getHeaders();
    // this.reportService_.updateUserTabFilter(this.selectedTabId, this.globalFilterModal).subscribe(res => {
    //   if (res['status'] == true) {
    //     this.showMainLoader = false;
    //     swal({
    //       position: 'center',
    //       type: 'success',
    //       title: '',
    //       titleText: 'Filter Saved Successfully',
    //       showConfirmButton: false,
    //       timer: 1000
    //     });
    //   }
    // }, err => {

    // });
  }

  getHeaders() {
    this.repDetail.isLoaded = false;
    this.repDetail.timeType = ''; //this.performanceService_.timeMap[this.selectedTimeRange.timeType];
    // this.repDetail.customer = this.performanceService_.findSelectedCustomers(this.performanceService_.globalFilters['customers']);
    // console.log(this.repDetail.customer)
    const startTime = this.selectedTimeRange.timestamp_start;
    const endTime = this.selectedTimeRange.timestamp_end;
    let str = '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const myDateStart = new Date(startTime);
    const myDateEnd = new Date(endTime);
    str += '(';
    if (this.selectedTimeRange.timeType == 'l1h') {
      str += this.getDatePart(myDateStart)['full'] + ' - ' + this.getDatePart(myDateEnd)['full'];
    } else {
      str += this.getDatePart(myDateStart)['d_'] + '' + ' - ' + this.getDatePart(myDateEnd)['d_'] + '';
    }

    str += ')' + ' - ' + this.repDetail.timeType;

    this.repDetail.startDate = moment(myDateStart).format("DD-MM-YYYY h:mm:ss");
    this.repDetail.endDate = moment(myDateEnd).format("DD-MM-YYYY h:mm:ss");

    this.repDetail.timeString = str;
    localStorage.setItem('reportPageTitle', (this.userTab_ ? this.userTab_.name : '') + ' ' + this.repDetail.timeString);
    this.repDetail.isLoaded = true;
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

  // TODO : write a f/n which will find modified values of filter

  public compareUserTabGlobalFilterModification() {
    this.globalFilterModal.modifyCustomer = this.detectChanges(this.globalFilterModal.editCustomers, this.globalFilterModal.customers);
    this.globalFilterModal.modifyAsd = this.detectChanges(this.globalFilterModal.editAsd, this.globalFilterModal.asd);
    this.globalFilterModal.modifyNonASD = this.detectChanges(this.globalFilterModal.editNonASD, this.globalFilterModal.nonAsd);

    this.updateUserTabFilters();
    this.fetchReportsData();
    this.fetchReportSummaryData();
  }

  detectChanges(actualFilters: Array<any>, editFilters: Array<any>) {
    const modifiedFilters: Array<any> = [];
    actualFilters.forEach((filVal, index) => {
      if (filVal.value !== editFilters[index].value) {
        modifiedFilters[modifiedFilters.length] = editFilters[index];
      }
    });
    return modifiedFilters;
  }

  clearModalAddReports() {
    this.modAddReports_['selCategory'] = '',
      this.modAddReports_['selReport'] = '',
      this.modAddReports_['selChartType'] = '',
      this.modAddReports_['selCoumnSpan'] = '',
      this.modAddReports_['selReportName'] = '',
      this.modAddReports_['selReportDesc'] = '',
      this.modAddReports_['reports'] = [],
      this.modAddReports_['charts'] = [],
      this.modAddReports_['charts'] = [];
  }

  clearModalAddSummary() {
    this.modAddSummary_['selSummaryCategory'] = '';
    this.modAddSummary_['selSummaryReport'] = '';
    this.modAddSummary_['selSummaryName'] = '';
  }

  clearModalAddScheduleReports() {
    this.modAddScheduleReports_['selCategory'] = '',
      this.modAddScheduleReports_['selReport'] = '',
      this.modAddScheduleReports_['selscheduleReportName'] = '',
      this.modAddScheduleReports_['selFormat'] = '',
      // this.modAddScheduleReports_['selScheduleTime'] = [];
      this.modAddScheduleReports_['selIsRecurring'] = '',
      this.modAddScheduleReports_['selemail'] = '',
      this.modAddScheduleReports_['selscheduleDate'] = '',
      this.modAddScheduleReports_['reports'] = [];
    this.modAddScheduleReports_['selisReoccurring'] = [];
    this.modAddScheduleReports_['seldateRange'] = [];
    this.modAddScheduleReports_['selstartDate'] = '',
      this.modAddScheduleReports_['selendDate'] = ''
  }
  // clearModalDownloadReports(){
  //   this.modDownloadReport_['selCategory'] = '',
  //   this.modDownloadReport_['selReport'] = '',
  //   this.modDownloadReport_['selscheduleReportName'] = '',
  //   this.modDownloadReport_['selFormat'] = '',
  //   this.modDownloadReport_['selScheduleTime'] = '',
  //   this.modDownloadReport_['selIsRecurring'] = '',
  //   this.modDownloadReport_['reports'] = [];
  // this.modDownloadReport_['selisReoccurring'] = [];
  // this.modDownloadReport_['seldateRange'] = [];
  // this.modDownloadReport_['selstartDate'] = '',
  //   this.modDownloadReport_['selendDate'] = ''
  // }

  public getSummaryHtmlConf(index, type) {
    index = (index > 3) ? (index % this._smry.colorIcon.length) : index;
    return this._smry.colorIcon[index][type];
  }

  /**
   * Angular Life Cycle Method
   * will invoke when we move to different url
   * Note: will not invoke if we navigate to current route with param change only
   * like custom-widget/x1 to custom custom-widget/x2 , here don't refresh pages.
   */
  ngOnDestroy() {
    if (this.timeServicesSubsc$ && this.timeServicesSubsc$ != null) {
      this.timeServicesSubsc$.unsubscribe();
    }
    if (this.timeServicesSubsc2$ && this.timeServicesSubsc2$ != null) {
      this.timeServicesSubsc2$.unsubscribe();
    }
    if (this.userTabSubscr_) {
      this.userTabSubscr_.unsubscribe();
    }
  }


  onTsModified(info) {
    const str = {
      timestamp_start: info.timestamp.start,
      timestamp_end: info.timestamp.end,
      date_start: info.date.start,
      date_end: info.date.end,
      timeType: info.timeType.value
    };
    this.selectedTimeRange = str;
  }

  // onTsModified2(info) {
  //   const str = {
  //     timestamp_start: info.timestamp.start,
  //     timestamp_end: info.timestamp.end,
  //     date_start: info.date.start,
  //     date_end: info.date.end,
  //     timeType: info.timeType.value
  //   };
  //   this.selecteddaterange = str;
  // }

  showDD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  showDDAssigneeGroup(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur_AssigneeGroup'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }


  detectClickOutSide(event) {
    const identifir = event.Identifier;
    const reportNDX_ = ((identifir.split(':')[0]).replace('Rep_', '')).trim();
    const filterNDX_ = ((identifir.split(':')[1]).replace('Fil_', '')).trim();
    if (event.isOutSide) {
      this.userTab_.reportUrl[reportNDX_].filters[filterNDX_]['isListenOnBlur'] = false;
      document.getElementById(identifir).click();
    }
  }

  calTooltipCordX(leftWidth) {
    const winWidth = window.innerWidth;

    const diff = winWidth - leftWidth;
    if (diff <= 300) {
      return (leftWidth - (300 - diff));
    } else {
      return leftWidth;
    }
  }

  calTooltipCordY(scrY, ClientY) {
    const winHeight = window.innerHeight;
    const diff = winHeight - scrY;
    return (diff >= 300) ? ClientY : (ClientY - (300 - diff));
  }

  onRightClickDetection(event) {
    this.TootTipStr_.top = this.calTooltipCordY(event.screenY, event.clientY);
    this.TootTipStr_.left = this.calTooltipCordX(event.clientX);
    this.TootTipStr_.reportId = event.reportId;
    this.TootTipStr_.reportSequence = event.reportSequence;
    this.TootTipStr_.open = false;
    const report: Report = this.userTab_.reportUrl[event.reportSequence];
    this.TootTipStr_.ddItems = report.isMultilevelDrill ? report.mlChartData.drill : report.chartData.drill;

    this.TootTipStr_.clickedData = event.clickedData ? event.clickedData : [];
    if (this.TootTipStr_.ddItems.length > 0) {
      this.TootTipStr_.open = true;
    }

  }

  onLeftClickDetection(event) {
    const cordinates_ = {
      left: event.clientX,
      top: event.clientY,
      open: true
    };

    //#region:resetdrillData
    this.reportChartDrillDataStr.header = [];
    this.reportChartDrillDataStr.data = [];
    this.reportChartDrillDataStr.isPanelLoading = false;
    //#region:resetdrillData

    const report: Report = this.userTab_.reportUrl[event.reportSequence];

    let dataUrl: String = '';
    if (report.isMultilevelDrill) {
      dataUrl = report.mlChartData.reportDataInfo ? report.mlChartData.reportDataInfo.url : '';
      this.reportChartDrillDataStr.hTitle = report.mlChartData.name;
    } else {
      dataUrl = report.chartData.reportDataInfo ? report.chartData.reportDataInfo.url : '';
      this.reportChartDrillDataStr.hTitle = report.title.toString();
    }
    this.reportChartDrillDataStr.url = '' + dataUrl;
    if (dataUrl && dataUrl !== '') {
      this.open(this.modelDrillChartData, 'lg');
      this.reportChartDrillDataStr.isPanelLoading = true;
      const clickedData = event.clickedData ? event.clickedData : [];
      if (!report.isMultilevelDrill) {
        this.reportService_.getDrillData(dataUrl, clickedData, report.reportId,
          this.selectedTimeRange, this.globalFilterModal).subscribe(res => {
            if (res.status) {
              this.reportChartDrillDataStr.header = res.data.charts.header;
              this.reportChartDrillDataStr.data = res.data.charts.data;
              this.reportChartDrillDataStr.isPanelLoading = false;
              $('#PanelTestDrillData').click();
            } else {
              this.reportChartDrillDataStr.isPanelLoading = false;
            }
          });
      } else {
        const drillDownId = report.mlChartData.drillDownId;
        const drillFilterValue = report.mlChartData.lastDrillFilterValue;
        this.reportService_.getDrillDataLeftClick(dataUrl, clickedData, report.reportId,
          drillDownId, drillFilterValue, this.selectedTimeRange, this.globalFilterModal).subscribe(res => {
            if (res.status) {
              this.reportChartDrillDataStr.header = res.data.charts.header;
              this.reportChartDrillDataStr.data = res.data.charts.data;
              this.reportChartDrillDataStr.isPanelLoading = false;
              $('#PanelTestDrillData').click();
            } else {
              this.reportChartDrillDataStr.isPanelLoading = false;
            }
          });
      }

    } else {
    }
  }


  //k
  getSumarytickets(summary: TabSummary, index) {
    let ticketsUrl = summary.ticketsUrl;
    this.summaryChartDrillDataStr['hTitle'] = summary.name;
    this.open(this.summaryTicketsData, 'lg');
    this.summaryChartDrillDataStr.isPanelLoading = true;
    if (ticketsUrl && ticketsUrl != '') {
      this.reportService_.fetchCustomWidgetSummaryTabTicketData(ticketsUrl, this.selectedTimeRange,
        this.globalFilterModal).subscribe(res => {
          if (res.status) {
            this.summaryChartDrillDataStr.header = res.data.charts.header;
            this.summaryChartDrillDataStr.data = res.data.charts.data;
            this.summaryChartDrillDataStr.isPanelLoading = false;
          } else {
            this.summaryChartDrillDataStr.isPanelLoading = false;
          }
        });
    }
  }
  //k
  ngOnInit() {
    this.getHeaders();
    this.themeConf_ = themeConf_;
    this.loadGFCustomers();
    this.loadCategories();
    this.loadInitData();
    this.loadScheduleReport();

  }

  public loadInitData() {
    this.checkRouteParam_();
  }

  public checkRouteParam_() {
    this.route.params.subscribe((params: Params) => {
      this.TootTipStr_.open = false;
      this.validateRouteParam();
    });
  }

  getFilterClass(colm_) {
    if (colm_ == 8) {
      return 'col-md-6';
    } else if (colm_ == 4) {
      return 'col-md-12';
    } else if (colm_ == 6) {
      return 'col-md-6';
    } else if (colm_ == 12) {
      return 'col-md-4';
    } else {
      return 'col-md-6';
    }

  }

  public getFilters(reportObj_: Report, index) {
    this.reportService_.getReportFilter(reportObj_.reportId).subscribe(res =>
      this.userTab_.reportUrl[index].filters = this.bindReportFilters(((res.status) ? res.data : []), this.userTab_.reportUrl[index]));
  }

  bindReportFilters(filtersArr_: any[], report: Report) {
    report.filters = [];
    filtersArr_.forEach(element => {
      const filter_: Filter = new Filter(element);
      report.filters.push(filter_);
    });
    return report.filters;
  }

  onFilterChange(index, rndx, fNdx) {
    const isMultiselect = this.userTab_.reportUrl[rndx].filters[fNdx].isMultiSelect;
    if (isMultiselect) {
      // do nothing
    } else {
      const allkeys: FilterValue[] = this.userTab_.reportUrl[rndx].filters[fNdx].editFilters;
      const valueLength = allkeys.length;
      for (let i = 0; i < valueLength; i++) {
        this.userTab_.reportUrl[rndx].filters[fNdx].editFilters[i].value = (i == index) ?
          this.userTab_.reportUrl[rndx].filters[fNdx].editFilters[i].value : false;
      }
    }
  }

  validateModifiedFilter(modifiedArr: Array<FilterValue>, object: FilterValue, typeMS: Boolean) {
    let objectExistId = -1;
    for (let i = 0; i < modifiedArr.length; i++) {
      if (modifiedArr[i].name === object.name) {
        objectExistId = i;
        return;
      }
    }

    if (objectExistId > -1) {
      modifiedArr.splice(objectExistId, 1);
    }
    if (!typeMS) {
      modifiedArr.length = 0;
    }
    modifiedArr[modifiedArr.length] = object;
  }

  public compareFilterModification(report_: Report) {
    report_.filters.forEach((filter_: Filter) => {
      const actualFilters: Array<FilterValue> = filter_.values;
      const editFilters: Array<FilterValue> = filter_.editFilters;
      actualFilters.forEach((filVal, index) => {
        if (filVal.value !== editFilters[index].value) {
          filter_.modifiedFilters[filter_.modifiedFilters.length] = editFilters[index];
        }
      });
    });
    return report_;
  }


  public isAllChecked(filters) {
    const allItems = filters.length;
    let count = 0;
    filters.forEach(filter => {
      if (filter.value) {
        count++;
      }
    });
    return allItems === count;
  }

  public checkAll(event, filters, index) {
    filters.forEach(filter => {
      filter.value = event.target.checked;
    });
  }


  public checkAllGFCustomers(event, filters, index) {
    filters.forEach(filter => {
      filter.value = event;
    });
  }


  /**
   * @param report_ report object where filters applied
   * @param filter_ filter objects
   * @param rndx report index
   */
  public submitFilter(report_: Report, filter_: Array<Filter>, rndx) {
    const rep: Report = this.compareFilterModification(report_);
    this.userTab_.reportUrl[rndx].isChartLoaded = false;
    this.reportService_.updateReportFilter(report_.reportId, rep.filters).subscribe(res => {
      if (res.status) {
        this.userTab_.reportUrl[rndx].isChartLoaded = true;
        // swal('', 'Filter Updated Successfully', 'success');

        swal({
          position: 'center',
          type: 'success',
          title: '',
          titleText: 'Filter Updated Successfully',
          showConfirmButton: false,
          timer: 1000
        });


        this.makeCallToFetchReportData(report_, rndx);
        const elm = document.getElementById('chart-report-' + rndx);
        elm.click();
      } else {
        this.userTab_.reportUrl[rndx].isChartLoaded = true;
      }
    }
      , err => {

      });
  }

  public validateRouteParam() {
    const routeParamTabId = this.route.snapshot.params['tabId'];
    const reg = new RegExp('^[0-9]*$');
    if (routeParamTabId && (routeParamTabId != '' || routeParamTabId != undefined) && reg.test(routeParamTabId)) {
      // recoveryTkn available
      this.selectedTabId = parseInt(routeParamTabId);
      let isTabExistTemp: Boolean = false;
      for (let i = 0; ((i < this.usrAllTabs.length) && (!isTabExistTemp)); i++) {
        if (this.usrAllTabs[i].id == this.selectedTabId) {
          isTabExistTemp = true;
          this.selectedTabName = this.usrAllTabs[i].name;
          this.userTab_ = this.usrAllTabs[i];

          this.userTab_.reportUrl = this.sharedServices_.sortTabReportsByColSpan(this.userTab_.reportUrl);

        }
      }
      if (isTabExistTemp) {
        this.fetchReportsData();
        // this.fatchReportsdata();
        this.fetchReportSummaryData();
      } else {
        // Invalid Report ID ......need to Redirect it to 404 PAGE
        return this.router.navigate([this.urlHome]);
      }
    } else {
      this.router.navigate(['/403']);
    }
  }

  public fetchReportSummaryData() {
    for (let i = 0; i < this.userTab_.summarReportUrl.length; i++) {
      this.makeCallFetchSummaryData(this.userTab_.summarReportUrl[i], i);
    }

  }

  public makeCallFetchSummaryData(obj: TabSummary, index) {
    this.userTab_.summarReportUrl[index].isSummaryLoaded = false;
    const urlToCall_ = this.userTab_.summarReportUrl[index].url;
    this.reportService_.getSummaryDataByURL(urlToCall_, index,
      this.userTab_.summarReportUrl[index].summaryReportId,
      this.globalFilterModal).subscribe(res => {
        if (res.status) {
          this.userTab_.summarReportUrl[index].summaryData = res.data;
          this.userTab_.summarReportUrl[index].isSummaryLoaded = true;
          this.userTab_.summarReportUrl[index].ticketsUrl = res.ticketsUrl;
        }
      }, err => {

      });
  }

  public fetchReportsData() {
    for (let i = 0; i < this.userTab_.reportUrl.length; i++) {
      this.makeCallToFetchReportData(this.userTab_.reportUrl[i], i);
    }
  }

  // public fatchReportsdata() {
  //   for (let i = 0; i < this.userTab_.reportUrl.length; i++) {
  //     this.makeCallToFetchReportData(this.userTab_.reportUrl[i], i);
  //   }
  // }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  loadPanelButtons(report: Report) {
    return report.isMultilevelDrill ? ['back', 'expand', 'reload', 'collapse', 'remove'] : ['expand', 'reload', 'collapse', 'remove'];
  }

  public makeCallToFetchReportData(obj: Report, index) {
    this.userTab_.reportUrl[index].isChartLoaded = false;
    const urlToCall_ = this.userTab_.reportUrl[index].url;
    this.reportService_.getReportChartDataByURL(urlToCall_, index,
      this.userTab_.reportUrl[index].reportId, this.selectedTimeRange,
      this.globalFilterModal).subscribe(res => {
        if (res['status'] == true) {
          this.userTab_.reportUrl[index].filters = res.data.filters ?
            this.bindReportFilters(res.data.filters, this.userTab_.reportUrl[index]) :
            [];
          const keySort_ = res.data.charts.config['sortKey'];
          res.data.charts.data = (keySort_.trim() == '') ?
            res.data.charts.data : this.sharedServices_.chartDataSortByKey(res.data.charts.data, keySort_);
          this.userTab_.reportUrl[index].chartData = res.data.charts;
          this.userTab_.reportUrl[index].chartData.drill = res.data.drill;
          this.userTab_.reportUrl[index].chartData.reportDataInfo = res.reportDataInfo;
          this.userTab_.reportUrl[index].isMultilevelDrill = false;
          this.userTab_.reportUrl[index].isChartLoaded = true;
          this.userTab_.reportUrl = this.sharedServices_.sortTabReportsByColSpan(this.userTab_.reportUrl);
        }
      }, err => {
        // TODO : log error here or send mail
        this.userTab_.reportUrl[index].isChartLoaded = false;
      });
  }
  open(content, size) {
    this.TootTipStr_.open = false;
    this.modalReferenceAddReport = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
    this.modalReferenceAddReport.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  changeTheme(type) {
    this.themeName = type;
    document.getElementById('themeStyle').setAttribute('href', 'assets/css/' + type + '/style.min.css');
    document.getElementById('themeResponsibe').setAttribute('href', 'assets/css/' + type + '/style-responsive.min.css');
    document.getElementById('themeColor').setAttribute('href', 'assets/css/' + type + '/theme/default.css');
  }

  changeColor(type) {
    document.getElementById('themeColor').setAttribute('href', 'assets/css/' + this.themeName + '/theme/' + type + '.css');
  }


  public onCategorySelect(categoryId, num) {
    // console.log(':::', categoryId)
    // console.log(this.modAddScheduleReports_.selCategory)
    if (num === 1) {
      this.modAddReports_.selReport = '';
      this.modAddReports_.selChartType = '';
      this.modAddReports_.reports = [];
      this.modAddReports_.charts = [];
    } else if (num === 2) {
      this.modAddScheduleReports_.selReport = '';
      this.modAddScheduleReports_.reports = [];
    } else if (num === 3) {
      this.modDownloadReport_.selReport = '';
      this.modDownloadReport_.reports = [];
    }
    if (categoryId && categoryId != '') {
      this.loadCategoryReports(categoryId, num);
    }
  }

  public onSummaryCategorySelect(categoryId) {
    this.modAddSummary_.selSummaryReport = '';
    this.modAddSummary_.summaryReport = [];

    if (categoryId && categoryId != '') {
      this.loadSummaryCategoryReports(categoryId);
    }
  }

  public onReportSelect(reportId) {
    this.modAddReports_.selChartType = '';
    this.modAddReports_.charts = [];
    if (reportId && reportId != '') {
      this.loadReportCharts(reportId);
    }

  }

  public onChartSelect(obj) {

  }

  loadReportCharts(reportId) {
    this.reportService_.fetchReportChart(reportId).subscribe(res => {
      if (res.status) {
        this.modAddReports_.charts = res.data.chart;
        this.modAddReports_.colspan = this.modAddReports_.colspan_defaults;
        // res.data.colspan.length > 0 ? res.data.colspan : this.modAddReports_.colspan_defaults;
      }
    }, err => {

    });
  }


  validateAddReportTab() {
    if (('' + this.modAddReports_.selCategory).trim() == '') {
      swal('Please Select Report Category ', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selReport).trim() == '') {
      swal('Please Select Report ', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selChartType).trim() == '') {
      swal('Please Select Chart Type ', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selCoumnSpan).trim() == '') {
      swal('Please Select Column Span ', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selReportName).trim() == '') {
      swal('Please Fill Report Name', '', 'warning');
      return false;
    } if (this.userTab_.reportUrl.length >= 6) {
      swal('Maximum 6 Reports Can be Added ,To Add More Add New Widget ', '', 'warning');
      return false;
    }
    return true;
  }

  validateAddScheduleReportTab() {
    this.modAddScheduleReports_.seldateRange['selstartDate'] = this.selecteddaterange.timestamp_start;
    this.modAddScheduleReports_.seldateRange['selendDate'] = this.selecteddaterange.timestamp_end;
    // this.modAddScheduleReports_.selScheduleTime['selHH'] = this.selectedTimeRange;
    // this.modAddScheduleReports_.selScheduleTime['selMM'] = this.selectedTimeRange;
    // this.modAddScheduleReports_.selScheduleTime['selAM_PM'] = this.selectedTimeRange;

    // this.modAddScheduleReports_.selHH = this.selectedTimeRange;
    // this.modAddScheduleReports_.selMM = this.selectedTimeRange;
    // this.modAddScheduleReports_.selAM/PM = this.selectedTimeRange;
    if (('' + this.modAddScheduleReports_.selCategory).trim() == '') {
      swal('Please Select Report Category ', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selReport).trim() == '') {
      swal('Please Select Report ', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selscheduleReportName).trim() == '') {
      swal('Please Select Schedule Report Name ', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.seldateRange).trim() == '') {
      swal('Please Select Date Range ', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selFormat).trim() == '') {
      swal('Please Fill Format', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selScheduleTime).trim() == '') {
      swal('Please Fill ScheduleTime', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selemail).trim() == '') {
      swal('Please Fill email', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selscheduleDate).trim() == '') {
      swal('Please Fill scheduleDate', '', 'warning');
      return false;
    } else if (('' + this.modAddScheduleReports_.selIsRecurring).trim() == '') {
      swal('Please Fill IsRecurring', '', 'warning');
      return false;
    }
    return true;
  }
  validateDownloadReportTab() {
    this.modDownloadReport_.seldateRange['selstartDate'] = this.selecteddaterange.timestamp_start;
    this.modDownloadReport_.seldateRange['selendDate'] = this.selecteddaterange.timestamp_end;
    // console.log(this.modDownloadReport_);
    if (('' + this.modDownloadReport_.selCategory).trim() == '') {
      swal('Please Select Report Category ', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.selReport).trim() == '') {
      swal('Please Select Report ', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.selscheduleReportName).trim() == '') {
      swal('Please Select Schedule Report Name ', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.seldateRange).trim() == '') {
      swal('Please Select Date Range ', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.selFormat).trim() == '') {
      swal('Please Fill Format', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.selScheduleTime).trim() == '') {
      swal('Please Fill Format', '', 'warning');
      return false;
    } else if (('' + this.modDownloadReport_.selIsRecurring).trim() == '') {
      swal('Please Fill Format', '', 'warning');
      return false;
    }
    return true;
  }
  addReportToTab() {
    if (this.validateAddReportTab()) {
      this.modalReferenceAddReport.close();
      const objAddReport_ = {
        'chartId': this.modAddReports_.selChartType,
        'masterReportId': this.modAddReports_.selReport,
        'tabId': this.selectedTabId,
        'reportName': this.modAddReports_.selReportName,
        'colSpan': this.modAddReports_.selCoumnSpan
      };
      this.reportService_.addReportToTab(objAddReport_).subscribe(res => {
        if (res.status) {
          swal({
            position: 'center',
            type: 'success',
            title: this.modAddReports_.selReportName,
            titleText: 'Report Added Successfully',
            showConfirmButton: false,
            timer: 1000
          });

          const report_: Report = new Report(res.data);
          this.userTab_.reportUrl[this.userTab_.reportUrl.length] = report_;
          this.makeCallToFetchReportData(report_, (this.userTab_.reportUrl.length - 1));
          this.clearModalAddReports();
          this.reportService_.notifyTabChangesToServices(this.userTab_.id, this.userTab_.reportUrl);
        }

      }, err => {

      });
    }
  }
  addScheduleReportToTab() {
    if (this.validateAddScheduleReportTab()) {
      // this.modalReferenceAddScheduleReport.close();
      const objAddScheduleReport_ = {
        'masterReportId': this.modAddScheduleReports_.selReport,
        'categoryId': this.modAddScheduleReports_.selCategory,
        'scheduleReportName': this.modAddScheduleReports_.selscheduleReportName,
        'format': this.modAddScheduleReports_.selFormat,
        'scheduleTime': this.modAddScheduleReports_['selHH'] + ':' + this.modAddScheduleReports_['selMM'] + ' ' + this.modAddScheduleReports_['selAMPM'],
        'isReoccurring': this.modAddScheduleReports_.selIsRecurring,
        'email': this.modAddScheduleReports_.selemail,
        'scheduleDate': this.modAddScheduleReports_['selscheduleDate'],
        'startDate': this.modAddScheduleReports_.seldateRange['selstartDate'],
        'endDate': this.modAddScheduleReports_.seldateRange['selendDate'],
      };

      this.reportService_.addScheduleReportToTab(objAddScheduleReport_).subscribe(res => {
        if (res.status) {
          swal({
            position: 'center',
            type: 'success',
            title: this.modAddScheduleReports_.selscheduleReportName,
            titleText: 'Schedule Report Added Successfully',
            showConfirmButton: false,
            timer: 1000
          });
          this.loadScheduleReport()
        }

      }, err => {

      });
    }
  }

  updateScheduleReport(data: any) {
    // console.log(data);
    const newscheduleTime = data.scheduleTime.split(':', 3);
    // console.log(newscheduleTime);
    this.modAddScheduleReports_.selReport = data.masterReports.id;
    this.modAddScheduleReports_.selCategory = data.category.id;
    this.modAddScheduleReports_.selscheduleReportName = data.scheduleName;
    this.modAddScheduleReports_.selFormat = data.format;
    this.modAddScheduleReports_['selHH'] = newscheduleTime[0];
    this.modAddScheduleReports_['selMM'] = newscheduleTime[1];
    this.modAddScheduleReports_['selAMPM'] = newscheduleTime[2];
    this.modAddScheduleReports_.isReoccurring = data.selIsRecurring;
    this.modAddScheduleReports_.selemail = data.email;
    this.modAddScheduleReports_['selscheduleDate'] = data.scheduleDate;
    this.modAddScheduleReports_.seldateRange['selstartDate'] = data.startDate;
    this.modAddScheduleReports_.seldateRange['selendDate'] = data.endDate;
    // console.log(this.modAddScheduleReports_);

  }

  updateScheduleReportTab() {

    const objUpdateScheduleReport_ = {
      'masterReportId': this.modAddScheduleReports_.selReport,
      'categoryId': this.modAddScheduleReports_.selCategory,
      'scheduleReportName': this.modAddScheduleReports_.selscheduleReportName,
      'format': this.modAddScheduleReports_.selFormat,
      'scheduleTime': this.modAddScheduleReports_['selHH'] + ':' + this.modAddScheduleReports_['selMM'] + ' ' + this.modAddScheduleReports_['selAMPM'],
      'isReoccurring': this.modAddScheduleReports_.isReoccurring,
      'email': this.modAddScheduleReports_.selemail,
      'scheduleDate': this.modAddScheduleReports_['selscheduleDate'],
      'startDate': this.modAddScheduleReports_.seldateRange['selstartDate'],
      'endDate': this.modAddScheduleReports_.seldateRange['selendDate'],
    };
    this.reportService_.UpdateScheduleReport(objUpdateScheduleReport_).subscribe(res => {
      if (res.status) {
        swal({
          position: 'center',
          type: 'success',
          title: this.modAddScheduleReports_.selscheduleReportName,
          titleText: 'Schedule Report Updated Successfully',
          showConfirmButton: false,
          timer: 1000
        });
        this.loadScheduleReport()
      }

    }, err => {

    });
  }

  deleteScheduleReport(data) {

  }
  DownloadReport() {
    if (this.validateAddScheduleReportTab()) {
      // this.modalReferenceAddScheduleReport.close();
      /* const objDownloadReport_ = {
        'masterReportId': this.modDownloadReport_.selReport,
        'categoryId': this.modDownloadReport_.selCategory,
        'scheduleReportName': this.modDownloadReport_.selscheduleReportName,
        'format': this.modDownloadReport_.selFormat,
        'scheduleTime': this.modDownloadReport_.selScheduleTime,
        'isReoccurring': this.modDownloadReport_.isReoccurring,
        // 'seldateRange': this.modAddScheduleReports_.seldateRange
        'startDate': this.modDownloadReport_.seldateRange['selstartDate'],
        'endDate': this.modDownloadReport_.seldateRange['selendDate'],
      }; */
      // const objAddScheduleReport_ = {
      //   'scheduleReportName': this.modAddScheduleReports_.selscheduleReportName,
      //   'masterReportId': this.modAddScheduleReports_.selReport,
      //   'categoryId': this.modAddScheduleReports_.selCategory,
      //   'format': this.modAddScheduleReports_.selFormat,
      //   'scheduleTime': this.modAddScheduleReports_.selScheduleTime,
      //   'isReoccurring': this.modAddScheduleReports_.isReoccurring,
      //   // 'seldateRange': this.modAddScheduleReports_.seldateRange
      //   'startDate': this.modAddScheduleReports_.seldateRange['selstartDate'],
      //   'endDate': this.modAddScheduleReports_.seldateRange['selendDate'],
      // };
      // alert('before download....');
      // this.reportService_.DownloadReport(objAddScheduleReport_).subscribe((res:Blob) => {
      //   alert('Hi.....');
      // window.open('http://172.27.63.61:8089/get_downloadReport?startDate=1576101600000&endDate=1577311200000', '_blank');
      // var downloadURL = URL.createObjectURL(res);
      //    window.open(downloadURL);
      //   // window.open(res, '_blank');
      //   // if (res.status) {
      //   //   swal({
      //   //     position: 'center',
      //   //     type: 'success',
      //   //     title: this.modDownloadReport_.selscheduleReportName,
      //   //     titleText: 'Schedule Report Download Successfully',
      //   //     showConfirmButton: false,
      //   //     timer: 1000
      //   //   });
      //   // }

      // }, err => {

      // });

    }
  }


  validateAddSummaryTab() {
    if (('' + this.modAddSummary_.selSummaryCategory).trim() == '') {
      swal('Please Select Summary Category ', '', 'warning');
      return false;
    } else if (('' + this.modAddSummary_.selSummaryReport).trim() == '') {
      swal('Please Select Summary Report', '', 'warning');
      return false;
    }
    return true;
  }

  addSummaryToTab() {
    if (this.validateAddSummaryTab()) {
      this.summaryCollapsed = false;
      this.modalReferenceAddReport.close();
      const objAddReport_ = {
        'reportName': this.modAddSummary_.selSummaryName,
        'masterSummaryReportId': this.modAddSummary_.selSummaryReport,
        'tabId': this.selectedTabId
      };
      this.reportService_.addSummaryToTab(objAddReport_).subscribe(res => {
        if (res.status) {
          const _resData = res.data;
          swal({
            position: 'center',
            type: 'success',
            title: this.modAddSummary_.selSummaryName,
            titleText: 'Summary Added Successfully',
            showConfirmButton: false,
            timer: 1000
          });
          const summary: TabSummary = new TabSummary(_resData);
          this.userTab_.summarReportUrl[this.userTab_.summarReportUrl.length] = summary;
          this.makeCallFetchSummaryData(summary, (this.userTab_.summarReportUrl.length - 1));
        }
      }, err => {
      });
      this.clearModalAddSummary();
    }
  }

  loadCategoryReports(categoryId, num) {
    this.reportService_.fetchCategoryReports(categoryId).subscribe(res => {
      if (res.status) {
        if (num === 1)
          this.modAddReports_.reports = res.data;
        else if (num === 2)
          this.modAddScheduleReports_.reports = res.data;
        else if (num === 3)
          this.modDownloadReport_.reports = res.data;
      }
    }, err => {

    });
  }

  loadSummaryCategoryReports(categoryId) {
    this.reportService_.fetchSummaryCategoryReports(categoryId).subscribe(res => {
      if (res.status) {
        this.modAddSummary_.summaryReport = res.data;
      }
    }, err => {

    });
  }

  loadCategories() {
    this.reportService_.fetchCategories().subscribe(res => {
      if (res.status) {
        this.modAddReports_.categories = res.data;
        this.modAddSummary_.summaryCategory = res.data;
        this.modAddScheduleReports_.categories = res.data;
        this.modDownloadReport_.categories = res.data;
      }
    }, err => {

    });
  }


  loadScheduleReport() {
    this.reportService_.fetchScheduleReport().subscribe(res => {
      if (res['status'] == true) {
        const data = res.status ? res.data : [];
        data.map(fil => {
          fil['value'] = false;
        });
        this.globalFilterModal.ScheduleReport = data;
      }
    }, err => {

    });
  }

  /**
   * This f/n will disallow right click default tooltip bar of browser.
   *
   */
  onContextMenu(event) {
    return false;
  }

  /**
   * Detect Click OutSide Menu Bar
   */
  detectClickOutSideMenuBar(event) { }


  /**
     * Print Angular Document With Dynamic Content
     */
  public printPanelChart() {
    let printContents, popupWin;
    printContents = document.getElementById('printDrill').innerHTML;
    popupWin = window.open('', '_blank', 'top=10px,left=10px,height=500px,width=500px');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Analytics</title>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    window.setTimeout(function () {
      popupWin.document.close();
    });
  }

  onTootlTipSelect(obj, reportId, reportSequence) {
    const urlTocall = obj.url;
    const drillDownId = obj.id;
    const chartType = obj.chartName;
    const mlReportName = obj.name;
    const reportIdObj = obj.reportId;
    this.TootTipStr_.open = !this.TootTipStr_.open;
    this.userTab_.reportUrl[reportSequence].isChartLoaded = false;
    this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = false;
    this.userTab_.reportUrl[reportSequence].isMultilevelDrill = false;
    this.reportService_.loadDrillDownCharts(urlTocall, drillDownId, reportIdObj,
      this.TootTipStr_.clickedData, this.selectedTimeRange,
      this.globalFilterModal).subscribe(res => {
        if (res.status) {
          const keySort_ = res.data.charts.config['sortKey'];
          res.data.charts.data = this.sharedServices_.sortByKey(res.data.charts.data, keySort_);
          this.userTab_.reportUrl[reportSequence].mlChartData.chartData = res.data.charts;
          this.userTab_.reportUrl[reportSequence].mlChartData.drill = res.data.drill;
          this.userTab_.reportUrl[reportSequence].mlChartData.chartType = chartType;
          this.userTab_.reportUrl[reportSequence].mlChartData.name = mlReportName;

          if ((this.TootTipStr_.clickedData.length > 0)) {
            this.TootTipStr_.clickedData.forEach(element => {
              Object.keys(element).forEach(elm => {
                this.userTab_.reportUrl[reportSequence].mlChartData.lastDrillFilterValue = element[elm];
              });
            });
          }
          this.userTab_.reportUrl[reportSequence].mlChartData.drillDownId = drillDownId;

          if (res.reportDataInfo) {
            this.userTab_.reportUrl[reportSequence].mlChartData.reportDataInfo = res.reportDataInfo;
          }
          this.userTab_.reportUrl[reportSequence].isMultilevelDrill = true;
          this.userTab_.reportUrl[reportSequence].isChartLoaded = true;
          this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = true;
        }
      }, err => {

      });

  }



  /**
   *
   * @param event
   * will get all panel events
   */
  getPanelEvent(event) {
    this.TootTipStr_.open = false; // make tooltip hide on every panel event
    if (event.eventType === 'close') {
      this.removeReportFromTab(event.modifiedObj.report, event.modifiedObj.index);
    } else if (event.eventType === 'reload') {
      this.userTab_.reportUrl[event.modifiedObj.index].isMultiLevelChartLoaded = false;
      this.userTab_.reportUrl[event.modifiedObj.index].isMultilevelDrill = false;
      this.makeCallToFetchReportData(this.userTab_.reportUrl[event.modifiedObj.index], event.modifiedObj.index);
    } else if (event.eventType === 'print') {
      const reportNdx_ = event.modifiedObj.index;
      const isMultilevelDrill = event.modifiedObj.isMultilevelDrill;
      const chart_select_id = isMultilevelDrill ? 'widgetChartMLDD-' + reportNdx_ : 'widgetChart-' + reportNdx_;
      let printContents, popupWin;
      printContents = document.getElementById(chart_select_id).innerHTML;
      popupWin = window.open('', '_blank', 'top=10px,left=10px,height=500px,width=500px');
      popupWin.document.open();
      popupWin.document.write(`
       <html>
         <head>
           <title>Analytics</title>
         </head>
     <body onload="window.print();window.close()">${printContents}</body>
       </html>`
      );
      window.setTimeout(function () {
        popupWin.document.close();
      });
    } else if (event.eventType == 'back') {
      this.onChartBackNavigate(event.modifiedObj.report, event.modifiedObj.index);
    }
  }

  onChartBackNavigate(repObj: any, rNdx: number) {
    this.reportService_.loadPreviousReport(this.userTab_.reportUrl[rNdx].reportId).subscribe(resPN => {
      if (resPN.status) {
        if (resPN.data.id == 0) {
          this.userTab_.reportUrl[rNdx].isMultiLevelChartLoaded = false;
          this.userTab_.reportUrl[rNdx].isMultilevelDrill = false;
        } else {
          const urlTocall = resPN.data.url;
          const drillDownId = resPN.data.id;
          const reportIdObj = resPN.data.reportId;
          const reportSequence = rNdx;
          const chartType = resPN.data.chartName;
          const reportName = resPN.data.name;

          this.userTab_.reportUrl[rNdx].isChartLoaded = false;
          this.userTab_.reportUrl[rNdx].isMultiLevelChartLoaded = false;
          this.userTab_.reportUrl[rNdx].isMultilevelDrill = false;

          this.reportService_.loadDrillDownChartsBackNavigate(urlTocall, drillDownId, reportIdObj,
            this.selectedTimeRange, this.globalFilterModal).subscribe(res => {
              if (res.status) {
                const keySort_ = res.data.charts.config['sortKey'];
                res.data.charts.data = this.sortByKey(res.data.charts.data, keySort_);

                /**
               *  Ranjit made changes on 09-05-2019 start
               *  Sort by Date
               */

                // if (JSON.stringify(Object.keys(res.data.charts.data[0])[0]) == 'date') {
                //   res.data.charts.data.sort(function (a: any, b: any) {
                //     const dateA: any = new Date(a.nextFilter);
                //     const dateB: any = new Date(b.nextFilter);
                //     return dateA - dateB;
                //   });
                // } else {
                //   res.data.charts.data.sort((a: any, b: any) =>
                //   (a.nextFilter > b.nextFilter) ? 1 : ((b.nextFilter > a.nextFilter) ? -1 : 0));
                // }


                /**
                 * Sort by Date
                 *  Ranjit made changes on 09-05-2019 start End
                 */

                this.userTab_.reportUrl[reportSequence].mlChartData.chartData = res.data.charts;
                this.userTab_.reportUrl[reportSequence].mlChartData.drill = res.data.drill;
                this.userTab_.reportUrl[reportSequence].mlChartData.chartType = chartType;
                this.userTab_.reportUrl[reportSequence].mlChartData.name = reportName;
                this.userTab_.reportUrl[reportSequence].mlChartData.drillDownId = drillDownId;

                if (res.reportDataInfo) {
                  this.userTab_.reportUrl[reportSequence].mlChartData.reportDataInfo = res.reportDataInfo;
                }
                this.userTab_.reportUrl[reportSequence].isMultilevelDrill = true;
                this.userTab_.reportUrl[reportSequence].isChartLoaded = true;
                this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = true;
              }
            }, err => {

            });
        }


      }
    }, err => {

    });
  }

  public removeReportFromTab(reportObj: Report, reportIndex_: number) {
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      if (result.value) {
        this.reportService_.deleteExstingReport(reportObj.reportId).subscribe(res => {
          this.userTab_.reportUrl.splice(reportIndex_, 1);
          // swal('' + reportObj.name, 'Report Removed Successfully', 'success');

          swal({
            position: 'center',
            type: 'success',
            title: '' + reportObj.name,
            titleText: 'Report Removed Successfully',
            showConfirmButton: false,
            timer: 1000
          });

          this.userTab_.reportUrl = this.sharedServices_.sortTabReportsByColSpan(this.userTab_.reportUrl);
          this.reportService_.notifyTabChangesToServices(this.userTab_.id, this.userTab_.reportUrl);
        }, err => {
          swal('', 'Oops ! Got Error While Removing Reports', 'error');
        });
      }
      if (result.dismiss) {
        // user Refused Changes .......
      }
    }, err => {
    });

  }

  public removeSummaryFromtab(summaryObj: TabSummary, summaryIndex: number) {
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      if (result.value) {
        this.reportService_.deleteExstingSummary(summaryObj.summaryReportId).subscribe(res => {
          this.userTab_.summarReportUrl.splice(summaryIndex, 1);
          // swal('' + summaryObj.name, 'Summary Removed Successfully', 'success');

          swal({
            position: 'center',
            type: 'success',
            title: '' + summaryObj.name,
            titleText: 'Summary Removed Successfully',
            showConfirmButton: false,
            timer: 1000
          });


        }, err => {
          swal('', 'Oops ! Got Error While Removing Summary', 'error');
        });
      }
      if (result.dismiss) {
        // user Refused Changes .......
      }
    }, err => {
    });
  }

  public openAddSummaryTab(elementRef: ElementRef, size: string) {
    if (this.userTab_.summarReportUrl.length >= 4) {
      swal('Can\'t Add More Summary', 'Maximum 4 Summary Can be Added', 'warning');
    } else {
      this.open(elementRef, size);
    }
  }

  getChartDataWidth(data) {
    const size_ = '' + (100 / ((data.length) + 1)) + '%';
    return size_;
  }

  loadGFCustomers() {
    this.reportService_.fetchGFCustomers().subscribe(res => {
      const data = res.status ? res.data : [];
      data.map(fil => {
        fil['value'] = false;
      });
      this.globalFilterModal.customers = data;
    }, err => {

    });
  }


  // trackElement(index: number, element: any) {
  //   return element ? element.guid : null;
  // }

  getChecked(value) {
    return value;
  }

  formateData(header, value) {
    if (header == 'Priority') {
      return value.split('-')[1];
    } else {
      return (value.length > 35) ? value.slice(0, 35) : value;
    }
  }

  getWidgetId(report: Report) {
    const filters = report.filters;
    const idTobeApp = ((filters && filters.length > 0) ? 'tab_w_33' : 'tab_w_33');
    return idTobeApp;
  }


  calenderChartClickNext(event) {
    // let reportId_ = event.reportId;
    const reportSequence_ = event.reportSequence;
    const monthTo_ = event.month;
    const yearTo_ = event.year;
    const report: Report = this.userTab_.reportUrl[reportSequence_];
    const filterValue = monthTo_ + '-' + yearTo_;
    this.updateCalendarChart(reportSequence_, filterValue);

  }


  updateCalendarChart(index, filterValue) {
    this.userTab_.reportUrl[index].isChartLoaded = false;
    const urlToCall_ = this.userTab_.reportUrl[index].url;
    this.reportService_.updateCalendarChartNavigation(urlToCall_,
      index, this.userTab_.reportUrl[index].reportId,
      this.selectedTimeRange, this.globalFilterModal, filterValue).subscribe(res => {
        if (res.status) {
          this.userTab_.reportUrl[index].filters = this.bindReportFilters(res.data.filters, this.userTab_.reportUrl[index]);
          const keySort_ = res.data.charts.config['sortKey'];
          res.data.charts.data = this.sortByKey(res.data.charts.data, keySort_);

          /**
           *  Ranjit made changes on 09-05-2019 start
           *  Sort by Date
           */
          if (res.data.charts.data.length > 0) {
            if (JSON.stringify(Object.keys(res.data.charts.data[0])[0]) == 'date') {
              res.data.charts.data.sort(function (a: any, b: any) {
                const dateA: any = new Date(a.nextFilter);
                const dateB: any = new Date(b.nextFilter);
                return dateA - dateB;
              });
            } else {
              res.data.charts.data.sort((a: any, b: any) => (a.nextFilter > b.nextFilter) ? 1 : ((b.nextFilter > a.nextFilter) ? -1 : 0));
            }
          }

          /**
           * Sort by Date
           *  Ranjit made changes on 09-05-2019 start End
           */

          this.userTab_.reportUrl[index].chartData = res.data.charts;
          this.userTab_.reportUrl[index].chartData.drill = res.data.drill;
          this.userTab_.reportUrl[index].chartData.reportDataInfo = res.reportDataInfo;
          this.userTab_.reportUrl[index].isMultilevelDrill = false;
          this.userTab_.reportUrl[index].isChartLoaded = true;
        }
      }, err => {

      });
  }

  calenderChartClickPrev(event) {
    // let reportId_ = event.reportId;
    const reportSequence_ = event.reportSequence;
    const monthTo_ = event.month;
    const yearTo_ = event.year;
    const filterValue = monthTo_ + '-' + yearTo_;
    this.updateCalendarChart(reportSequence_, filterValue);
  }

  downloadTicketDataAsCSV(dataRow: Array<any>, headers: Array<any>) {
    const row = headers; // header part
    const rows = [];
    for (let i = 0; i <= dataRow.length - 1; i++) {
      let arr = [];
      let datsSet = dataRow[i];
      for (let hdrs = 0; hdrs <= headers.length - 1; hdrs++) {
        let dInner = '' + datsSet[hdrs];
        let trimStr = dInner.indexOf(',') > -1 ? (dInner.replace(/,/g, '_')) : dInner;
        var desired = trimStr.replace(/[!@#$%^&*,']/gi, '');
        arr[hdrs] = (desired == '') ? ' N/A ' : desired;
      }
      rows.push(arr);
    }

    let csvContent = 'data:text/csv;charset=utf-8,';

    let testStr = '';
    csvContent += row + '\r\n';
    rows.forEach(function (rowArray) {
      testStr += ' ' + rowArray;
      const row_ = rowArray.join(',');
      csvContent += row_ + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Tickets.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
  }




  download(booking_id: number) {
    let formate_ = this.modAddScheduleReports_.selFormat;
    var masterReportId = this.modAddScheduleReports_.selReport;
    var categoryId = this.modAddScheduleReports_.selCategory;
    this.reportService_.downloadNoteReceipt(booking_id, formate_, masterReportId, categoryId).subscribe(res => {
      // console.log(res);
      var newBlob = new Blob([res], {
        type: formate_ == 'pdf' ?
          'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = (formate_ == 'pdf') ? 'Tickets.pdf' : 'Tickets.xlsx';
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);

    }, error => {
      // console.log(error);
    })
  }


  chartDataPartValues(value, chartConfig) {
    const graphBalloonFn = chartConfig['graphBalloonFn'] ? chartConfig['graphBalloonFn'] : '';
    if (graphBalloonFn.trim() !== '') {
      if (graphBalloonFn == 'convertYAxisCountToDays') {
        return this.convertCountToString(value, 'mn', 'sm');
      } else if (graphBalloonFn == 'convertYAxisCount_SecoundToDays') {
        return this.convertCountToString(value, 's', 'sm');
      }
      return value;
    } else {
      return value;
    }
  }

  // convertYAxisCountToDays(value): string {
  //   const units = {
  //     'Y': 24 * 60 * 365,
  //     'M': 24 * 60 * 30,
  //     'W': 24 * 60 * 7,
  //     'D': 24 * 60,
  //     'H': 1 * 60,
  //     'Mn': 1
  //   };
  //   const result = [];

  //   // tslint:disable-next-line: forin
  //   for (const name in units) {
  //     const p = Math.floor(value / units[name]);
  //     if (p === 1) { result.push(p + '' + name); }
  //     if (p >= 2) { result.push(p + '' + name); }
  //     value %= units[name];
  //   }

  //   let strTobeReturn = '';
  //   result.map(elm => {
  //     strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
  //   });
  //   return strTobeReturn;
  // }

  // Ramji made chnages on 31-03-2020 to convert sec to days 
  convertCountToString(value, valueUnit, aliasType): string {
    if (value == '0') {
      return '0';
    }

    if (isNaN(value)) {
      return value;
    }
    const units = {};
    const conv_ = this.validateValue(value, valueUnit);
    value = conv_.value;
    valueUnit = conv_.valueUnit;
    if (valueUnit == 'mn') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60;
      units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1;
    } else if (valueUnit == 'h') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 365;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 30;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 7;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1;
    } else if (valueUnit == 's') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60;
      units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60;
      units[aliasType == 'sm' ? 'Sec' : 'Seconds'] = 1;
    } else if (valueUnit == 'ms') {
      units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60 * 1000;
      units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60 * 1000;
      units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60 * 1000;
      units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60 * 1000;
      units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60 * 1000;
      units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60 * 1000;
      units[aliasType == 'sm' ? 's' : 'Seconds'] = 1 * 1000;
      units[aliasType == 'sm' ? 'ms' : 'Milli Seconds'] = 1;
    }
    const result = [];

    // tslint:disable-next-line: forin
    for (const name in units) {
      const p = Math.floor(value / units[name]);
      if (p === 1) { result.push(p + ' ' + name); }
      if (p >= 2) { result.push(p + ' ' + name); }
      value %= units[name];
    }

    let strTobeReturn = '';
    result.map(elm => {
      strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
    });
    return strTobeReturn;
  }

  validateValue(value, valueUnit) {
    if (valueUnit == 'h') {
      if (value > 0 && value < 1) {
        valueUnit = 'ms';
        value = (value * 60 * 60 * 1000);
        return { 'value': value, 'valueUnit': valueUnit };
      } else {
        valueUnit = 'mn';
        value = (value * 60);
        return { 'value': value, 'valueUnit': valueUnit };
      }
    } else if (valueUnit == 'mn') {
      if (value > 0 && value < 1) {
        valueUnit = 'ms';
        value = (value * 60 * 1000);
        return { 'value': value, 'valueUnit': valueUnit };
      }
    } else if (valueUnit == 's') {
      if (value > 0 && value < 1) {
        valueUnit = 'ms';
        value = (value * 1000);
        return { 'value': value, 'valueUnit': valueUnit };
      }
    }
    return { 'value': value, 'valueUnit': valueUnit };
  }

}
export interface Item {
  id: number;
  name: string;
}
