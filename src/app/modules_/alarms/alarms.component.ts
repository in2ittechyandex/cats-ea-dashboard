import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AlarmsService } from './alarms.service';
// import { PagerService } from '../../services_/pager.service';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../events/events.service';
// import { Link, Node } from '../d3';
// import { NodedataService } from '../nodedata.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import themeConf_ from '../../config/theme-settings';
import * as global from 'src/app/config/globals';
import pageSettings from '../../config/page-settings';
// import { CommonService } from 'src/app/services_/common.services';
import { MatCheckboxComponent } from '../aggridCommon/mat-checkbox.component';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
// import { chart } from "highcharts";
// import * as Highcharts from "highcharts";
// import { DataRenderedComponent } from '../aggridCommon/data-renderer.component';
import { keyboard } from '@amcharts/amcharts4/core';
// import { DatePipe } from '@angular/common';
// import { PopupService } from 'src/app/shared_/popup/popup.service';
import { NumberToDatePipe } from 'src/app/shared_/pipes_/number-to-date.pipe';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
import { PagerService } from 'src/app/shared_/pager.service';
import { CommonService } from 'src/app/common.service';
import swal from 'sweetalert2';
// import { TimeFilterService} from 'src/time-filter/time-filter.service.component';
declare var require: any;
// require('highcharts/highcharts-more')(Highcharts);
@Component({
  selector: 'cats-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css']
})
export class AlarmsComponent implements OnInit, OnDestroy {
  alarmList = [];
  loading: boolean = false;
  collapseChartPanel: boolean = true;
  public seleObj: any = {};
  public str = {
    type_id: '',
    subject: '',
    ci: '',
    desc: '',
    state: '',
    event_id: '',
    workOrderId: ''
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
  height = 180;
  type = 'msline';
  dataFormat = 'json';
  dataSource;
  nodeData = {
    'key': [],
    'data': []
  };
  linkData;
  results: any[] = [];
  queryField: FormControl = new FormControl();
  themeConf_;
  pageSettings;

  tableHeight = '510';

  public timeServicesSubsc$: Subscription;



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
      field: 'severity_',
      sortable: false,
      editable: false,
      minWidth: 70,
      cellRenderer: 'checkboxRenderer',
      filter: false,
      resizable: true,
      headerTooltip: 'Action',
      'isActive': true,
      valueGetter: function (params) {
        return params.data.severity;
      }
    },
    {
      headerName: 'Host Name',
      field: 'host_name',
      sortable: true,
      filter: true,
      editable: false,
      resizable: true,
      headerTooltip: 'Host Name',
      minWidth: 120,
      enableCellTextSelection: true,
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
      // cellRenderer:'dataRenderer'
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
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + params.value + '">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Severity',
      field: 'severity',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Severity',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Ticket Number',
      field: 'ticket_no',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Ticket Number',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Owner Name',
      field: 'name',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Owner Name',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Owner Email',
      field: 'email',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Owner Email',
      'isActive': false,
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
      minWidth: 120,
      resizable: true,
      headerTooltip: 'State',
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
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Alarm Name',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Count',
      field: 'count',
      sortable: true,
      editable: false,
      filter: 'agNumberColumnFilter',
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Count',
      'isActive': true,
      valueGetter: function (params) {
        const value = params.data.count;
        return (value == null) ? 0 : parseFloat(value);
      },
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
      headerName: 'Cause',
      field: 'root_cause',
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Cause',
      'isActive': false,
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
      resizable: true,
      minWidth: 120,
      headerTooltip: 'Interface',
      'isActive': false,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Last Occurrence',
      field: 'last_time',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Last Occurrence',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'First Occurrence',
      field: 'first_time',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'First Occurrence',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Input Source',
      field: 'input_source',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Input Source',
      'isActive': true,
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
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Alarm Type',
      'isActive': false,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },

    {
      headerName: 'Alarm Id',
      field: 'alarm_id',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Alarm Id',
      'isActive': true,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Signature',
      field: 'signature',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Signature',
      'isActive': false,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    },
    {
      headerName: 'Tech',
      field: 'tech',
      sortable: true,
      editable: false,
      filter: true,
      minWidth: 120,
      resizable: true,
      headerTooltip: 'Tech',
      'isActive': false,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    }
  ];
  secondsToRefresh: number = 60;
  timeLeft: number = 60;
  showMinimise: boolean = false;
  responseTime = 0;
  showCreateEpisode:boolean=false;
  constructor(
    // private nodeDataService:NodedataService,
    private commonService: CommonService,
    private eventsService: EventsService,
    private alarmService: AlarmsService,
    private modalService: NgbModal,
    private pagerService: PagerService,
    // private datePipe: DatePipe,
    // public popupService:PopupService,
    private numberToDatePipe_: NumberToDatePipe,
    private timeServices_: TimeFilterService
  ) {
    this.timeLeft = this.secondsToRefresh;
    this.dataSource = this.data;


    this.dropdownSettingsInputSource = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      showCheckbox: false
    };
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      this.currentPage = 1;
      this.onChangeTimeServices(obj);
    });
  }
  onChangeTimeServices(arg0: any): any {
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.startSchedular();
    } else {
      this.alarmLoading = true;
      this.getAlarms();
    }

  }
  isFirstTime: boolean = true;
  selectedAlarmList=[];
  onEventDetect(event) {
    const type = event['type'];
    const data = event['data'];
    const event_ = event['event']
    if (type == 'reload') {
      this.onReloadClick(event_);
    } else {
      this.handleMenuSelection(type, data);
    }
    if(type=="alarm-selected"){
      this.addOrDeleteAlarm(data);
      // console.log("Selected alarm "+JSON.stringify(this.selectedAlarmList));
    }
     
  }
  addOrDeleteAlarm(data){
    let isExist:boolean=false;
    let selectedindex=0;
    for(var i=0;i<this.selectedAlarmList.length;i++) {
      
      if(this.selectedAlarmList[i]['alarm_id']==data['alarm_id']){
        
        isExist=true;
        selectedindex=i;
      }
    }
    if(isExist){
      this.selectedAlarmList.splice(selectedindex,1);
      console.log("alarmId deleted "+data['alarm_id']);
    }else{
      this.selectedAlarmList.push(data);
      console.log("alarmId Added "+data['alarm_id']);
    }
    if(this.selectedAlarmList.length==0){
      this.showCreateEpisode=false;
    }else{
      this.showCreateEpisode=true;
    }
  }
  createEpisode(){
    swal({
      title: "Create Episode",
      text: "Enter episode name:",
      input: 'text',
      showCancelButton: true        
  }).then((result) => {
    if (result.value === "") {
      swal("You need to write something!");
      return false
    }
      if (result.value) {
        swal("Episode created successfully");
      }

  });
    
    // this.selectedAlarmList=[];
    // if(this.selectedAlarmList.length==0){
    //   this.showCreateEpisode=false;
    // }else{
    //   this.showCreateEpisode=true;
    // }
  }
  handleMenuSelection(menuselection: string, selectedRowObject) {
    console.log('ticket menu selection');
    // if (menuselection === 'View Alarm') {
    //   this.loading = true;
    //   this.popupService.open(selectedRowObject, menuselection).then(() => {
    //     this.loading = false;
    //   });

    // } else if (menuselection === 'View Incident') {
    //   this.loading = true;
    //   this.popupService.open(selectedRowObject, menuselection).then(() => {
    //     this.loading = false;
    //   });

    // } else if (menuselection === 'Assign To Me') {
    //   if (selectedRowObject['ticket_no'] == '') {
    //     this.assignAlarm(selectedRowObject);
    //   } else {
    //     alert('Ticket Already assigned');
    //   }
    // } else if (menuselection === 'Go to SIA') {
    //   this.loading = true;
    //   this.popupService.open(selectedRowObject, menuselection).then(() => {
    //     this.loading = false;
    //   });

    // } else if (menuselection === 'Go to NIA') {
    //   this.loading = true;
    //   this.popupService.open(selectedRowObject, menuselection).then(() => {
    //     this.loading = false;
    //   });

    // } else if (menuselection === 'Send SMS') {
    //   if (selectedRowObject['ticket_no'] != '') {
    //     this.loading = true;
    //     this.popupService.open(selectedRowObject, menuselection).then(() => {
    //       this.loading = false;
    //     });

    //   } else {
    //     alert('Create a Ticket First');
    //   }

    // } else if (menuselection === 'Send Mail') {
    //   if (selectedRowObject['ticket_no'] != '') {
    //     this.loading = true;
    //     this.popupService.open(selectedRowObject, menuselection).then(() => {
    //       this.loading = false;
    //     });
    //     this.popupService.onRefresh.subscribe((res) => {
    //       this.alarmLoading = true;
    //       this.getAlarms();
    //     })
    //   } else {
    //     alert('Create a Ticket First');
    //   }
    // }
  }

  getTokenizeArray(str: string) {
    return str.split(',');
  }

  onReloadClick(event) {
    this.timeLeft = this.secondsToRefresh;
    this.alarmLoading = true;
    this.getAlarms();
  }


  public subscription: Subscription;
  public startSchedular() {
    // this.scheduleTask();
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
  public scheduleTask() {
    this.getAlarms();
  }

  public stopSchedular() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.tableHeight = (window.innerHeight - 166).toString();
    this.getInputSourceList();
    this.initSearch();
    this.getEventStatusList();
    this.getEventStatus();


    // this.commonService.nodepanelCollapse.subscribe((flag:boolean)=>{
    //   console.log(flag);
    //   if(flag==false){
    //     this.chartShowing=true;
    //     this.tableHeight=(window.innerHeight-410).toString();
    //     this.getAnamolyData();
    //     // calc(100vh-314px)
    //   }else{
    //     this.chartShowing=false;
    //     this.tableHeight=(window.innerHeight-266).toString();
    //   }
    // })
    this.pageSettings = pageSettings;
    this.themeConf_ = themeConf_;
    // this.startSchedular();
    this.getAlarms();
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
  ngOnDestroy() {
    this.stopSchedular();
    this.timeServicesSubsc$.unsubscribe();
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
      this.hostName = result;
      this.eventsService.search_host(result).subscribe((res) => {

        if (res.status == true) {
          if (res.data.length > 0)
            this.results = res.data;
        }
      }, (err) => {
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
  hostName = '';
  searchCiFilter() {
    this.currentPage = 1;
    var id = '';
    if (this.queryField.value != '' && this.queryField.value != undefined) {
      if (this.results != undefined) {
        for (var i = 0; i < this.results.length; i++) {
          if (this.queryField.value == this.results[i].host) {
            id = this.results[i].host;
            // this.eventsService.eventtypeId = id;
            this.hostName = id;
          }
        }
      }
    } else {
      this.eventsService.eventtypeId = '';
      this.hostName = '';
    }
    this.currentPage = 1;
    this.alarmLoading = true;
    this.getAlarms();
  }
  inputSource = '';
  inputSourceChange() {
    this.inputSource = this.inputSource;
    this.currentPage = 1;
    this.alarmLoading = true;
    this.getAlarms();
  }
  filter = '';
  filterStatus = '';
  filterData() {
    this.filter = this.filter;
    this.filterStatus = this.filterStatus;
    this.currentPage = 1;
    this.alarmLoading = true;
    this.getAlarms();
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

        // <Array<any>>(res['msg']).forEach(element => {
        //   this.dropdownListInputSource[this.dropdownListInputSource.length] =  { item_id: element.name, item_text: element.name};
        // });
        this.dropdownListInputSource = [];
        // this.dropdownListInputSource.push({ item_id: "0", item_text: "All"});

        for (var i = 0; i < this.inputSourcecList.length; i++) {
          this.dropdownListInputSource.push({ item_id: (i + 1).toString(), item_text: this.inputSourcecList[i]['name'] });
        }

      } else {
        alert(res.msg);
      }
    }, (err) => {
    });
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
  getAllEventsChart() {

    this.alarmService.getAllEventsChart().subscribe((res) => {
      if (res.Status) {
        this.data.categories = res.data.categories;
        this.data.dataset = res.data.dataset;
        this.dataSource = this.data;

      } else {
        this.data.categories = res.data.categories;
        this.data.dataset = res.data.dataset;
        this.dataSource = this.data;
      }
    }, (err) => {
    });
  }

  alarmLoading: boolean = true;
  getAlarms() {
    // this.loading = true;
    const startTime: number = new Date().getTime(); var inputSourceListTemp = [];
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
    this.alarmService.getAllAlarms(this.currentPage,
      inputSourceListTemp, this.hostName, severityListTemp, statusListTemp,
      this.timeServices_.getstartDateInTimestamp(),
      this.timeServices_.getendDateInTimestamp()).subscribe((res) => {
        if (res.status == true) {
          const endTime: number = new Date().getTime();
          const diffTime = endTime - startTime;
          this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
          this.alarmList = res.data;
          this.totalPages = res.totalpage;
          this.initPage(this.currentPage);
          this.alarmLoading = false;

        } else {
          alert(res.msg);
          this.alarmLoading = false;
        }
      }, (err) => {
        this.alarmLoading = false;
      });
    this.timeRange = this.getHeaders(this.timeServices_.getstartDateInTimestamp(), this.timeServices_.getendDateInTimestamp());
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

    str += ')';

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

  ticket_no = '';
  owner_name = '';
  assignAlarm(selectedRowObject) {
    if (selectedRowObject['ticket_no'] == '') {
      this.loading = true;
      this.alarmService.assignAlarm(selectedRowObject['alarm_id'],
        selectedRowObject['message'],
        selectedRowObject['state'], selectedRowObject['input_source']).subscribe((res) => {
          if (res.Status) {

            alert(res['data']);
            // selectedRowObject['ticket_no']=res['msg']['ticket_no'];
            // selectedRowObject['name']=res['msg']['owner_name'];
            this.ticket_no = res['msg']['ticket_no'];
            this.owner_name = res['msg']['owner_name'];
            this.loading = false;
            this.alarmLoading = true;
            this.getAlarms();
          } else {
            alert(res['msg']);
            this.loading = false;
          }

        }, (err) => {
          this.loading = false;
        });
    } else {
      alert('ticket already assigned');
    }
  }

  breakLongText(str): Array<string> {
    var myStrToken: Array<string> = [];
    myStrToken = str.split('<br>');
    return myStrToken;
  }

  private modalRef: NgbModalRef;
  closeResult: string;
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
  openFullScreenLg(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'my-class-lg' });
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
  pager: any = {};
  pagedItems: any[];
  currentPage = 1;
  totalPages = 0;
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.currentPage = page;
    this.alarmLoading = true;
    this.getAlarms();
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


  typeOfEvent = 'alarm';
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
        //  console.log(JSON.stringify(this.areaRangeData));
      }
      this.loading = false;
    })
  }

}
