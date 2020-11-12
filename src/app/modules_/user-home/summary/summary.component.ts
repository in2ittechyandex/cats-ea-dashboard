import { SharedServices } from 'src/app/shared_/shared.services';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import themeConf_ from 'src/app/config/theme-settings';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { SummaryService } from 'src/app/services_/summary.services';
import { TechReports } from 'src/app/models_/summary';

declare var moment: any;

@Component({
  selector: 'cats-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private sharedServices_: SharedServices,
    private timeServices_: TimeFilterService,
    private summaryService: SummaryService
  ) {
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.onTsModified(obj);
    });
  }
  currentDate: any;
  loggedUserName: any;
  showMainLoader: boolean = true;
  situation_data: any[] = [];
  technologyList: any;
  technologyWidgetData: Array<TechReports> = [];
  summaryBlocks: any = [];
  summaryBlocks7Days: any = [];

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
    timeType: '',
    customer: '',
    timeString: '',
    startDate: '',
    endDate: '',
    isLoaded: false
  };

  closeResult: string;
  themeConf_;
  summaryCollapsed = true;
  panelReload = false;

  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };
  public timeServicesSubsc$: Subscription;
  public amChartsTheme: string;

  globalFilterModal = {
    isListenOnBlur: false,
    identifier: 'global-customer-filter',
    filtersToggle: false,
    userTabFilters: null,
    // editCustomers: [],
    // modifyCustomer: [],
    masterSelectedNMS: false,
    nms: [],
    editNMS: [],
    modifyNMS: [],
    timeType: 'cu'
  };

  public modAddReports_ = {
    'selTechnology': '',
    'selReportName': '',
    'selNMS': '',
    'nms': [],
    'tech': [],
  };

  themeName: 'default';
  public urlHome = '/dashboard/home'; 
  public selectedTabId: number;
  public selectedTabName: String = '';
  // public userTab_: UserTab;

  modalReferenceAddReport: any;
  visibleIndex = -1;

  onGlobalFilterToggle() {
    $('.gf_box').animate({
      width: 'toggle'
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


  onGlobalFilterChange() {
    this.showMainLoader = true;
    // this.TootTipStr_.open = false;
    setTimeout(() => {
      this.compareUserTabGlobalFilterModification();
    }, 1000);
  }

  updateUserTabFilters() {
    this.showMainLoader = true;
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
    this.globalFilterModal.modifyNMS = this.detectChanges(this.globalFilterModal.editNMS, this.globalFilterModal.nms);
    this.updateUserTabFilters();

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

  }


  ngAfterViewInit() {

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
    // this.getHeaders();
    this.themeConf_ = themeConf_;
    this.loadNMSList();
    this.loadTechnologyList();
    this.loadSummaryBlocksToday();
    this.loadSummaryBlocks7Days();
  }



  public loadNMSList() {
    this.showMainLoader = true;
    this.summaryService.getNMSList().subscribe(res => {
      const data = res.status == true ? res.data : [];
      res.data.nms.map(elm => elm['value'] = true);
      this.bindUserTabFilterData(data);
      this.showMainLoader = false;
    }, err => {

    });
  }

  /**
 * Ramji : 03-11-2020
 *  This f/n will prepare global filter model object
 * @param obj  : filter object
 */
  bindUserTabFilterData(obj: any) {
    if (obj['nms']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['nms'], 'name');
      this.globalFilterModal.nms = this.deepClone(asdSort_);
      this.globalFilterModal.editNMS = this.deepClone(asdSort_);
      this.globalFilterModal.modifyNMS = this.deepClone(asdSort_);
    }
    this.globalFilterModal.timeType = obj['time_type'] ? obj['time_type'] : 'cu';
    this.loadReportList();
  }

  public loadTechnologyList() {
    this.showMainLoader = true;
    this.summaryService.getTechnologyList().subscribe(resp => {
      if (resp.status) {
        this.technologyList = resp.data;
        // this.loadTechnologyWidget();
      }
    });
  }

  public loadReportList() {
    this.summaryService.loadReportList().subscribe(resp => {
      if (resp.status) {
        this.technologyWidgetData = [];
        const l_ = resp.data ? resp.data : [];
        l_.forEach(r_ => {
          this.technologyWidgetData.push(new TechReports(r_));
        });
        this.loadReportData();
      }
    });
  }

  loadReportData() {
    for (let i = 0; i < this.technologyWidgetData.length; i++) {
      this.makeCallFetchTechReportData(this.technologyWidgetData[i], i);
    }
  }

  public makeCallFetchTechReportData(obj: TechReports, index) {
    this.technologyWidgetData[index].isReportLoaded = false;
    this.summaryService.getTechnologyWidgetData(index,
      this.technologyWidgetData[index].id, this.selectedTimeRange,
      this.globalFilterModal).subscribe(res => {
        if (res.status) {
          this.technologyWidgetData[index].data = res.data;
          this.technologyWidgetData[index].isReportLoaded = true;
        }
      }, err => {
        // TODO : log error here or send mail
      });
  }

  public loadSummaryBlocksToday() {
    this.summaryService.getSummaryBlocksData('td').subscribe(resp => {
      if (resp.status) {
        this.summaryBlocks.push(resp.data);
      }
    });
  }

  public loadSummaryBlocks7Days() {
    this.summaryService.getSummaryBlocksData('7d').subscribe(resp => {
      if (resp.status) {
        this.summaryBlocks7Days.push(resp.data);
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


  onClickAddNewReportButton() {
    this.clearModalAddReports();
    this.modAddReports_['tech'] = this.technologyList;
    this.modAddReports_['nms'] = this.globalFilterModal.nms.filter(elm => elm.value == true);
  }

  clearModalAddReports() {
    this.modAddReports_['selTechnology'] = '';
    this.modAddReports_['selReportName'] = '';
    this.modAddReports_['selNMS'] = '';
    this.modAddReports_['nms'] = [];
    this.modAddReports_['tech'] = [];
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


  sortByKey(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  open(content, size) {
    // this.TootTipStr_.open = false;
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

  /**
   * Ramji 03-11-2020
   * @param reportId
   */
  public onTechnologySelect(reportId) {

  }

  public onNMSSelect(obj) {

  }

  validateAddReportTab() {
    if (('' + this.modAddReports_.selReportName).trim() == '') {
      swal('Please Fill Report Name', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selTechnology).trim() == '') {
      swal('Please Fill Report Technology', '', 'warning');
      return false;
    } else if (('' + this.modAddReports_.selNMS).trim() == '') {
      swal('Please Select Report NMS', '', 'warning');
      return false;
    } else {
      return true;
    }
  }


  addReportToTab() {
    if (this.validateAddReportTab()) {
      this.modalReferenceAddReport.close();
      const objAddReport_ = {
        'technology': this.modAddReports_.selTechnology,
        'nmsList': this.modAddReports_.selNMS,
        'name': this.modAddReports_.selReportName
      };
      this.summaryService.addNewTechnologyWidgetRequest(objAddReport_).subscribe(res => {
        if (res.status) {
          swal({
            position: 'center',
            type: 'success',
            title: this.modAddReports_.selReportName,
            titleText: 'Report Added Successfully',
            showConfirmButton: false,
            timer: 1000
          });
          // const report_: TechReports = new TechReports(res.data);
          // this.technologyWidgetData.push(report_);
          // this.makeCallFetchTechReportData(report_, (this.technologyWidgetData.length - 1));
          this.loadReportList();
          this.clearModalAddReports();
        }
      }, err => {

      });
    }
  }

 
  /**
   * This f/n will disallow right click default tooltip bar of browser.
   *
   */
  onContextMenu(event) {
    return false;
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  public removeReportFromTab(reportObj: TechReports, reportIndex_: number) {
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
        this.summaryService.deleteExstingReport(reportObj.id).subscribe(res => {
          swal({
            position: 'center',
            type: 'success',
            title: '' + reportObj.name,
            titleText: 'Report Removed Successfully',
            showConfirmButton: false,
            timer: 1000
          });
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

  getChecked(value) {
    return value;
  }

}




