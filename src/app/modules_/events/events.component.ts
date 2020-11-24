import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import themeConf_ from '../../config/theme-settings';
import * as global from 'src/app/config/globals';
import pageSettings from '../../config/page-settings';
import { EventsService } from './events.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { PagerService } from '../../services_/pager.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
// import { TimeFilterService } from '../../../time-filter/time-filter.service.component';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbCalendar, NgbModalRef, NgbModal, ModalDismissReasons, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
// import { Link, Node } from '../d3';
// import { NodedataService } from '../nodedata.service';
// import { CommonService } from 'src/app/services_/common.services';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';

// import { chart } from 'highcharts';
// import * as Highcharts from 'highcharts';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { PagerService } from 'src/app/shared_/pager.service';
import { CommonService } from 'src/app/common.service';
declare var require: any;
// require('highcharts/highcharts-more')(Highcharts);
@Component({
  selector: 'cats-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  private allItems: any[];
  pager: any = {};
  pagedItems: any[];
  pagerPopUp: any = {};
  pagedItemsPopUp: any[];
  global = global;
  closeResult: string;
  pageSettings;
  public userTabSubscr_: Subscription;
  count_critical = '0';
  count_major = '0';
  count_minor = '0';
  count_warning = '0';

  public eViewModal = {
    'rowData': [],
    'dbAllColumns': [
      {
        headerName: 'Time',
        field: 'display_time',
        sortable: true,
        filter: true,
        editable: false,
        resizable: true,
        headerTooltip: 'Time',
        width: 100,
        'isActive': true,
      },
      {
        headerName: 'Description',
        field: 'message',
        sortable: true,
        filter: true,
        editable: false,
        draggable: true,
        resizable: true,
        flex: 1,
        width: 200,
        headerTooltip: 'Description',
        'isActive': true,
      },
      {
        headerName: 'Severity',
        field: 'severity',
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip: 'Severity',
        resizable: true,
        'isActive': false,
        width: 100,
      },
      {
        headerName: 'IP',
        field: 'ip_address',
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip: 'IP',
        resizable: true,
        'isActive': false,
        width: 100,
      },
      {
        headerName: 'Interface',
        field: 'interface',
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip: 'Interface',
        resizable: true,
        'isActive': false,
        width: 100,
      }
    ],
    'filter': {
      'count': '5',
      'type': 'hour',
      'severity': '',
      'inputSource': ''
    },
    'chartData': null
  };

  public sViewModal = {
    'rowData': [],
    'dbAllColumns': [],
    'filter': {
      'count': '5',
      'type': 'hour',
    },
    tickettype:'Incident',
    'chartData': null
  };

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
      'showYAxisValues': '1',
      'showLegend': '1',
      'plotToolText': '$label : $value',
      'palettecolors': themeConf_.selectedColor
    },
    'data': []
  };
  eventPageChartData = {
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
      'showYAxisValues': '1',
      'showLegend': '1',
      'plotToolText': '$label : $value',
      'palettecolors': themeConf_.selectedColor
    },
    'data': []
  };
  eventPageDataSource;

  eventPageheight = 130;
  width = '100%';
  height = 180;
  type = 'column2d';
  dataFormat = 'json';
  dataSource;
  currentPage = 1;
  totalPages = 0;
  currentPagePopUp = 1;
  totalPagesPopUp = 0;
  results: any[] = [];
  queryField: FormControl = new FormControl();
  query;
  resultsMessage: any[] = [];
  queryFieldMessage = '';
  queryMessage;
  public mData = [];
  public mChildData = { 'headers': [], 'data': [] };
  public seleObj: any = {};
  public str = {
    type_id: '',
    subject: '',
    ci: '',
    desc: '',
    state: '',
    event_id: '',
    workOrderId: ''
  }
  incidentData = {
    'incident_no': '',
    'incident_subject': '',
    'incident_status': '',
    'incident_desc': '',
    'incident_category': '',
    'incident_priority': '',
    'incident_requestType': '',
    'incident_asset': '',
    'incident_sla': '',
    'incident_technician': '',
    'incident_resolvedate': '',
    'incident_duebytime': '',
    'incident_responseduebytime': '',
    'reason_resolve': ''
  };
  public timeServicesSubsc$: Subscription;
  tableHeight = '510';
  public gridApi;
  public gridParams;
  public gridColumnApi;
  public columnDefs;
  public context;
  public defaultColDef;
  public rowData;
  public frameworkComponents;
  dropdownListInputSource = [];
  selectedItemsInputSource = [];
  dropdownSettingsInputSource = {};

  dropdownListEventStatus = [];
  selectedItemsEventStatus = [];
  dropdownSettingsEventStatus = {};

  dropdownListStatus = [];
  selectedItemsStatus = [];
  dropdownSettingsStatus = {};

  public dbAllcolumns = [
    {
      headerName: 'Action',
      'isActive': true,
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
        label: 'See More',
        rendererType: 'button'
      }
    },
    {
      headerName: 'Time',
      field: 'display_time',
      sortable: true,
      filter: true,
      editable: false,
      resizable: true,
      headerTooltip: 'Time',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.clickOnEventsId.bind(this),
        label: '',
        rendererType: 'link'
      },
      // cellRenderer: function (params) {
      //  return '<span style="cursor:pointer;color:blue;">'+params.value+'</span>'
      // },
      'isActive': true,
    },
    {
      headerName: 'Description',
      field: 'message',
      sortable: true,
      filter: true,
      editable: false,
      draggable: true,
      resizable: true,
      flex: 1,
      minWidth: 200,
      headerTooltip: 'Description',
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + params.value + '">' + params.value + '</span>'
      },
      'isActive': true,
    },
    {
      headerName: 'Severity',
      field: 'severity',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Severity',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Host Name',
      field: 'host_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Host Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'IP',
      field: 'ip_address',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'IP',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Interface',
      field: 'interface',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Interface',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Input Source',
      field: 'Input Source',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Input Source',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alias Name',
      field: 'alias_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alias Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'State',
      field: 'state',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'State',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    }, {
      headerName: 'Location',
      field: 'location',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Location',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alarm Name',
      field: 'alarm_name',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alarm Name',
      resizable: true,
      'isActive': true,
      minWidth: 100,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Alarm Type',
      field: 'alarm_type',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Alarm Type',
      resizable: true,
      'isActive': true,
      minWidth: 150,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Raw Event',
      field: 'rawdata',
      sortable: true,
      editable: false,
      filter: true,
      headerTooltip: 'Raw Event',
      resizable: true,
      'isActive': true,
      minWidth: 150,
      cellRenderer: function (params) {
        var str = params.value;
        var str1 = str.split('<').join(' ');
        var str2 = str1.split('>').join(' ');
        var str3 = str2.split('.').join(' ');
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + str3 + '">' + str3 + '</span>'
      },
    }
  ];
  secondsToRefresh: number = 60;
  timeLeft: number = 60;
  showMinimise: boolean = false;
  chartId = 'nearByEventChart';
  collapseChartPanel: boolean = true;
  timeRange = '';
  responseTime = 0;
  constructor(
    // private nodeDataService: NodedataService,
    private slimLoadingBarService: SlimLoadingBarService,
    private timeServices_: TimeFilterService,
    private modalService: NgbModal,
    private eventsService: EventsService,
    private pagerService: PagerService,
    private commonService: CommonService,
    private numberToDatePipe_: NumberToDatePipe) {
    this.timeLeft = this.secondsToRefresh;
    this.dataSource = this.data;
    this.eventPageDataSource = this.data;
    this.dropdownSettingsInputSource = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.userTabSubscr_ = this.eventsService.getUserTabsSubscriber().subscribe(tabs => {
      console.log('arjun here' + tabs);
      this.eventMessage = tabs.msgpattern
      this.queryFieldMessage = tabs.msgpattern;
      this.eventsService.eventtypeId = tabs.host;
      this.inputSource = tabs.nms;
      if (this.inputSource !== '') {
        this.setinputSource();
      }
      this.queryMessage = tabs.host;
      this.queryField.setValue(tabs.host);
      this.doSomethingOnNewSubsc(tabs);
    });

    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.currentPage = 1;
      this.onChangeTimeServices(obj);
    });
    // this.commonService.nodepanelCollapse.subscribe((flag:boolean)=>{
    //   console.log(flag);
    //   if(flag==false){
    //     this.chartShowing=true;
    //     this.tableHeight=(window.innerHeight-450).toString();
    //     this.getAnamolyData();
    //     // calc(100vh-314px)
    //   }else{
    //     this.chartShowing=false;
    //     this.tableHeight=(window.innerHeight-302).toString();
    //   }
    // })
    this.currentPage = 1;
    this.filter = '';
    this.doSomethingOnNewSubsc('tabs');
    this.startSchedular();
    this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.defaultColDef = {
      filter: true
      // editable: true,
      // resizable: true,

    };
    this.frameworkComponents = {
      checkboxRenderer: MatCheckboxComponent,
      // partialMatchFilter: PartialMatchFilter
    };
    this.context = { componentParent: this };
  }
  selectedEvent;
  selectedEventKeys = [];
  onBtnClick1(e) {
    this.selectedEvent = e.rowData;
    this.selectedEventKeys = Object.keys(this.selectedEvent);
    if (this.selectedEvent) {
      this.getRawData(this.selectedEvent.code);
    }

  }
  getRawData(id) {
    this.loading = true;
    this.eventsService.getRawData(id).subscribe((res) => {
      if (res['Status']) {
        this.selectedEvent['rawevent'] = res['data'];
        document.getElementById('modalViewEvent').click();
      }
      this.loading = false;
    })
  }
  setSelection(tabs) {

  }
  getPanelEvent(event) {
    if (event.eventType == 'collapse') {
      if (this.chartShowing == false) {
        this.chartShowing = true;
        this.tableHeight = (window.innerHeight - 310).toString();
        this.getAnamolyData();
        // calc(100vh-314px)
      } else {
        this.chartShowing = false;
        this.tableHeight = (window.innerHeight - 166).toString();
      }
    } else {

    }
  }
  chartShowing: boolean = false;
  @HostListener('window:resize')
  onResize() {
    if (this.chartShowing) {
      this.tableHeight = (window.innerHeight - 310).toString();
    } else {
      this.tableHeight = (window.innerHeight - 166).toString();
    }

  }
  /** pivot start */
  isAllSelected() {
    this.gridApi.setColumnDefs([]);
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setColumnDefs(this.getActiveColumns(this.dbAllcolumns));
    this.gridApi.sizeColumnsToFit();
  }


  getActiveColumns(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'];
    });
    return activeColumns;
  }

  onEventDetect(event) {
    const type = event['type'];
    const data = event['data'];
    const event_ = event['event']
    if (type == 'reload') {
      this.onReloadClick(event_);
    }
  }
  onReloadClick(event) {
    this.doSomethingOnNewSubsc(this.currentFilter);
  }

  onDownloadClick(event) {
  }

  onHeaderModify(event) {
    this.isAllSelected();
  }
  onCellClicked(event: any) {

    if (event.colDef.headerName == 'Time') {
      var time = event.data.time;
      console.log('cell', time);
      this.clickOnEventsId(event.data);
    }
  }
  gridSizeChanged(event) {
    console.log('resized');
    // this.gridApi.sizeColumnsToFit();
  }
  methodFromParent(data, severity) {
    console.log('on click act' + data);
    console.log(severity);

    this.clickOnTable(data);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridParams = params;
    this.gridColumnApi = params.columnApi;

    this.startSchedular();
    // params.api.sizeColumnsToFit();

  }
  modPagination = {
    'totalRecords': 0,
    'currentPage': 0,
    'totalPages': 10,
    'recordsOnPage': 0,
    'isLastPage': false
  };

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

  /**
   *  agGrid : custom pagination end
   */
  onChangeTimeServices(arg0: any): any {
    console.log(arg0);
    this.loading = true;
    this.doSomethingOnNewSubsc(this.currentFilter);
  }

  nodeData = {
    'key': [],
    'data': []
  };
  linkData;
  ngOnInit() {
    this.tableHeight = (window.innerHeight - 166).toString();
    this.getEventStatusList();
    this.getEventStatus();
    this.getInputSourceList();
    this.initSearch()
    this.pageSettings = pageSettings;
    this.themeConf_ = themeConf_;
    // this.nodeDataService.nodeSelected
    //   .subscribe(
    //     (node: Node) => {
    //       this.nodeData.key = [];
    //       this.nodeData.data = [];
    //       this.linkData = [];
    //       this.nodeData.data = node.nodeData['display'];
    //       this.nodeData.key = Object.keys(this.nodeData.data);
    //     }
    //   )
    // this.nodeDataService.linkSelected
    //   .subscribe(
    //     (link: Link) => {
    //       this.nodeData.key = [];
    //       this.nodeData.data = [];
    //       this.linkData = [];
    //       this.getLinkData(link.source['id'], link.target['id']);
    //     }
    //   )

  }
  getLinkData(source, target) {
    console.log('source' + source, 'target' + target);
    this.linkData = this.jsonStr.relation[source + target];

  }
  ngOnDestroy() {
    this.stopSchedular();
    this.userTabSubscr_.unsubscribe();
    this.timeServicesSubsc$.unsubscribe();
  }
  public subscription: Subscription;
  public startSchedular() {
    this.scheduleTask();
    let timer = TimerObservable.create(100, 3000);
    this.subscription = timer.subscribe(t => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.scheduleTask();
        this.timeLeft = this.secondsToRefresh;
      }

    });
  }
  currentFilter = '';
  public scheduleTask() {
    this.doSomethingOnNewSubsc(this.currentFilter);
  }

  public stopSchedular() {
    this.subscription.unsubscribe();
  }

  themeConf_;

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
      // .debounceTime(200)
      // .distinctUntilChanged()
      .subscribe(result => this.getSearchData(result));


  }
  getSearchData(result) {
    console.log(result);
    if (result != '') {
      this.eventsService.eventtypeId = result;
      this.eventsService.search_host(result).subscribe((res) => {
        if (res.status == true) {
          if (res.data.length > 0)
            this.results = res.data;
        }
      }, (err) => {
        this.completeLoading();
      });
    } else {

    }

  }
  checkResultLength() {
    if (this.results.length > 0) {
      return true;
    }
    return false;
  }
  getSearchDataMessage(result) {
  }
  checkResultLengthMessage() {
    if (this.resultsMessage.length > 0) {
      return true;
    }
    return false;
  }

  public doSomethingOnNewSubsc(tabs) {

    this.currentFilter = tabs;

    if (tabs != 'WARNING' && tabs != 'CRITICAL' && tabs != 'MAJOR' && tabs != 'DOWN') {
      tabs = '';
    }
    this.getEvents(this.eventsService.eventtypeId, this.eventMessage, this.currentPage, tabs);
  }
  eventMessage = '';
  filter = '';
  inputSource = '';
  inputSourceChange() {
    this.inputSource = this.inputSource;
    this.currentPage = 1;
    this.loading = true;
    this.doSomethingOnNewSubsc(this.filter);
  }
  filterStatus = '';

  filterData() {
    this.filter = this.filter;
    this.filterStatus = this.filterStatus;
    this.currentPage = 1;
    this.loading = true;
    this.doSomethingOnNewSubsc(this.filter);
  }
  eventStatusList = [];
  getEventStatusList() {
    this.eventsService.getEventSeverityList().subscribe((res) => {
      if (res.status) {
        this.eventStatusList = res.data;
        this.dropdownListEventStatus = [];
        // this.dropdownListEventStatus.push({ item_id: "0", item_text: "All"});

        for (var i = 0; i < this.eventStatusList.length; i++) {
          this.dropdownListEventStatus.push({ item_id: this.eventStatusList[i]['id'].toString(), item_text: this.eventStatusList[i]['name'] });
        }
      } else {
        alert(res.msg);
      }
    }, (err) => {
    });
  }
  eventList = [
    { 'id': 1, 'name': 'ACTIVE' }, { 'id': 2, 'name': 'CLEAR' }];
  getEventStatus() {
    this.eventsService.getEventStatus().subscribe((res) => {
      if (res.status) {
        this.eventList = res.data;

        this.dropdownListStatus = [];

        for (var i = 0; i < this.eventList.length; i++) {
          this.dropdownListStatus.push({ item_id: this.eventList[i]['id'].toString(), item_text: this.eventList[i]['name'] });

        }

      } else {
        alert(res.msg);
      }
    }, (err) => {
    });
  }
  inputSourcecList = [];
  getInputSourceList() {
    this.eventsService.getInputSourceList().subscribe((res) => {
      if (res.status) {
        this.inputSourcecList = res.data;
        this.dropdownListInputSource = [];
        // this.dropdownListInputSource.push({ item_id: "0", item_text: "All"});
        this.selectedItemsInputSource = [];
        for (var i = 0; i < this.inputSourcecList.length; i++) {
          this.dropdownListInputSource.push({ item_id: (i + 1).toString(), item_text: this.inputSourcecList[i]['name'] });
          if (this.selectedItemsInputSource.length == 0) {

            console.log('Arjun Singh get input source');
            if (this.inputSourcecList[i]['name'] === this.inputSource) {
              this.selectedItemsInputSource.push({ item_id: (i + 1).toString(), item_text: this.inputSourcecList[i]['name'] });
              this.doSomethingOnNewSubsc(this.filter);
            }

          }
        }

      } else {
        alert(res.msg);
      }
    }, (err) => {
    });
  }
  setinputSource() {
    console.log('Arjun Singh set input source');

    this.selectedItemsInputSource = [];
    for (var i = 0; i < this.inputSourcecList.length; i++) {
      if (this.selectedItemsInputSource.length == 0) {
        if (this.inputSourcecList[i]['name'] === this.inputSource) {
          this.selectedItemsInputSource.push({ item_id: (i + 1).toString(), item_text: this.inputSourcecList[i]['name'] });
        }

      }
    }
    this.doSomethingOnNewSubsc(this.filter);
  }
  onItemInputSource(item: any) {

    if (this.selectedItemsInputSource.length > 0) {
      this.inputSource = item.item_text;
      this.inputSourceChange();
    } else {
      this.inputSource = '';
      this.inputSourceChange();
    }
  }
  onItemEventStatus(item: any) {

    if (this.selectedItemsEventStatus.length > 0) {
      this.filter = item.item_text;
      this.filterData();
    } else {
      this.filter = '';
      this.filterData();
    }
  }
  onItemStatus(item: any) {

    if (this.selectedItemsStatus.length > 0) {
      this.filterStatus = item.item_text;
      this.filterData();
    } else {
      this.filterStatus = '';
      this.filterData();
    }
  }
  getEvents(eventTypeId, eventMessage, pageNumber, filter) {
    if (this.allEventService) {
      this.allEventService.unsubscribe();
    }
    this.getAllEventsChartMainPage();
    this.startLoading();
    const startTime: number = new Date().getTime();
    var inputSourceListTemp = [];
    for (var i = 0; i < this.selectedItemsInputSource.length; i++) {
      inputSourceListTemp.push(this.selectedItemsInputSource[i].item_text);
    }
    var severityListTemp = [];
    for (var i = 0; i < this.selectedItemsEventStatus.length; i++) {
      severityListTemp.push(this.selectedItemsEventStatus[i].item_text);
    }
    var statusListTemp = [];
    for (var i = 0; i < this.selectedItemsStatus.length; i++) {
      statusListTemp.push(this.selectedItemsStatus[i].item_text);
    }
    this.allEventService = this.eventsService.getAllEvents(
      eventMessage,
      eventTypeId,
      severityListTemp,
      statusListTemp,
      pageNumber,
      this.timeServices_.getstartDateInTimestamp(),
      this.timeServices_.getendDateInTimestamp(),
      inputSourceListTemp).subscribe((res) => {
        if (res.status == true) {
          const endTime: number = new Date().getTime();
          const diffTime = endTime - startTime;
          this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
          this.mData = res.data;
          this.totalPages = res.totalpage;
          this.initPage(pageNumber);
          this.completeLoading();
          this.allEventService = null;
          this.loading = false;
        } else {
          this.loading = false;
        }
      }, (err) => {
        this.completeLoading();
        this.loading = false;
        this.allEventService = null;
      });

    this.timeRange = this.getHeaders(this.timeServices_.getstartDateInTimestamp(), this.timeServices_.getendDateInTimestamp())
  }
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
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loading = true;
    this.doSomethingOnNewSubsc(this.filter);
    this.pager = this.pagerService.getPager(this.totalPages, page);
  }
  chaekparent(flag) {
    if (flag) {
      return true;
    }
    return false;
  }
  initPage(page: number) {
    this.pager = this.pagerService.getPager(this.totalPages, page);
    this.pagedItems = this.pagerService.range(1, this.totalPages);
  }
  pageNumber: any = 1;

  setPagePopUp(page: number) {
    if (page < 1 || page > this.pagerPopUp.totalPages) {
      return;
    }
    this.loading = true;
    this.currentPagePopUp = page;
    this.callKpis();
    this.pagerPopUp = this.pagerService.getPager(this.totalPagesPopUp, page);
  }
  initPagePopUp(page: number) {
    this.pagerPopUp = this.pagerService.getPager(this.totalPagesPopUp, page);
    this.pagedItemsPopUp = this.pagerService.range(1, this.totalPagesPopUp);
  }
  pageNumberPopUp: any = 1;



  /**
  * will validate only blank
  * @param keystoValidate  ["username","password"] etc.
  * @param obj   {"username":"","password":""} etc.
   */
  public validateModel(keystoValidate, obj): boolean {
    let model = obj;
    var isValid: boolean = true;
    var keys = keystoValidate;;
    for (var i = 0; i < keys.length; i++) {
      var element = keys[i];
      if (!(model[element] != undefined && ('' + model[element]).trim() != '')) {
        alert('Please Fill Your ' + element + ' field');
        isValid = false;
        break;
      }
    }
    return isValid;
  }
  allEventService;

  getAllEventsChart() {

    this.startLoading();
    this.eventsService.getAllEventsChart(this.modelTimeRange.host, '', '').subscribe((res) => {
      if (res.status == true) {
        this.data.data = res.data;
        this.dataSource = this.data;
        this.completeLoading();

      } else {
        this.data.data = [];
        this.dataSource = this.data;
      }
    }, (err) => {
      this.completeLoading();
    });
  }
  getAllEventsChartMainPage() {

    // this.startLoading();
    // this.eventsService.getAllEventsChart(this.eventsService.eventtypeId, this.inputSource, this.filter).subscribe((res) => {
    //   if (res.Status) {
    //     this.eventPageChartData.data = res.data;
    //     this.eventPageDataSource = this.eventPageChartData;
    //     this.completeLoading();

    //   } else {
    //     this.eventPageChartData.data = [];
    //     this.eventPageDataSource = this.eventPageChartData;
    //   }
    // }, (err) => {
    //   this.completeLoading();
    // });
  }
  searchCiFilter() {
    this.currentPage = 1;
    var id = '';
    if (this.queryField.value != '' && this.queryField.value != undefined) {
      if (this.results != undefined) {
        for (var i = 0; i < this.results.length; i++) {
          if (this.queryField.value == this.results[i].host) {
            id = this.results[i].host;
            this.eventsService.eventtypeId = id;
          }
        }
      }
    } else {
      this.eventsService.eventtypeId = '';
    }
    this.currentPage = 1;
    this.loading = true;
    this.doSomethingOnNewSubsc(this.currentFilter);
  }
  searchCiFilterMessage() {
    this.currentPage = 1;
    this.eventMessage = this.queryFieldMessage;
    this.loading = true;
    this.doSomethingOnNewSubsc(this.currentFilter);
  }

  /**
*
* @param obj  selected object {}
* @param headerName selected header name.
* @param objNdx  object index from array.
* @param headerNdx header index.
*/
  clickOnTable(obj) {
    this.seleObj = obj;
    this.str.event_id = this.seleObj['code'];
    this.getActionFormData(this.seleObj.code);
    // this.getChildEvents(this.seleObj.code);
    this.niaerror = false;
    this.jsonStr = null;
    this.levelNia == 1;
    // this.getGraphViewNia();
    document.getElementById('modalButtonEdit').click();

  }

  modelTimeRange = {
    'count': '5',
    'type': 'hour',
    'time': '',
    'host': ''
  }
  mDataPopUp = [];
  titleChart = '';
  clickOnEventsId(obj) {

    var event = obj.rowData;
    this.modelTimeRange.time = event.time;
    this.filterTagsearch = '';
    var hostname = event['host_name'];
    // for (var i = 0; i < event.length; i++) {
    //   if (event[i].tag == "host_name") {
    //     hostname = event[i].value;
    //     break;
    //   }
    // }
    this.titleChart = 'Event trend - ' + event['message'];
    var len = this.titleChart.length;
    var finalString = '';
    var desiredLength = 150;
    if (len > desiredLength) {
      var str = (len / desiredLength).toFixed();
      var upper: number = parseInt(str);
      for (var i = 0; i <= upper; i++) {
        var subStr = this.titleChart.substring(desiredLength * i, desiredLength * (i + 1));
        finalString = finalString + ' ' + subStr + '\n';
      }
      this.titleChart = finalString;
    }
    this.modelTimeRange.host = hostname;
    this.currentHost = hostname;
    this.res = undefined;
    this.getAllEventsChart();
    // this.currentPagePopUp = 1;
    this.resetAllFilterAndTags();
    this.callKpis();
    document.getElementById('modalButtonOpen').click();
  }

  /**
   * Ramji code start
   */


  onTabChange($event: NgbTabChangeEvent) {
    console.log('onTabChange ..... : ' + $event.nextId);
    if ($event.nextId == 'event') {
      // event
      this.loadEventManagementData();
    } else {
      // service
      this.loadServiceManagementData();
    }
  }

  loadEventManagementData() {
    // prepare filter paras
    const t_ = this.calculateNearAboutTime(Date.parse(this.modelTimeRange.time),
      this.eViewModal.filter.count, this.eViewModal.filter.type);
      this.getSideNav(t_.start,t_.end);
    const filter_ = {
      'startDate': t_.start,
      'endDate': t_.end,
      'host': this.modelTimeRange.host,
      'severity': this.eViewModal.filter.severity,
      'input_source': this.eViewModal.filter.inputSource
    };
    this.eventsService.getNearByEventManagementData(filter_).subscribe(res => {
      if (res.status == true) {
        this.eViewModal.rowData = res.data;
      }
    }, err => {

    });
    this.loadServiceManagementData();
  }

  calculateNearAboutTime(timeInMs, count, type) {
    console.log('calculateNearAboutTime : timeInMs :' + timeInMs + ' :count: ' + count + ' :type: ' + type);
    let ms = 0;
    switch (type) {
      case 'hour':
        ms = count * 1000 * 60 * 60;
        break;
      case 'min':
        ms = count * 1000 * 60;
        break;
      case 'sec':
        ms = count * 1000;
        break;
    }
    return { start: timeInMs - ms, end: timeInMs + ms };
  }

  loadServiceManagementData() {
    // prepare filter paras
    const t_ = this.calculateNearAboutTime(Date.parse(this.modelTimeRange.time)
      , this.sViewModal.filter.count, this.sViewModal.filter.type);
    const filter_ = {
      'startDate': t_.start,
      'endDate': t_.end,
      'type': this.sViewModal.tickettype,
      'host': this.modelTimeRange.host
    };
    this.eventsService.getNearByServiceRequestData(filter_).subscribe(res => {
      if(res.status == true){
        this.sViewModal.rowData = res.data;
      }
    }, err => {

    });
  }

  /**
   * Ramji code end
   */



  clickOnApplyTimeRange() {
    this.currentPagePopUp = 1;
    this.loading = true;
    this.callKpis();

  }
  resetAllFilterAndTags() {
    this.model.host = '';
    this.model.date_hour = '';
    this.model.date_mday = '';
    this.model.date_month = '';
    this.model.date_wday = '';
    this.model.date_year = '';
    this.model.alert_type = '';
    this.model.topevent = '';
    this.currentPagePopUp = 1;
  }
  currentHost;
  filterTagsearch = '';
  callKpis() {
    // this.getAllTags();
    
    // this.getEventDataParticularHostpopup(this.currentHost, this.model.date_hour, this.model.date_mday,
    //   this.model.date_month, this.model.date_wday, this.model.date_year, this.model.alert_type, this.model.topevent, this.currentPagePopUp,
    //   this.modelTimeRange.time, this.modelTimeRange.type, this.modelTimeRange.count, this.filterTagsearch);

    this.loadEventManagementData();
  }

  getEventDataParticularHostpopup(host, date_hour, date_mday, date_month,
    date_wday, date_year, alert_type, topevent, pageNumber,
    timeObj, type, countTime, filter) {
    if (this.allEventService) {
      this.allEventService.unsubscribe();
    }

    this.startLoading();
    this.eventsService.getEventsByTagsFilter(host, date_hour, date_mday, date_month, date_wday, date_year, alert_type, topevent, pageNumber, timeObj, type, countTime, filter).subscribe((res) => {
      if (res.Status) {
        this.mDataPopUp = res.Data;
        this.totalPagesPopUp = res.totalpage;
        this.initPagePopUp(pageNumber);
        this.completeLoading();
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, (err) => {
      this.completeLoading();
      this.loading = false;
    });
  }
  get_nearby_service_request() {
    this.eventsService.get_nearby_service_request('startDate', 'endDate', 'incident').subscribe((res) => {

    })
  }
  onChange() {
    this.currentPagePopUp = 1;
    this.loading = true;
    this.callKpis();
  }
  allTags;
  getAllTags() {
    this.eventsService.getAllTags(this.currentHost).subscribe((res) => {
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
  sideNav={
    "event":[],
    "service":[]
  }
  getSideNav(startDate,endDate) {

 this.eventsService.getSideNavEvent(startDate,endDate).subscribe((res) => {
        if (res.status) {
           this.sideNav.event=res.data;
        }
      }, (err) => {
        this.completeLoading();
         
      });
      this.eventsService.getSideNavService(startDate,endDate).subscribe((res) => {
        if (res.status) {
          this.sideNav.service=res.data;
        }
      }, (err) => {
        this.completeLoading();
         
      });
  }
  model = {
    'host': '',
    'date_hour': '',
    'date_mday': '',
    'date_month': '',
    'date_wday': '',
    'date_year': '',
    'alert_type': '',
    'topevent': ''
  }
  res;
  clickOnFilter(filter, subfilter) {
    if(filter=='event'){
      this.eViewModal.filter.inputSource=subfilter;
    }else{
      this.sViewModal.tickettype=subfilter;
    }
    
    this.callKpis();
  }

  clickOnFilterMenu(filter) {
    this.model.alert_type = '';
    this.model.topevent = filter.name;
    this.currentPagePopUp = 1;
    this.loading = true;
    this.callKpis();
  }
  actionformdataEvents = [];
  actionformdataManageEngine = [];
  actionformdataServiceNow = [];
  actionformdataMail = [];
  actionformdataEventsKeys = [];
  actionformdataManageEngineKeys = [];
  actionformdataServiceNowKeys = [];
  actionformdataMailKeys = [];
  typeIdList = [];
  getActionFormData(id) {
    this.actionformdataEvents = [];
    this.actionformdataManageEngine = [];
    this.actionformdataServiceNow = [];
    this.actionformdataMail = [];
    this.actionformdataEventsKeys = [];
    this.actionformdataManageEngineKeys = [];
    this.actionformdataServiceNowKeys = [];
    this.actionformdataMailKeys = [];
    this.typeIdList = [];
    this.eventsService.getActionFormData(id).subscribe((res) => {
      if (res) {
        this.completeLoading();
        this.actionformdataEvents = res.event;
        this.actionformdataManageEngine = res.manageengine_data;
        this.actionformdataServiceNow = res.servicenow_data;
        this.actionformdataMail = res.mail_data;
        this.actionformdataEventsKeys = Object.keys(this.actionformdataEvents);
        this.actionformdataManageEngineKeys = Object.keys(this.actionformdataManageEngine);
        this.actionformdataServiceNowKeys = Object.keys(this.actionformdataServiceNow);
        this.actionformdataMailKeys = Object.keys(this.actionformdataMail);
        this.typeIdList = res.type_code;
        this.str.ci = this.actionformdataEvents['Host'];
        this.str.subject = this.actionformdataEvents['Host'] + ' ' + this.actionformdataEvents['Service/Interface'] + ' ' + this.actionformdataEvents['Alarm Name'];
        this.str.desc = this.actionformdataEvents['Description'];
        this.modelSendMail.message = this.actionformdataEvents['Description'];
        this.modelSendMail.subject = this.str.subject;
      }
    }, (err) => {
      this.completeLoading();
    });
  }
  checkNull(item) {
    if (item == null || item == '') {
      return true;
    }
    return false;
  }
  checkName(name) {
    if (name == 'Incident') {
      return true;
    }
    return false;
  }
  checkIndex(index) {
    if (index == '0') {
      return true;
    }
    return false;
  }
  createIncident(type_id) {
    this.str.type_id = type_id;
    this.str.ci = this.actionformdataEvents['Host'];
    this.str.subject = this.actionformdataEvents['Host'] + ' ' + this.actionformdataEvents['Service/Interface'] + ' ' + this.actionformdataEvents['Alarm Name'];
    this.str.desc = this.actionformdataEvents['Description'];
    this.str.event_id = this.seleObj.code;
    this.str.state = this.actionformdataEvents['State'];
    this.createServiceDesksDetails();
  }

  public createServiceDesksDetails() {
    if (this.validateModel(['subject', 'ci', 'desc'], this.str)) {
      let formData: FormData = new FormData();
      formData.append('type_id', this.str.type_id);
      formData.append('subject', this.str.subject);
      formData.append('ci', this.str.ci);
      formData.append('state', this.str.state);
      formData.append('description', this.str.desc);
      formData.append('event_id', this.str.event_id);
      this.eventsService.executeAction(formData).subscribe((res) => {
        if (res.Status) {
          this.getActionFormData(this.str.event_id);
          this.clearAll();

          this.close();
          alert('Incident Created Successfully');
        } else {
          alert(res.msg);
        }
      }, (err) => {
      });
    }

  }

  modelSendMail = {
    'event_id': '',
    'type_id': '',
    'message': '',
    'subject': '',
    'to_addr_list': '',
    'isenrichment': false
  }
  modelSendSms = {
    'event_id': '',
    'type_id': '',
    'message': '',
    'numbers': ''
  }

  sendMailClick(type_id) {
    this.modelSendMail.type_id = type_id;
    this.modelSendMail.event_id = this.seleObj.code;
    if (this.modelSendMail.isenrichment === false) {
      this.sendMail();
    } else {
      this.sendMailWithEnrichment();
    }
  }


  public sendMail() {
    alert('Email sent');
    if (this.validateModel(['subject', 'to_addr_list', 'message'], this.modelSendMail)) {
      let formData: FormData = new FormData();
      formData.append('type_id', this.modelSendMail.type_id);
      formData.append('subject', this.modelSendMail.subject);
      formData.append('message', this.modelSendMail.message);
      formData.append('to_addr_list', this.modelSendMail.to_addr_list);
      formData.append('event_id', this.modelSendMail.event_id);
      this.eventsService.sendMail(formData).subscribe((res) => {
        if (res.Status) {
          this.getActionFormData(this.str.event_id);
          this.clearAll();

          this.close();
        } else {

        }
      }, (err) => {
      });
    }

  }

  public sendMailWithEnrichment() {
    alert('Email sent');
    if (this.validateModel(['subject', 'to_addr_list', 'message'], this.modelSendMail)) {
      let formData: FormData = new FormData();
      var host = this.gethostname(this.seleObj);
      formData.append('hostname', host);
      formData.append('subject', this.modelSendMail.subject);
      formData.append('to_addr_list', this.modelSendMail.to_addr_list);
      this.eventsService.sendMailWithEnrichment(formData).subscribe((res) => {
        if (res.Status) {
          this.getActionFormData(this.str.event_id);
          this.clearAll();
          this.close();
        } else {

        }
      }, (err) => {
      });
    }

  }
  sendSmsClick(type_id) {
    this.modelSendSms.type_id = type_id;
    this.modelSendSms.event_id = this.seleObj.code;
    document.getElementById('modalSendSmsId').click();
  }


  public sendSms() {
    if (this.validateModel(['numbers', 'message'], this.modelSendSms)) {
      let formData: FormData = new FormData();
      formData.append('type_id', this.modelSendSms.type_id);
      formData.append('numbers', this.modelSendSms.numbers);
      formData.append('message', this.modelSendSms.message);
      formData.append('event_id', this.modelSendSms.event_id);
      this.eventsService.sendSms(formData).subscribe((res) => {
        if (res.Status) {
          this.clearAll();
          this.close();
          alert(res.msg);
        } else {
          alert(res.msg);
        }
      }, (err) => {
      });
    }

  }

  showIncident() {
    this.getIncident(this.typeIdList['manageengine_data'], this.actionformdataManageEngine['Ticket No']);
  }


  public getIncident(typeid, workorderid) {
    this.startLoading();
    this.eventsService.getIncident(typeid, workorderid).subscribe((res) => {
      if (res.Status) {
        this.incidentData.incident_no = res.data['incident_no'];
        this.incidentData.incident_subject = res.data['incident_subject'];
        this.incidentData.incident_status = res.data['incident_status'];
        this.incidentData.incident_desc = res.data['incident_desc'];
        this.incidentData.incident_category = res.data['incident_category'];
        this.incidentData.incident_priority = res.data['incident_priority'];
        this.incidentData.incident_requestType = res.data['incident_requestType'];
        this.incidentData.incident_asset = res.data['incident_asset'];
        this.incidentData.incident_sla = res.data['incident_sla'];
        this.incidentData.incident_duebytime = res.data['incident_duebytime'];
        this.incidentData.incident_resolvedate = res.data['incident_resolvedate'];
        this.incidentData.incident_responseduebytime = res.data['incident_responseduebytime'];
        this.incidentData.incident_technician = res.data['incident_technician'];
        this.completeLoading();
        this.getallworklog(this.typeIdList['manageengine_data'], this.actionformdataManageEngine['Ticket No']);
        document.getElementById('modalViewIncidentId').click();
      }
    }, (err) => {
      this.completeLoading();
    });
  }
  workLogData = [];
  public getallworklog(typeid, workorderid) {
    this.workLogData = [];
    this.eventsService.getallworklog(typeid, workorderid).subscribe((res) => {
      if (res.Status) {
        this.workLogData = [];
        this.workLogData = res.data;
      }
    }, (err) => {
      this.completeLoading();
    });
  }




  breakLongText(str): Array<string> {
    var myStrToken: Array<string> = [];
    myStrToken = str.split('<br>');
    return myStrToken;
  }
  chackCritical(str) {
    if (str.indexOf('CRITICAL') < 0) {
      return false;
    }
    return true;
  }
  getColor() {
    return '#FF0000';
  }
  public addworklog() {
    let formData: FormData = new FormData();
    {
      let formData: FormData = new FormData();
      formData.append('workorderId', this.actionformdataManageEngine['Ticket No']);
      formData.append('type_id', this.typeIdList['manageengine_data']);
      formData.append('description', this.incidentData.reason_resolve);
      this.eventsService.addworklog(formData).subscribe((res) => {
        if (res.Status) {
          this.getallworklog(this.typeIdList['manageengine_data'], this.actionformdataManageEngine['Ticket No']);

          this.incidentData.reason_resolve = '';
          alert('worklog added successfully');
        } else {
          alert(res.msg);
        }
      }, (err) => {
      });

    }
  }

  public resolution() {
    let formData: FormData = new FormData();
    {
      let formData: FormData = new FormData();
      formData.append('workorderId', this.actionformdataManageEngine['Ticket No']);
      formData.append('type_id', this.typeIdList['manageengine_data']);
      formData.append('description', this.incidentData.reason_resolve);
      this.eventsService.resolution(formData).subscribe((res) => {
        if (res.Status) {
          this.incidentData.reason_resolve = '';
          alert('resolution created successfully');
        } else {
          alert(res.msg);
        }
      }, (err) => {
      });

    }
  }
  public getChildEvents(id) {
    this.mChildData.data = [];
    this.mChildData.headers = [];
    this.startLoading();
    this.eventsService.getChildEvents(id).subscribe((res) => {
      if (res.Status) {
        this.completeLoading();
        this.mChildData = res.data;
      }
    }, (err) => {
      this.completeLoading();
    });
  }
  siaReportData = { key: [], data: [] };
  getSIAReport(id) {
    this.loading = true;
    this.siaReportData.data = [];
    this.siaReportData.key = [];
    let formData: FormData = new FormData();
    formData.append('host', this.gethostname(this.seleObj));
    this.eventsService.getSIAReport(formData).subscribe((res) => {
      if (res.Status) {
        this.completeLoading();
        this.siaReportData.data = res.data;
        this.siaReportData.key = Object.keys(this.siaReportData.data[0]);
      }
      this.loading = false;
    }, (err) => {
      this.completeLoading();
      this.loading = false;
    });
  }
  // nodes: Node[] = [];
  // links: Link[] = [];
  jsonStr;
  public loading = true;
  niaerror: boolean = false;
  levelNia = 1;
  callLevel1() {
    this.levelNia = 1;


    // this.getGraphViewNia();
  }
  callLevel2() {
    this.levelNia = 2;

    // this.getGraphViewNia();
  }
  getGraphViewNia() {
    this.loading = true;
    // this.nodes = [];
    // this.links = [];
    var hostList = hostList = {
      'master_node': 'WMARDRADFS3K03N',
      'list': ['WMARDRADFS3K03N']
    };
    if (this.levelNia == 1) {
      hostList = {
        'master_node': this.gethostname(this.seleObj),
        'list': [this.gethostname(this.seleObj)]

      };
    } else {
      hostList = this.jsonStr['znodes_list'];;
    }
    this.niaerror = false;
    this.jsonStr = null;
    // this.nodeDataService.getNodesData(hostList).subscribe((res: {}) => {
    //   if (res['Status']) {
    //     // setTimeout(() => {
    //     this.jsonStr = res['data'];
    //     var nodeList = this.jsonStr['nodes'];
    //     var linksList = this.jsonStr['links'];
    //     for (var i = 0; i < nodeList.length; i++) {
    //       if (nodeList[i].type == 'host') {
    //         this.nodes.push(new Node(nodeList[i]));
    //       } else if (nodeList[i].type == 'master') {
    //         this.nodes.push(new Node(nodeList[i]));
    //       }
    //     }
    //     for (var i = 0; i < linksList.length; i++) {
    //       this.links.push(new Link(linksList[i].source, linksList[i].target));
    //     }
    //     this.loading = false;
    //     // }, 1000);

    //   } else {
    //     this.niaerror = true;
    //     this.loading = false;
    //   }

    // });
  }
  gethostname(obj) {
    // for (var i = 0; i < obj.Event.length; i++) {
    //   if (obj.Event[i].tag == "host_name") {
    //     return obj.Event[i].value;
    //   }
    // }
    return obj.host_name;
  }
  selectedTab;
  setSelectedTab($event: NgbTabChangeEvent) {
    this.selectedTab = $event.nextId;
    if (this.selectedTab === 'niaReportTab') {
    } else if (this.selectedTab === 'siaReportTab') {
      this.getSIAReport(this.seleObj.code);
    }
  }
  public clearAll() {
    this.str.subject = '';
    this.str.ci = '';
    this.str.desc = '';
  }
  ngAfterViewInit() {

  }

  getDate(timeStamp) {
    let x = timeStamp.split('T');
    return x[0];
  }
  getTime(timeStamp) {
    let x = timeStamp.split('T');
    let y = x[1].split('.');
    return y[0];
  }

  private modalRef: NgbModalRef;
  open(content) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openFullScreen(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'my-class' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openMidScreen(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'my-mid' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close() {
    this.modalRef.close();
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
  expandMenu(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    if (document.getElementById(value + '-content').style.display === 'block') {
      document.getElementById(value + '-content').style.display = 'none';
    } else {
      document.getElementById(value + '-content').style.display = 'block';
    }
  }


  typeOfEvent = 'event';
  numberOfDays = '1';
  @ViewChild('chartTargetPrediction') chartTargetPrediction: ElementRef;

  // chartPrediction: Highcharts.ChartObject;

  rangesPrediction = [
  ]
  prediction = [
  ]
  actual = [
  ]


  // createChartPrediction() {
  //   let series = [{
  //     name: 'Prediction',
  //     data: this.prediction,
  //     zIndex: 1,
  //     marker: {
  //       enabled: false
  //     }
  //   },
  //   {
  //     name: 'Actual',
  //     data: this.actual,
  //     zIndex: 1,
  //     marker: {
  //       enabled: false
  //     }
  //   }, {
  //     name: 'Range',
  //     data: this.rangesPrediction,
  //     type: 'arearange',
  //     lineWidth: 0,
  //     linkedTo: ':previous',
  //     color: Highcharts.getOptions().colors[0],
  //     fillOpacity: 0.3,
  //     zIndex: 0,
  //     marker: {
  //       enabled: false
  //     }
  //   }];
  //   this.chartPrediction = chart(this.chartTargetPrediction.nativeElement, {
  //     chart: {
  //       height: '12%'
  //     },
  //     title: {
  //       text: ''
  //     },

  //     xAxis: {
  //       type: 'datetime',

  //       visible: false
  //     },

  //     yAxis: {
  //       title: {
  //         text: null,
  //       },

  //       visible: false
  //     },

  //     tooltip: {
  //       crosshairs: true,
  //       shared: true,
  //     },

  //     legend: {
  //       enabled: false
  //     },

  //     series: series
  //   });
  //   this.chartloaded = true;
  // }
  chartloaded: boolean = false;
  msgText = 'chart will render here. Please select host.';
  areaRangeData = []
  getAnamolyData() {
    this.loading = true;
    this.eventsService.getAnomalyData(this.typeOfEvent, this.numberOfDays).subscribe((res) => {
      if (res['Status']) {

        // this.prediction=res['data']['Pridiction']
        // this.rangesPrediction=res['data']['Range']
        // this.actual=res['data']['Real']
        var data = res['data'];
        //  this.createChartPrediction();
        for (var i = 0; i < data.length; i++) {
          this.areaRangeData.push(
            {
              'date': new Date(data[i].Date),
              'displaydate': new Date(data[i].Date).toString(),
              'high': data[i].high,
              'actual': data[i].real,
              'low': data[i].low,
              'prediction': data[i].pridiction
            });
        }
      }
      this.loading = false;
    })
  }
  /** Download Reports start */
  exportReportData(event) {
    const params = {
      'skipHeader': false,
      'columnGroups': true,
      'skipGroups': false,
      'allColumns': true,
      'fileName': 'Report',
      'columnSeparator': ''
    };

    this.gridApi.exportDataAsCsv(params);
  }

  /** End Download Reports  */
}
