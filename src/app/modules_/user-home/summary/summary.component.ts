import { SharedServices } from 'src/app/shared_/shared.services';
import { UserTab, Report, Filter, TabSummary, FilterValue } from 'src/app/models_/tab';
import { ReportService } from 'src/app/services_/report.services';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from 'src/app/config/theme-settings';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { PerformanceService } from 'src/app/services_/performance.services';
import { AuthServices } from 'src/app/modules_/auth/auth.services';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { SummaryService } from 'src/app/services_/summary.services';

declare var moment: any;

@Component({
  selector: 'cats-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private performanceService_: PerformanceService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    // private reportService_: ReportService,
    private sharedServices_: SharedServices,
    private timeServices_: TimeFilterService,
    private authServices_: AuthServices,
    private summaryService: SummaryService
  ) {
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
    });

    // this.userTabSubscr_ = this.reportService_.getUserTabsSubscriber().subscribe(tabs => {
    //   this.usrAllTabs = tabs;
    // });

    // this.reportService_.getExistingTabs();
  }


  flagIsReportLoading = false;
  flagIsChartTypeLoading = false;
  flagIsColumnSpanLoading = false;
  currentDate: any;
  loggedUserName: any;
  showMainLoader: boolean = true;
  situation_data: any[] = [];
  technologyList: any;
  technologyWidgetData: any;
  summaryBlocks: any = [];

  dateFilter_timeType = 'td';
  dateFilter_startDate = moment().startOf('day');  // moment().subtract(1, 'hours');
  dateFilter_endDate = moment(); // moment();
  dateFillter_customRanges = [
    // 'Last 1 Hour',
    'Today',
    'Yesterday',
    'Last 7 Days ',
    'This Month ',
    'Last 3 Months ',
    'Last 6 Months ',
    'This Year '
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

  public summaryChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
  };
  print: boolean = false;

  @ViewChild('summaryTicketsData') summaryTicketsData;

  @ViewChild('modelDrillChartData') modelDrillChartData;
  @ViewChild('clickRightPopup') clickRightPopup;

  chartIdNameMap = { '1': 'line', '2': 'bar', '3': 'grid', '4': 'pie', '5': 'stack', '6': 'msbar', '7': 'area', '8': 'funnel', '9': 'msbar3d', '10': 'heat', '11': 'calendar', '12': 'msline' };

  closeResult: string;
  themeConf_;
  summaryCollapsed = true;

  heightPixel = 350;
  widthPer = 100;

  panelReload = false;

  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };
  public timeServicesSubsc$: Subscription;
  // public amChartsThemeSubscr$:Subscription;

  public amChartsTheme: string;

  globalFilterModal = {
    isListenOnBlur: false,
    isListenOnBlur_AssigneeGroup: false,
    identifier: 'global-customer-filter',
    identifier_AssigneeGroup: 'global-assigneegroup-filter',
    filtersToggle: false,
    customers: [],
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


    masterSelectedNMS: false,
    nms: [],
    editNMS: [],
    modifyNMS: [],

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
  public selectedTabName: String = '';
  public userTab_: UserTab;

  public reportChartDrillDataStr = {
    header: [],
    data: [],
    isPanelLoading: false,
    expand: false,
    hTitle: 'Report Data',
    url: ''
  };
  modalReferenceAddReport: any;


  visibleIndex = -1;

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

  /**
   * Ramji : 03-11-2020
   * @param event 
   */
  globalFilterClickOutSideNMS(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur = false;
    document.getElementById(identifir).click();
  }

  globalFilterClickOutSideASD(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlurASD = false;
    document.getElementById(identifir).click();
  }

  globalFilterClickOutSideNONASD(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlurNONASD = false;
    document.getElementById(identifir).click();
  }



  globalFilterClickOutSideAssigneeGroup(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur_AssigneeGroup = false;
    document.getElementById(identifir).click();
  }

  onGlobalFilterChange() {
    this.showMainLoader = true;
    this.TootTipStr_.open = false;
    setTimeout(() => {
      this.compareUserTabGlobalFilterModification();
    }, 1000);
  }

  updateUserTabFilters() {
    this.showMainLoader = true;
    this.getHeaders();
    // const routeParamTabId = this.route.snapshot.params['tabId'];
    // this.selectedTabId = parseInt(routeParamTabId);
    // this.reportService_.updateUserTabFilter(this.selectedTabId, this.globalFilterModal).subscribe(res => {
    //   if (res['status'] == true) {
    //     this.showMainLoader = false;
    //     // const userTabFilter: UserTabFilterVM = new UserTabFilterVM(res['data']);
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
    this.repDetail.timeType = this.performanceService_.timeMap[this.selectedTimeRange.timeType];
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
    if (this.userTabSubscr_) {
      this.userTabSubscr_.unsubscribe();
    }
  }


  ngAfterViewInit() {
    // $('.dropdown-submenu a.test').on("click", function(e){
    //   $(this).next('ul').toggle();
    //   e.stopPropagation();
    //   e.preventDefault();
    // });
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
    this.globalFilterModal.timeType = info.timeType.value;
  }


  /**
   * Ramji : 03-11-2020
   * @param event 
   * @param obj_ 
   */
  showDDNMS(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }



  showDDASD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlurASD'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }


  showDDASDTemp(event, obj_, targetId, targetListen) {
    setTimeout(function () {
      // const element_: Element = (event.target as Element);
      const elementDD: Element = document.getElementById(targetId); //element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_[targetListen] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }


  hideDDASDTemp(event, obj_, targetId, targetListen) {
    setTimeout(function () {
      // const element_: Element = (event.target as Element);
      const elementDD: Element = document.getElementById(targetId); //element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass;
      obj_[targetListen] = false;
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  showDDNONASD(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlurNONASD'] = (toggleClass.indexOf('show') > -1);
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


  ngOnInit() {
    this.getHeaders();
    this.themeConf_ = themeConf_;
    this.loadNMSList();
    this.loadTechnologyList();
    this.loadSummaryBlocks();
  }



  public loadNMSList() {
    this.showMainLoader = true;
    this.summaryService.getNMSList().subscribe(res => {
      if (res['status'] == true) {
        this.bindUserTabFilterData(res['data']);
        this.showMainLoader = false;
      }
    }, err => {

    });
  }

  public loadTechnologyList() {
    this.showMainLoader = true;
    this.summaryService.getTechnologyList().subscribe(resp => {
      if (resp.status) {
        this.technologyList = resp.data;
        this.loadTechnologyWidget();
      }
    });
  }

  public loadTechWidgetList() {

  }


  public loadTechnologyWidget() {
    this.summaryService.getTechnologyWidgetData().subscribe(resp => {
      if (resp.status) {
        this.technologyWidgetData = resp.data;
        this.technologyList.forEach((obj_, indx) => {
          this.technologyWidgetData[indx].name = obj_.name;
          this.technologyWidgetData[indx].id = obj_.id;
        });
        // console.log(JSON.stringify(this.technologyWidgetData));
      }
    });
  }

  public loadSummaryBlocks() {
    this.summaryService.getSummaryBlocksData().subscribe(resp => {
      if (resp.status) {
        this.summaryBlocks.push(resp.data);
      }
    });
  }
  public techWidgetBoxToggle(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
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

  // public getFilters(reportObj_: Report, index) {
  //   this.reportService_.getReportFilter(reportObj_.reportId).subscribe(res =>
  //     this.userTab_.reportUrl[index].filters = this.bindReportFilters(((res.status) ? res.data : []), this.userTab_.reportUrl[index]));
  // }

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



  // /**
  //  * @param report_ report object where filters applied
  //  * @param filter_ filter objects
  //  * @param rndx report index
  //  */
  // public submitFilter(report_: Report, filter_: Array<Filter>, rndx) {
  //   const rep: Report = this.compareFilterModification(report_);
  //   this.userTab_.reportUrl[rndx].isChartLoaded = false;
  //   this.reportService_.updateReportFilter(report_.reportId, rep.filters).subscribe(res => {
  //     if (res.status) {
  //       this.userTab_.reportUrl[rndx].isChartLoaded = true;
  //       // swal('', 'Filter Updated Successfully', 'success');

  //       swal({
  //         position: 'center',
  //         type: 'success',
  //         title: '',
  //         titleText: 'Filter Updated Successfully',
  //         showConfirmButton: false,
  //         timer: 1000
  //       });


  //       this.makeCallToFetchReportData(report_, rndx);
  //       const elm = document.getElementById('chart-report-' + rndx);
  //       elm.click();
  //     } else {
  //       this.userTab_.reportUrl[rndx].isChartLoaded = true;
  //     }
  //   }
  //     , err => {

  //     });
  // }

  public validateRouteParam() {
    // this.loadUserTabFilter();
  }

  public fetchReportSummaryData() {
    for (let i = 0; i < this.userTab_.summarReportUrl.length; i++) {
      // this.makeCallFetchSummaryData(this.userTab_.summarReportUrl[i], i);
    }
  }


  situationConains(name) {
    if (this.situation_data !== undefined) {
      for (var i = 0; i < this.situation_data.length; i++) {
        if (this.situation_data[i].tech === name) {
          return true;
        }
      }
    }
  }
  navigateToDevOps(name) {
    if (this.situationConains(name)) {
      this.router.navigateByUrl('dashboard/engineer-view/cloud-dev-ops');
    }
  }

  /**
   * Ramji : 03-11-2020
   *  This f/n will prepare global filter model object
   * @param obj  : filter object
   */
  bindUserTabFilterData(obj: any) {
    // if (obj['customers']) {
    //   const custSort_ = this.sharedServices_.sortByKey(obj['customers'], 'name');
    //   this.globalFilterModal.customers = this.deepClone(custSort_);
    //   this.globalFilterModal.editCustomers = this.deepClone(custSort_);
    //   this.globalFilterModal.modifyCustomer = this.deepClone(custSort_);
    // }
    // if (obj['asd']) {
    //   const asdSort_ = this.sharedServices_.sortByKey(obj['asd'], 'name');
    //   this.globalFilterModal.asd = this.deepClone(asdSort_);
    //   this.globalFilterModal.editAsd = this.deepClone(asdSort_);
    //   this.globalFilterModal.modifyAsd = this.deepClone(asdSort_);
    // }
    // if (obj['non_asd']) {
    //   const asdSort_ = this.sharedServices_.sortByKey(obj['non_asd'], 'name');
    //   this.globalFilterModal.nonAsd = this.deepClone(asdSort_);
    //   this.globalFilterModal.editNonASD = this.deepClone(asdSort_);
    //   this.globalFilterModal.modifyNonASD = this.deepClone(asdSort_);
    // }

    if (obj['nms']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['nms'], 'name');
      this.globalFilterModal.nms = this.deepClone(asdSort_);
      this.globalFilterModal.editNMS = this.deepClone(asdSort_);
      this.globalFilterModal.modifyNMS = this.deepClone(asdSort_);
    }
    this.globalFilterModal.timeType = obj['time_type'] ? obj['time_type'] : 'cu';

    // TODO : make hit to fetch all reports data.
    // this.fetchReportsData();
    // this.fetchReportSummaryData();
  }


  /**
   * This f/n will return an duplicate array
   * Deep Copy
   * @param oldArray
   */
  deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  // public makeCallFetchSummaryData(obj: TabSummary, index) {
  //   this.userTab_.summarReportUrl[index].isSummaryLoaded = false;
  //   const urlToCall_ = this.userTab_.summarReportUrl[index].url;
  //   this.reportService_.getSummaryDataByURL(urlToCall_, index,
  //     this.userTab_.summarReportUrl[index].summaryReportId,
  //     this.globalFilterModal).subscribe(res => {
  //       if (res.status) {
  //         const t_data = (typeof res.data == 'object') ? res['data']['all'] : res.data;
  //         this.userTab_.summarReportUrl[index].summaryData = t_data; // res.data;
  //         // this.userTab_.summarReportUrl[index].summaryData = res.data;
  //         this.userTab_.summarReportUrl[index].isSummaryLoaded = true;
  //         this.userTab_.summarReportUrl[index].ticketsUrl = res['ticketsUrl'] ? res['ticketsUrl'] : '';
  //       }
  //     }, err => {

  //     });
  // }

  public fetchReportsData() {
    for (let i = 0; i < this.userTab_.reportUrl.length; i++) {
      // this.makeCallToFetchReportData(this.userTab_.reportUrl[i], i);
    }

  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  loadPanelButtons(report: Report) {
    if (Object.keys(report.chartData).length > 0) {
      return report.isMultilevelDrill ? (report.chartData.data.length > 0 ? ['back', 'print', 'expand', 'reload', 'collapse', 'remove'] : ['back', 'expand', 'reload', 'collapse', 'remove']) : (report.chartData.data.length > 0 ? ['print', 'expand', 'reload', 'collapse', 'remove'] : ['expand', 'reload', 'collapse', 'remove']);
    } else {
      return report.isMultilevelDrill ? ['back', 'expand', 'reload', 'collapse', 'remove'] : ['expand', 'reload', 'collapse', 'remove'];
    }
    // return report.isMultilevelDrill ? ['back', 'print', 'expand', 'reload', 'collapse', 'remove'] : ['print', 'expand', 'reload', 'collapse', 'remove'];
  }

  // public makeCallToFetchReportData(obj: Report, index) {
  //   this.userTab_.reportUrl[index].isChartLoaded = false;
  //   const urlToCall_ = this.userTab_.reportUrl[index].url;
  //   this.reportService_.getReportChartDataByURL(urlToCall_, index,
  //     this.userTab_.reportUrl[index].reportId, this.selectedTimeRange,
  //     this.globalFilterModal).subscribe(res => {
  //       if (res.status) {
  //         this.userTab_.reportUrl[index].filters = this.bindReportFilters(res.data.filters, this.userTab_.reportUrl[index]);
  //         const keySort_ = res.data.charts.config['sortKey'];
  //         res.data.charts.data = this.sharedServices_.chartDataSortByKey(res.data.charts.data, keySort_);
  //         this.userTab_.reportUrl[index].chartData = res.data.charts;
  //         this.userTab_.reportUrl[index].chartData.drill = res.data.drill;
  //         this.userTab_.reportUrl[index].chartData.reportDataInfo = res.reportDataInfo;
  //         this.userTab_.reportUrl[index].isMultilevelDrill = false;
  //         this.userTab_.reportUrl[index].isChartLoaded = true;
  //         this.userTab_.reportUrl[index].repHeaders = ',Time Range: ' + this.performanceService_.timeMap[this.selectedTimeRange.timeType] + ',Start Date: ' + moment(new Date(this.selectedTimeRange.timestamp_start)).format("DD-MM-YYYY h:mm:ss") + ',End Date: ' + moment(new Date(this.selectedTimeRange.timestamp_end)).format("DD-MM-YYYY h:mm:ss");
  //         this.userTab_.reportUrl = this.sharedServices_.sortTabReportsByColSpan(this.userTab_.reportUrl);
  //       }
  //     }, err => {
  //       // TODO : log error here or send mail
  //     });
  // }
  open(content, size) {
    this.TootTipStr_.open = false;
    this.modalReferenceAddReport = this.modalService.open(content,
      { size: size ? size : 'lg', backdrop: 'static', windowClass: 'In2_huge_popup' });
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


  public onCategorySelect(categoryId) {
    this.modAddReports_.selReport = '';
    this.modAddReports_.selChartType = '';
    this.modAddReports_.reports = [];
    this.modAddReports_.charts = [];

    if (categoryId && categoryId != '') {
      // this.loadCategoryReports(categoryId);
    }
  }

  public onSummaryCategorySelect(categoryId) {
    this.modAddSummary_.selSummaryReport = '';
    this.modAddSummary_.summaryReport = [];

    if (categoryId && categoryId != '') {
      // this.loadSummaryCategoryReports(categoryId);
    }
  }



  public onReportSelect(reportId) {
    this.modAddReports_.selChartType = '';
    this.modAddReports_.charts = [];
    if (reportId && reportId != '') {
      // this.loadReportCharts(reportId);
    }

  }

  public onChartSelect(obj) {

  }

  // loadReportCharts(reportId) {
  //   this.flagIsChartTypeLoading = true;
  //   this.reportService_.fetchReportChart(reportId).subscribe(res => {
  //     if (res.status) {
  //       this.flagIsChartTypeLoading = false;
  //       this.modAddReports_.charts = res.data.chart;
  //       this.modAddReports_.colspan = this.modAddReports_.colspan_defaults;
  //       // res.data.colspan.length > 0 ? res.data.colspan : this.modAddReports_.colspan_defaults;
  //     }
  //   }, err => {

  //   });
  // }

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



  // addReportToTab() {
  //   if (this.validateAddReportTab()) {
  //     this.modalReferenceAddReport.close();
  //     const objAddReport_ = {
  //       'chartId': this.modAddReports_.selChartType,
  //       'masterReportId': this.modAddReports_.selReport,
  //       'tabId': this.selectedTabId,
  //       'reportName': this.modAddReports_.selReportName,
  //       'colSpan': this.modAddReports_.selCoumnSpan
  //     };
  //     this.reportService_.addReportToTab(objAddReport_).subscribe(res => {
  //       if (res.status) {
  //         swal({
  //           position: 'center',
  //           type: 'success',
  //           title: this.modAddReports_.selReportName,
  //           titleText: 'Report Added Successfully',
  //           showConfirmButton: false,
  //           timer: 1000
  //         });

  //         const report_: Report = new Report(res.data);
  //         this.userTab_.reportUrl[this.userTab_.reportUrl.length] = report_;
  //         this.makeCallToFetchReportData(report_, (this.userTab_.reportUrl.length - 1));
  //         this.clearModalAddReports();
  //         this.reportService_.notifyTabChangesToServices(this.userTab_.id, this.userTab_.reportUrl);
  //       }

  //     }, err => {

  //     });
  //   }
  // }

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

  // addSummaryToTab() {
  //   if (this.validateAddSummaryTab()) {
  //     this.summaryCollapsed = false;
  //     this.modalReferenceAddReport.close();
  //     const objAddReport_ = {
  //       'reportName': this.modAddSummary_.selSummaryName,
  //       'masterSummaryReportId': this.modAddSummary_.selSummaryReport,
  //       'tabId': this.selectedTabId
  //     };
  //     this.reportService_.addSummaryToTab(objAddReport_).subscribe(res => {
  //       if (res.status) {
  //         const _resData = res.data;
  //         swal({
  //           position: 'center',
  //           type: 'success',
  //           title: this.modAddSummary_.selSummaryName,
  //           titleText: 'Summary Added Successfully',
  //           showConfirmButton: false,
  //           timer: 1000
  //         });
  //         const summary: TabSummary = new TabSummary(_resData);
  //         this.userTab_.summarReportUrl[this.userTab_.summarReportUrl.length] = summary;
  //         this.makeCallFetchSummaryData(summary, (this.userTab_.summarReportUrl.length - 1));
  //       }
  //     }, err => {
  //     });
  //     this.clearModalAddSummary();
  //   }
  // }

  // loadCategoryReports(categoryId) {
  //   this.flagIsReportLoading = true;
  //   this.reportService_.fetchCategoryReports(categoryId).subscribe(res => {
  //     if (res.status) {
  //       this.flagIsReportLoading = false;
  //       this.modAddReports_.reports = res.data;
  //     }
  //   }, err => {

  //   });
  // }

  // loadSummaryCategoryReports(categoryId) {
  //   this.reportService_.fetchSummaryCategoryReports(categoryId).subscribe(res => {
  //     if (res.status) {
  //       this.modAddSummary_.summaryReport = res.data;
  //     }
  //   }, err => {

  //   });
  // }

  // loadCategories() {
  //   this.reportService_.fetchCategories().subscribe(res => {
  //     if (res.status) {
  //       this.modAddReports_.categories = res.data;
  //       this.modAddSummary_.summaryCategory = res.data;
  //     }
  //   }, err => {

  //   });
  // }


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
  // public printPanelChart(event) {
  //   this.currentDate = moment(new Date()).format("DD-MM-YYYY h:mm:ss");
  //   const reportNdx_ = event.modifiedObj.index;
  //   const isMultilevelDrill = event.modifiedObj.report.isMultilevelDrill;
  //   const reportTitle = event.modifiedObj.report.title;
  //   const mlChartDataTitle = event.modifiedObj.report.mlChartData.name;

  //   let tabfullwidth = false;
  //   const tabIndex = event.modifiedObj.index;
  //   if ($('.printChartTab' + tabIndex).hasClass('col-md-6')) {
  //     $('.printChartTab' + tabIndex).removeClass('col-md-6').addClass('col-md-12');
  //     tabfullwidth = true;
  //   };
  //   $('.amcharts-export-menu-top-right').hide();
  //   $('.chartDataTable').addClass('table-bordered');
  //   $('.chartDataTable').addClass('tablePrint');
  //   $('.amcharts-main-div').css("height", "auto");


  //   let h = screen.height;
  //   let w = screen.width;
  //   const printWindow = window.open('', '', "width=" + w + ", height=" + h + ", top=0, left=0");
  //   printWindow.document.write('<html><head><title>' + (isMultilevelDrill ? mlChartDataTitle : reportTitle) + '</title>');
  //   printWindow.document.write(
  //     '<link href="/assets/bootstrap.min.css" rel="stylesheet" />'
  //   );
  //   printWindow.document.write(
  //     '<link href="/assets/css/default/style.min.css" rel="stylesheet" />'
  //   );
  //   printWindow.document.write(
  //     '<link href="/assets/css/printstyle.css" rel="stylesheet" />'
  //   );

  //   // printWindow.document.write(
  //   //   '<body>'
  //   // );
  //   printWindow.document.write(
  //     '</head><body onload="window.print();window.close();" onunload="myFunction()"><table class="mainPrintTable"><thead><tr><td><div class="header-space">&nbsp;</div></td></tr></thead><tbody><tr><td><div class="printContent">'
  //   );


  //   // printWindow.document.write('<div id="contentprint">');
  //   let chartDataLength, reportChartType, chart_select_id;
  //   if (isMultilevelDrill) {
  //     chartDataLength = event.modifiedObj.report.mlChartData.chartData.data.length;
  //     reportChartType = event.modifiedObj.report.mlChartData.chartType;
  //     chart_select_id = 'widgetChartMLDD-' + reportNdx_;
  //   } else {
  //     chartDataLength = event.modifiedObj.report.chartData.data.length;
  //     reportChartType = event.modifiedObj.report.chartType;
  //     chart_select_id = 'widgetChart-' + reportNdx_;
  //   }
  //   // const chartDataLength = isMultilevelDrill ? event.modifiedObj.report.mlChartData.chartData.data.length : event.modifiedObj.report.chartData.data.length;
  //   // const reportChartType = isMultilevelDrill ? event.modifiedObj.report.mlChartData.chartType : event.modifiedObj.report.chartType;
  //   // const chart_select_id = isMultilevelDrill ? 'widgetChartMLDD-' + reportNdx_ : 'widgetChart-' + reportNdx_;
  //   // const chartReportName = event.modifiedObj.report.name;
  //   let ls = [];
  //   if (reportChartType != 'grid') {
  //     ls = ['printHeader' + reportNdx_, chart_select_id, "dataprint" + reportNdx_];
  //   } else {
  //     ls = ['printHeader' + reportNdx_, chart_select_id];
  //   }


  //   this.wait(2000).then((res) => {
  //     // printWindow.document.write(document.getElementById(ls[0]).innerHTML);
  //     // printWindow.document.write('<div class="row">');
  //     printWindow.document.write(document.getElementById(ls[0]).innerHTML);
  //     if (reportChartType != 'grid') {
  //       printWindow.document.write(document.getElementById(ls[1]).parentElement.innerHTML);
  //     } else {
  //       printWindow.document.write(document.getElementById(ls[1]).innerHTML);
  //     }


  //     printWindow.document.write('<br><br>');


  //     if (chartDataLength > 20) {
  //       printWindow.document.write('<p style="page-break-after: always;">&nbsp;</p><p style="page-break-before: always;">&nbsp;</p>');
  //     }

  //     if (reportChartType != 'grid') {
  //       printWindow.document.write(document.getElementById(ls[2]).innerHTML);
  //     }

  //     printWindow.document.write(
  //       '</div></td></tr></tbody><tfoot><tr><td><div class="footer-space">&nbsp;</div></td></tr></tfoot></table>'
  //     );

  //     printWindow.document.write(
  //       '<div id="pageHeader"><img  src="assets/images/liquid.png" alt="" /></div>'
  //     );
  //     printWindow.document.write(
  //       '<div id="pageFooter"><div class="row"><div class="col-lg-6 col-md-7">&copy;Copyrights &copy; 2019 & All Rights Reserved by Liquid Telecom </div><div class="col-lg-6 col-md-5"><span class="pull-right">Powered by CATS &trade; (In2IT Technologies PTY LTD) <img  src="assets/in2itlogo.png" alt=""/></span></div></div>'
  //     );

  //     printWindow.document.write('</body></html>');
  //     printWindow.document.close();
  //     this.print = false;

  //     $('.amcharts-main-div').css("height", "100%");
  //     if (tabfullwidth) {
  //       $('.printChartTab' + tabIndex).removeClass('col-md-12').addClass('col-md-6');
  //     };
  //     $('.chartDataTable').removeClass('table-bordered');
  //     $('.chartDataTable').removeClass('tablePrint');
  //     $('.amcharts-export-menu-top-right').show();

  //   });
  // }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  // public printPanelChart() {
  //   let printContents, popupWin;
  //   printContents = document.getElementById('printDrill').innerHTML;
  //   popupWin = window.open('', '_blank', 'top=10px,left=10px,height=500px,width=500px');
  //   popupWin.document.open();
  //   popupWin.document.write(`
  //     <html>
  //       <head>
  //         <title>Analytics</title>
  //       </head>
  //   <body onload="window.print();window.close()">${printContents}</body>
  //     </html>`
  //   );
  //   window.setTimeout(function () {
  //     popupWin.document.close();
  //   });
  // }

  // onTootlTipSelect(obj, reportId, reportSequence) {
  //   const urlTocall = obj.url;
  //   const drillDownId = obj.id;
  //   const chartType = obj.chartName;
  //   const mlReportName = obj.name;
  //   const reportIdObj = obj.reportId;
  //   this.TootTipStr_.open = !this.TootTipStr_.open;
  //   this.userTab_.reportUrl[reportSequence].isChartLoaded = false;
  //   this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = false;
  //   this.userTab_.reportUrl[reportSequence].isMultilevelDrill = false;
  //   this.reportService_.loadDrillDownCharts(urlTocall, drillDownId, reportIdObj,
  //     this.TootTipStr_.clickedData, this.selectedTimeRange,
  //     this.globalFilterModal).subscribe(res => {
  //       if (res.status) {
  //         const keySort_ = res.data.charts.config['sortKey'];
  //         res.data.charts.data = this.sharedServices_.sortByKey(res.data.charts.data, keySort_);
  //         this.userTab_.reportUrl[reportSequence].mlChartData.chartData = res.data.charts;
  //         this.userTab_.reportUrl[reportSequence].mlChartData.drill = res.data.drill;
  //         this.userTab_.reportUrl[reportSequence].mlChartData.chartType = chartType;
  //         this.userTab_.reportUrl[reportSequence].mlChartData.name = mlReportName;

  //         if ((this.TootTipStr_.clickedData.length > 0)) {
  //           this.TootTipStr_.clickedData.forEach(element => {
  //             Object.keys(element).forEach(elm => {
  //               this.userTab_.reportUrl[reportSequence].mlChartData.lastDrillFilterValue = element[elm];
  //             });
  //           });
  //         }
  //         this.userTab_.reportUrl[reportSequence].mlChartData.drillDownId = drillDownId;

  //         if (res.reportDataInfo) {
  //           this.userTab_.reportUrl[reportSequence].mlChartData.reportDataInfo = res.reportDataInfo;
  //         }
  //         this.userTab_.reportUrl[reportSequence].isMultilevelDrill = true;
  //         this.userTab_.reportUrl[reportSequence].isChartLoaded = true;
  //         this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = true;
  //       }
  //     }, err => {

  //     });

  // }



  // /**
  //  *
  //  * @param event
  //  * will get all panel events
  //  */
  // getPanelEvent(event) {
  //   this.TootTipStr_.open = false; // make tooltip hide on every panel event
  //   if (event.eventType === 'close') {
  //     this.removeReportFromTab(event.modifiedObj.report, event.modifiedObj.index);
  //   } else if (event.eventType === 'reload') {
  //     this.userTab_.reportUrl[event.modifiedObj.index].isMultiLevelChartLoaded = false;
  //     this.userTab_.reportUrl[event.modifiedObj.index].isMultilevelDrill = false;
  //     this.makeCallToFetchReportData(this.userTab_.reportUrl[event.modifiedObj.index], event.modifiedObj.index);
  //   } else if (event.eventType === 'print') {
  //     this.printPanelChart(event);
  //     //   const reportNdx_ = event.modifiedObj.index;
  //     //   const isMultilevelDrill = event.modifiedObj.isMultilevelDrill;
  //     //   const chart_select_id = isMultilevelDrill ? 'widgetChartMLDD-' + reportNdx_ : 'widgetChart-' + reportNdx_;
  //     //   let printContents, popupWin;
  //     //   printContents = document.getElementById(chart_select_id).innerHTML;
  //     //   popupWin = window.open('', '_blank', 'top=10px,left=10px,height=500px,width=500px');
  //     //   popupWin.document.open();
  //     //   popupWin.document.write(`
  //     //    <html>
  //     //      <head>
  //     //        <title>Analytics</title>
  //     //      </head>
  //     //  <body onload="window.print();window.close()">${printContents}</body>
  //     //    </html>`
  //     //   );
  //     //   window.setTimeout(function () {
  //     //     popupWin.document.close();
  //     //   });
  //   } else if (event.eventType == 'back') {
  //     this.onChartBackNavigate(event.modifiedObj.report, event.modifiedObj.index);
  //   }
  // }

  // onChartBackNavigate(repObj: any, rNdx: number) {
  //   this.reportService_.loadPreviousReport(this.userTab_.reportUrl[rNdx].reportId).subscribe(resPN => {
  //     if (resPN.status) {
  //       if (resPN.data.id == 0) {
  //         this.userTab_.reportUrl[rNdx].isMultiLevelChartLoaded = false;
  //         this.userTab_.reportUrl[rNdx].isMultilevelDrill = false;
  //       } else {
  //         const urlTocall = resPN.data.url;
  //         const drillDownId = resPN.data.id;
  //         const reportIdObj = resPN.data.reportId;
  //         const reportSequence = rNdx;
  //         const chartType = resPN.data.chartName;
  //         const reportName = resPN.data.name;

  //         this.userTab_.reportUrl[rNdx].isChartLoaded = false;
  //         this.userTab_.reportUrl[rNdx].isMultiLevelChartLoaded = false;
  //         this.userTab_.reportUrl[rNdx].isMultilevelDrill = false;

  //         this.reportService_.loadDrillDownChartsBackNavigate(urlTocall, drillDownId, reportIdObj,
  //           this.selectedTimeRange, this.globalFilterModal).subscribe(res => {
  //             if (res.status) {
  //               const keySort_ = res.data.charts.config['sortKey'];
  //               res.data.charts.data = this.sortByKey(res.data.charts.data, keySort_);

  //               /**
  //              *  Ranjit made changes on 09-05-2019 start
  //              *  Sort by Date
  //              */

  //               // if (JSON.stringify(Object.keys(res.data.charts.data[0])[0]) == 'date') {
  //               //   res.data.charts.data.sort(function (a: any, b: any) {
  //               //     const dateA: any = new Date(a.nextFilter);
  //               //     const dateB: any = new Date(b.nextFilter);
  //               //     return dateA - dateB;
  //               //   });
  //               // } else {
  //               //   res.data.charts.data.sort((a: any, b: any) =>
  //               //   (a.nextFilter > b.nextFilter) ? 1 : ((b.nextFilter > a.nextFilter) ? -1 : 0));
  //               // }


  //               /**
  //                * Sort by Date
  //                *  Ranjit made changes on 09-05-2019 start End
  //                */

  //               this.userTab_.reportUrl[reportSequence].mlChartData.chartData = res.data.charts;
  //               this.userTab_.reportUrl[reportSequence].mlChartData.drill = res.data.drill;
  //               this.userTab_.reportUrl[reportSequence].mlChartData.chartType = chartType;
  //               this.userTab_.reportUrl[reportSequence].mlChartData.name = reportName;
  //               this.userTab_.reportUrl[reportSequence].mlChartData.drillDownId = drillDownId;

  //               if (res.reportDataInfo) {
  //                 this.userTab_.reportUrl[reportSequence].mlChartData.reportDataInfo = res.reportDataInfo;
  //               }
  //               this.userTab_.reportUrl[reportSequence].isMultilevelDrill = true;
  //               this.userTab_.reportUrl[reportSequence].isChartLoaded = true;
  //               this.userTab_.reportUrl[reportSequence].isMultiLevelChartLoaded = true;
  //             }
  //           }, err => {

  //           });
  //       }


  //     }
  //   }, err => {

  //   });
  // }

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
        this.summaryService.deleteExstingReport(reportObj.reportId).subscribe(res => {
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

          // this.userTab_.reportUrl = this.sharedServices_.sortTabReportsByColSpan(this.userTab_.reportUrl);
          // this.reportService_.notifyTabChangesToServices(this.userTab_.id, this.userTab_.reportUrl);
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

  // public removeSummaryFromtab(summaryObj: TabSummary, summaryIndex: number) {
  //   swal({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Delete It!'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.reportService_.deleteExstingSummary(summaryObj.summaryReportId).subscribe(res => {
  //         this.userTab_.summarReportUrl.splice(summaryIndex, 1);
  //         // swal('' + summaryObj.name, 'Summary Removed Successfully', 'success');

  //         swal({
  //           position: 'center',
  //           type: 'success',
  //           title: '' + summaryObj.name,
  //           titleText: 'Summary Removed Successfully',
  //           showConfirmButton: false,
  //           timer: 1000
  //         });


  //       }, err => {
  //         swal('', 'Oops ! Got Error While Removing Summary', 'error');
  //       });
  //     }
  //     if (result.dismiss) {
  //       // user Refused Changes .......
  //     }
  //   }, err => {
  //   });
  // }

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

  // loadGFCustomers() {
  //   this.reportService_.fetchGFCustomers().subscribe(res => {
  //     const data = res.status ? res.data : [];
  //     data.map(fil => {
  //       fil['value'] = false;
  //     });

  //     this.globalFilterModal.customers = this.sharedServices_.sortByKey(data, 'name');
  //     // this.globalFilterModal.customers = data;
  //   }, err => {

  //   });
  // }

  // select deselect all customer start
  checkUncheckAll(checklist, masterSelected) {
    for (let i = 0; i < checklist.length; i++) {
      checklist[i].value = masterSelected;
    }
  }
  isAllSelected(checklist, masterSelected) {
    this.globalFilterModal[masterSelected] = checklist.every(function (item: any) {
      return item.value == true;
    });
  }

  trackByFn(index, item) {
    return index; // or item.id
  }


  /**
   * This f/n will manage selectAll/deSelectAll checkbox
   *  impact on assigneegroup global filter
   * @param asd Array
   * @param nonAsd Array
   */
  checkUncheckAllAsigneeGroup(asd, nonAsd) {
    for (let i = 0; i < asd.length; i++) {
      asd[i].value = this.globalFilterModal['masterSelectedAsigneeGroup'];
    }

    for (let i = 0; i < nonAsd.length; i++) {
      nonAsd[i].value = this.globalFilterModal['masterSelectedAsigneeGroup'];
    }

    this.globalFilterModal.masterSelectedASD = this.globalFilterModal['masterSelectedAsigneeGroup'];
    this.globalFilterModal.masterSelectedNONASD = this.globalFilterModal['masterSelectedAsigneeGroup'];
  }
  // select customer end


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
    // const idTobeApp = ((filters && filters.length > 0) ? 'tab_w_25' : 'tab_w_33');
    const idTobeApp = ((filters && filters.length > 0) ? 'tab_w_33' : 'tab_w_50');
    return idTobeApp;
  }

  reloadSummaryWidget() {
    this.fetchReportSummaryData();
  }

}


export interface Item {
  id: number;
  name: string;
}
