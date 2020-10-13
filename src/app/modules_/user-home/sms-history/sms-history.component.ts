import themeConf_ from '../../../config/theme-settings';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { SharedServices } from 'src/app/shared_/shared.services';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import pageSettings from 'src/app/config/page-settings';
import * as $ from 'jquery';
import { ReportService } from 'src/app/services_/report.services';
declare var moment: any;

@Component({
  selector: 'cats-sms-history',
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.css']
})
export class SmsHistoryComponent implements OnInit, OnDestroy, AfterViewInit {

  timeMap = {
    'now': 'Now',
    'l1h': 'Last 1 Hour',
    'td': 'Today',
    'yd': 'Yesterday',
    '7d': 'Last 7 Days',
    'cm': 'This Month',
    'lm': 'Last Month',
    'l3m': 'Last 3 Months',
    'l6m': 'Last 6 Months',
    'cy': 'This Year',
    'cu': 'Custom Range'
  };
  modalReferenceAddReport: any;
  closeResult: string;

  pageSettings;
  themeConf_;
  public timeServicesSubsc$: Subscription;
  selectedTimeRange = {
    timestamp_start: null,
    timestamp_end: null,
    date_start: null,
    date_end: null,
    timeType: null
  };

  //#region: filter_model start
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

    timeType: 'cu'
  };

  public flInputCust_ = new FormControl();
  public flTxtCust_: string;
  //#region: filter_model end

  //#region agGrid declaration start
  incidentList: any[];
  // ag-grid specific
  public gridApi;
  public gridParams;
  public gridColumnApi;
  public columnDefs;
  public context;
  public defaultColDef;
  public rowData;
  public frameworkComponents;
  private getRowHeight;

  // default 7 days
  dateFilter_timeType = '7d';
  dateFilter_startDate = moment().subtract(6, 'days').startOf('day');
  dateFilter_endDate = moment().endOf('day');
  dateFillter_customRanges = ['Last 1 Hour', 'Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month'];
  @Input() paginationPageSize = 20;
  @Input() paginationLimits = [10, 20, 50, 100, 500, 1000];
  @Output() pageSizeChange = new EventEmitter();

  modPagination = {
    'totalRecords': 0,
    'currentPage': 0,
    'totalPages': 0,
    'recordsOnPage': 0,
    'isLastPage': false
  };

  public dbAllcolumns = [
    {
      'headerName': 'Incident No.',
      'field': 'incidentNo',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Incident No.',
    },
    {
      'headerName': 'Title',
      'field': 'title',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Title',
    },
    {
      'headerName': 'Priority',
      'field': 'priority',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Priority',
    },
    {
      'headerName': 'SMS Content',
      'field': 'smsTitle',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'SMS Content',
    },
    {
      'headerName': 'Category',
      'field': 'category',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Category',
    },
    {
      'headerName': 'Sub Category',
      'field': 'subcategory',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Sub Category',
    },
    {
      'headerName': 'Service',
      'field': 'service',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Service',
    },
    {
      'headerName': 'Time',
      'field': 'datetime',
      'sortable': true,
      'editable': false,
      'filter': 'agDateColumnFilter',
      'filterParams': {
        // provide comparator function
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          const dateAsString = cellValue; // moment(cellValue).format('DD/MM/YYYY');
          const dateParts = dateAsString.split('/');
          const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
        'filterOptions': ['equals', 'greaterThan', 'lessThan' , 'notEqual' , 'inRange']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Time',
      'valueGetter': this.doConversionTime.bind(this),
      'cellRenderer': this.doConversionTime.bind(this),
    },
    {
      'headerName': 'Status',
      'field': 'status',
      'sortable': true,
      'editable': false,
      'filter': 'agTextColumnFilter',
      'filterParams': {
        'filterOptions': ['contains', 'notContains']
      },
      'width': 100,
      'isActive': true,
      'headerTooltip': 'Status',
    },
  ];

  // "status": null,
  // "id": 1,
  // "incidentNo": null,
  // "title": null,
  // "priority": null,
  // "smsTitle": "dispatched",
  // "category": "12",
  // "subcategory": "1",
  // "service": "ULL)",
  // "datetime": 1579361323000



  allFilters: { headerName: any; fieldName: any; filter: any[]; }[];
  scheduleReport: any;

  //#region agGrid declaration end

  constructor(
    private modalService: NgbModal,
    private timeServices_: TimeFilterService,
    private reportService_: ReportService,
    private sharedServices_: SharedServices) {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;


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

    this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.defaultColDef = {
      filter: true,
      // editable: true,
      resizable: true,

    };
    this.context = { componentParent: this };
    this.getRowHeight = function (params) {
      return 50;
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridParams = params;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  getActiveColumns(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'];
    });
    return activeColumns;
  }
  onGridPivotSelection() {
    this.gridApi.setColumnDefs([]);
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setColumnDefs(this.getActiveColumns(this.dbAllcolumns));
    this.gridApi.sizeColumnsToFit();
  }
  /**
   *  agGrid : custom pagination start
   */
  onPaginationChanged(event) {
    if (this.gridApi) {
      this.modPagination.totalRecords = 0;
      this.modPagination.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      this.modPagination.totalPages = this.gridApi.paginationGetTotalPages();
      this.modPagination.recordsOnPage = this.gridApi.paginationGetPageSize();
      this.modPagination.isLastPage = this.gridApi.paginationIsLastPageFound();
    }
  }

  onBtFirst() {
    this.gridApi.paginationGoToFirstPage();
  }

  onBtLast() {
    this.gridApi.paginationGoToLastPage();
  }

  onBtNext() {
    this.gridApi.paginationGoToNextPage();
  }

  onBtPrevious() {
    this.gridApi.paginationGoToPreviousPage();
  }

  selectPageCounts(value) {
    this.gridApi.paginationSetPageSize(Number(value));
    this.gridApi.sizeColumnsToFit();
  }
  // var filterInstance = gridApi.getFilterInstance('name');
  /**
   *  agGrid : custom pagination end
   */

  /** Download Reports start */
  exportReportData() {
    const params = {
      'skipHeader': false,
      'columnGroups': true,
      'skipGroups': false,
      'allColumns': true,
      'fileName': 'History',
      'columnSeparator': ''
    };

    this.gridApi.exportDataAsCsv(params);
  }
  /** End Download Reports  */

  ngOnInit() {
    this.loadReportData();
    this.themeConf_ = themeConf_;
    $('.Show').click(function () {
      $('#target_allSaturation').show(500);
      $('.Show').hide(0);
      $('.Hide').show(0);
    });
    $('.Hide').click(function () {
      $('#target_allSaturation').hide(500);
      $('.Show').show(0);
      $('.Hide').hide(0);
    });
    $('.toggle').click(function () {
      $('#target_allSaturation').toggle('slow');
    });

    this.initFilterInputCustomer();
    // this.loadUserTabFilter();
  }
  //#region  business logic start
  loadReportData() {
    this.showGridLoader();
    this.allFilters = [];
    this.reportService_.getSMSHistory(this.globalFilterModal, this.selectedTimeRange).subscribe(res => {
      this.hideGridLoader();
      if (res['status'] === true) {
        this.incidentList = res.data;
      }

    }, err => {
      this.incidentList = [];
      this.hideGridLoader();
      swal('', 'Oops ! Getting Error While Loading Data', 'error');
    });

  }
  //#region  business logic end
  showGridLoader() {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }
  hideGridLoader() {
    if (this.gridApi) {
      this.gridApi.hideOverlay();
    }
  }
  ngOnDestroy() {
    this.pageSettings.pageSidebarMinified = false;
    if (this.timeServicesSubsc$) {
      this.timeServicesSubsc$.unsubscribe();
    }
  }
  ngAfterViewInit() {
    // setTimeout(() => { this.pageSettings.pageSidebarMinified = true; }, 200);
  }
  //#region filter_implementation start

  /**
 *  will detect customer filter search option based on debouncetime
 */
  initFilterInputCustomer() {
    this.flTxtCust_ = '';
    this.flInputCust_
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {
        this.flTxtCust_ = term;
      });
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

  onGlobalFilterChange() {
    this.compareUserTabGlobalFilterModification();
  }
  onGlobalFilterToggle() {
    $('.gf_box').animate({
      width: 'toggle'
    });
  }

  doConversionTime(params): string {
    if (params.data.datetime && params.data.datetime != null) {
      return moment(params.data.datetime).format('DD/MM/YYYY h:mm:ss');
    } else {
      return '';
    }
  }

  /**
 *  load all filters code start
 */
  // loadUserTabFilter() {
  //   this.reportService_.loadUserTabFilter(0).subscribe(res => {
  //     if (res['status'] == true) {
  //       // const userTabFilter: UserTabFilterVM = new UserTabFilterVM(res['data']);
  //       this.bindUserTabFilterData(res['data']);
  //     }
  //   }, err => {

  //   });
  // }

  /**
    *  This f/n will prepare global filter model object
    * @param obj  : filter object
    */
  bindUserTabFilterData(obj: any) {
    if (obj['customers']) {
      const custSort_ = this.sharedServices_.sortByKey(obj['customers'], 'name');
      this.globalFilterModal.customers = this.deepClone(custSort_);
      this.globalFilterModal.editCustomers = this.deepClone(custSort_);
      this.globalFilterModal.modifyCustomer = this.deepClone(custSort_);
    }
    if (obj['asd']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['asd'], 'name');
      this.globalFilterModal.asd = this.deepClone(asdSort_);
      this.globalFilterModal.editAsd = this.deepClone(asdSort_);
      this.globalFilterModal.modifyAsd = this.deepClone(asdSort_);
    }
    if (obj['non_asd']) {
      const asdSort_ = this.sharedServices_.sortByKey(obj['non_asd'], 'name');
      this.globalFilterModal.nonAsd = this.deepClone(asdSort_);
      this.globalFilterModal.editNonASD = this.deepClone(asdSort_);
      this.globalFilterModal.modifyNonASD = this.deepClone(asdSort_);
    }
    this.globalFilterModal.timeType = obj['time_type'] ? obj['time_type'] : 'cu';

    // TODO : make hit to fetch all reports data.
    this.loadReportData();
  }

  /**
  * This f/n will return an duplicate array
  * Deep Copy
  * @param oldArray
  */
  deepClone(oldArray: Object[]) {
    const newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  public compareUserTabGlobalFilterModification() {
    this.globalFilterModal.modifyCustomer = this.detectChanges(this.globalFilterModal.editCustomers, this.globalFilterModal.customers);
    this.globalFilterModal.modifyAsd = this.detectChanges(this.globalFilterModal.editAsd, this.globalFilterModal.asd);
    this.globalFilterModal.modifyNonASD = this.detectChanges(this.globalFilterModal.editNonASD, this.globalFilterModal.nonAsd);

    // TODO : update Report filter : if needed

    // TODO: fetch incident data api
    this.loadReportData();
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


  open(content, size) {
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

  // updateUserTabFilters() {
  //   this.reportService_.updateUserTabFilter(0, this.globalFilterModal).subscribe(res => {
  //     if (res['status'] == true) {
  //       // const userTabFilter: UserTabFilterVM = new UserTabFilterVM(res['data']);
  //       swal({
  //         position: 'center',
  //         type: 'success',
  //         title: '',
  //         titleText: 'Filter Saved Successfully',
  //         showConfirmButton: false,
  //         timer: 1000
  //       });
  //     }
  //   }, err => {

  //   });
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
      const elementDD: Element = document.getElementById(targetId);
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_[targetListen] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

  hideDDASDTemp(event, obj_, targetId, targetListen) {
    setTimeout(function () {
      // const element_: Element = (event.target as Element);
      const elementDD: Element = document.getElementById(targetId);
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

  globalFilterClickOutSide(event) {
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

}
