import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { DataRenderedComponent } from 'src/app/modules_/aggridCommon/data-renderer.component';
import { MatCheckboxComponent } from 'src/app/modules_/aggridCommon/mat-checkbox.component';
import { CommonExcelServiceService } from '../common-excel-service.service';
// import { PrintService } from '../print.service';
import { ButtonRendererComponent } from 'src/app/modules_/aggridCommon/button-renderer.component';

@Component({
  selector: 'cats-ag-grid-table',
  templateUrl: './ag-grid-table.component.html',
  styleUrls: ['./ag-grid-table.component.css']
})
export class AgGridTableComponent implements OnInit, OnChanges ,OnDestroy ,AfterViewInit{
  
  @Input() myGridId="myGrid"
  @Input() allowExports = true;
  @Input() allowCogs = true;
  @Input() showCreateEpisode:boolean=false;
  @Input() dbAllcolumns = [
    // {
    //   headerName: 'Action',
    //   field: 'severity_',
    //   sortable: false,
    //   editable: false,
    //   minWidth: 70,
    //   cellRenderer: "checkboxRenderer",
    //   filter: false,
    //   resizable: true,
    //   headerTooltip: 'Action',
    //   'isActive': true,
    //   valueGetter:function(params){
    //     return params.data.severity;
    //   }
    // },
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
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
      // resizable: true,
      headerTooltip: 'Tech',
      'isActive': false,
      cellRenderer: function (params) {
        return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">' + params.value + '</span>'
      },
    }
  ];

  @Input() rowData;
  @Input() actionButton: boolean = false;
  @Input() timeLeft = 60;
  @Input() tableHeight = '66'
  @Output() eventDetect = new EventEmitter();
  @Input() ticket_no = "";
  @Input() owner_name = "";
  @Input() responseTime=0;
  @Input() title="";
  @Input() timeZone="";
  @Input() customPagination:boolean =false;
@Input() timeRange="";
@Input() showSetting:boolean=true;
@Output() createEpisodeEventEmit=new EventEmitter()
  allFilters: { headerName: any; fieldName: any; filter: any[]; }[];

  ngOnChanges(changes: SimpleChanges) {
    var keys = Object.keys(changes);
    if (this.selectedRowObject) {
      if (keys.indexOf('ticket_no') >= 0) {
        let new_ticket_no = changes['ticket_no'].currentValue;
        this.selectedRowObject['ticket_no'] = new_ticket_no;
        console.log('ticket_no changed value to: ' + new_ticket_no);
      }
      if (keys.indexOf('owner_name') >= 0) {
        let new_owner_name = changes['owner_name'].currentValue;
        this.selectedRowObject['owner_name'] = new_owner_name;
        console.log('owner_name changed value to: ' + new_owner_name);
      }
    }
    // 

    // 
    // 
    // 

  }
  rightClickLeftMargin = 60;
  rightClickTopMargin = 180;
  public gridApi;
  public gridParams;
  public gridColumnApi;
  public columnDefs;
  public context;
  public defaultColDef;
  public frameworkComponents;
  recordCount = 0;
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
  constructor(
    private commonExcelService_: CommonExcelServiceService,
    // private printService: PrintService
    ) {
    

  }

  ngOnInit() { 
    this.columnDefs = this.getActiveColumns(this.dbAllcolumns);
    this.defaultColDef = {
      filter: true,
      editable: true,
      filterParams: {
        // debounceMs: 0,
        suppressAndOrCondition: true,
      }
    };
    this.frameworkComponents = {
      checkboxRenderer: MatCheckboxComponent,
      dataRenderer: DataRenderedComponent,
      buttonRenderer: ButtonRendererComponent,
    };
    this.context = { componentParent: this };
    this.allFilters = [];

    var timestring=new Date().toTimeString();
    var timeArray=timestring.split(' ');
    var newstr="";
    for(var i=1;i<timeArray.length;i++){
    newstr+=timeArray[i]+' ';
    }
    this.timeZone=' ( '+newstr+' )';
  }

  ngOnDestroy(): void {
    
  }
  ngAfterViewInit(){
    
  }

  getActiveColumns(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'];
    });
    return activeColumns;
  }
  
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridParams = params;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.recordCount=this.gridApi.getDisplayedRowCount();
    
  }
  rowDataChanged($event){ 
    if(this.gridApi){
      var model=JSON.parse(sessionStorage.getItem(this.title));
       this.gridApi.setFilterModel(model);
      
    }
  }

  onCellClicked(params) {

  }
  onReloadClick(event) {
    this.emitEvent("reload", this.selectedRowObject, event);
  }

  onDownloadClick(event) {
  }

  onHeaderModify(event) {
    this.isAllSelected();
  }
  methodFromParent(data, severity) {
    // console.log(data);
    // console.log(severity);


  }
  gridSizeChanged(event) {
    // this.isAllSelected();
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
  /**
   *  agGrid : custom pagination end
   */
  isAllSelected() {
    this.gridApi.setColumnDefs([]);
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setColumnDefs(this.getActiveColumns(this.dbAllcolumns));
    this.gridApi.sizeColumnsToFit();
  }
  /** Download Reports start */
  exportReportData(event) {
    const params = {
      'skipHeader': false,
      'columnGroups': true,
      'skipGroups': false,
      'allColumns': true,
      'fileName': this.getFileName(), 
      'customHeader': "Report Title : "+this.title.split(',').join(' ')+"\nTime Range : "+this.timeRange+ this.timeZone+ '\n',
      
      'columnSeparator': ''
    };
    
    params['columnKeys'] = this.getActiveColumnsForDownloadCsv(this.dbAllcolumns);
    this.gridApi.exportDataAsCsv(params);
  }
  getFileName(){
    var str=this.title.length < 50 ? this.title : this.title.slice(0, 50);
    var str1=str.split(',').join(' ');
    var str2=str1.split('.').join(' ');
    var str3=str2.split(':').join(' ');
    return str3;
    }

    //

   


  onExcelDownloadClick() {
    const items: Array<any> = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function(node) {
        items.push(node.data);
    });

    
     //

     this.commonExcelService_.generateAgGridExcel(this.getFileName(), this.getFileName() ,
     this.getActiveColumnsForDownload(this.dbAllcolumns), items ,["Report Title : "+this.title.split(',').join(' '),"Time Range : "+this.timeRange,this.timeZone]);

   
     
  }


  
  getActiveColumnsForDownload(columns_: Array<any>) {
    const activeColumns = columns_.filter(elm => {
      return elm['isActive'] && elm['headerName']!='Action';
    });
    console.log(JSON.stringify(activeColumns));
    // activeColumns.push({"headerName":"Raw Event","field":"rawdata","sortable":true,"editable":false,"filter":true,"headerTooltip":"Raw Event","resizable":true,"isActive":true,"minWidth":150});
    return activeColumns;
  }
  getActiveColumnsForDownloadCsv(columns_: Array<any>) {
    const activeColumns=[];
    
    columns_.forEach(elm => {
      if(elm['isActive'] && elm['headerName']!='Action'){
        activeColumns.push(elm['field']);
      }
    });
    console.log(JSON.stringify(activeColumns));
    // activeColumns.push("rawdata");
    return activeColumns;
  }
  clkOnPdfIcon(event) {
    this.printPdfForTable();
  }
  printPdfForTable() {
    let PDFfilterList = [];
    // this.allFilters.map(obj => {
    //   if (obj.filter.length > 0) {
    //     PDFfilterList.push(obj);
    //   }
    // });
    const headers = this.getActiveColumns(this.dbAllcolumns);
    console.log(JSON.stringify(headers));
    
    var rowData = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      var data = {};
      headers.forEach((header) => {
        data[header['field']] = rowNode.data[header['field']];
      });
      rowData.push(data);
    });
      // this.printService.setPrintConfig({
      //   headers: headers,
      //   data: rowData,
      //   reportTitle: this.title +this.timeRange +this.timeZone,
    
      //  pdfTitle: this.title,
      // customer: '',
      // customerPNG: '',
      //   rowCount: rowData.length,
      //  filterApplied: PDFfilterList,
      // });

      // this.printService
      // .printDocument('printreport', 'customer');
  }

  filterAccept(params) {
    const finalValue = this.getActiveColumns(this.dbAllcolumns).map(columnStruct => ({
      headerName: columnStruct.headerName,
      fieldName: columnStruct.field,
      filter: [],
      filterType: columnStruct.filter
    }));
    if(this.gridApi){
      var model = this.gridApi.getFilterModel();
      sessionStorage.setItem(this.title,JSON.stringify(model));
      console.log(JSON.stringify(model));
    }
    Object.keys(params.api.filterManager.allFilters).map(function (key) {
      const filtermanagerVal = params.api.filterManager.allFilters[key].filterPromise.resolution.appliedModel;
      if (filtermanagerVal != null) {
        if (filtermanagerVal.filterType == 'date') {
          if (filtermanagerVal.type == 'inRange') {
            finalValue.find(o => o.fieldName === key).filter = (filtermanagerVal.filterType == 'number') ?
            [{ 'value': filtermanagerVal.filter + '_' + filtermanagerVal.filterTo, 'type': filtermanagerVal.type }] :
            [{ 'value': filtermanagerVal.dateFrom + '_' + filtermanagerVal.dateTo, 'type': filtermanagerVal.type }];
          } else {
            finalValue.find(o => o.fieldName === key).filter =
            [{ 'value': filtermanagerVal.dateFrom, 'type': filtermanagerVal.type }];
          }

        } else if(filtermanagerVal.filterType == 'number') {
          if (filtermanagerVal.type == 'inRange') {
            finalValue.find(o => o.fieldName === key).filter = 
            [{ 'value': filtermanagerVal.filter + ' to ' + filtermanagerVal.filterTo, 'type': filtermanagerVal.type }] 
          } else {
            finalValue.find(o => o.fieldName === key).filter =
            [{ 'value': filtermanagerVal.filter, 'type': filtermanagerVal.type }];
          }
        } else {
          const filterV=finalValue.find(o => o.fieldName === key);
          filterV.filter =
          [{ 'value': filtermanagerVal.filter, 'type': filtermanagerVal.type }];
        }
      }
    });
    this.allFilters = finalValue;
  }
  showMenuOptions() {
    if (this.contextmenu) {

      if (this.selectedRowObject.input_source == "INALA" || this.selectedRowObject.input_source == "RFTS") {
        this.rightClickTopMargin = 180;
        return ['View Alarm', 'View Incident', 'Assign To Me', 'Send Mail', 'Send SMS', 'Go to SIA', 'Go to NIA'];
      } else {
        this.rightClickTopMargin = 130;
        return ['View Alarm', 'View Incident', 'Go to SIA', 'Go to NIA'];
      }
    }
  }
  selectedRowObject = null;
  contextmenu: boolean = false;
  contextmenuX = 0;
  contextmenuY = 0;


  //disables the menu
  disableContextMenu() {
    console.log("arjun disable menu");
    this.contextmenu = false;
  }
  onRightClick(event, params) {
    this.disableContextMenu();
    this.selectedRowObject = params;
    console.log("this.selectedRowObject.input_source  " + this.selectedRowObject.Input_Source)
    if (this.selectedRowObject.Input_Source == "INALA" || this.selectedRowObject.Input_Source == "RFTS") {
      this.rightClickTopMargin = 180;
    } else {
      this.rightClickTopMargin = 130;
    }

    this.contextmenuX = this.calTooltipCordX(event.clientX);
    this.contextmenuY = this.calTooltipCordY(event.screenY, event.clientY)
    this.contextmenu = true;
    console.log("arjun enable menu");
    // const menuHeight = this.showMenuOptions().length;
    // const maxY = this.innerHeight - ( menuHeight * 30);
    // if ( this.contextmenuY > maxY ) {
    //     this.contextmenuY = maxY;
    // }
  }
  public TootTipStr_ = {
    left: 0,
    top: 0,
    ddItems: [],
    reportId: 0,
    reportSequence: 0,
    open: false,
    clickedData: []
  };

  calTooltipCordY(scrY, ClientY) {
    const winHeight = window.innerHeight;
    const diff = winHeight - scrY;
    var top = (diff >= this.rightClickTopMargin) ? ClientY : (ClientY - (this.rightClickTopMargin));
    // if(this.chartShowing){
    //     top=(diff >= 250) ? ClientY : (ClientY - (250));
    // }else{
    //     top=(diff >= 250) ? ClientY : (ClientY - (250));
    // }

    return top;
  }

  calTooltipCordX(leftWidth) {
    const winWidth = window.innerWidth;

    const diff = winWidth - leftWidth;
    if (diff <= this.rightClickLeftMargin) {
      return (leftWidth - (this.rightClickLeftMargin - diff));
    } else {
      return leftWidth;
    }
  }
  onContextMenu(event) {
    return false;
  }
  handleMenuSelection(menuselection: string) {
    this.disableContextMenu();
    this.emitEvent(menuselection, this.selectedRowObject, "");
  }
  emitEvent(type, data, event) {


    this.eventDetect.emit({ 'type': type, 'data': data, 'event_': event });
  }
  alarmSelected(data){
    this.eventDetect.emit({ 'type': 'alarm-selected', 'data': data, 'event_': '' });
  }
  createEpisodeEvent(){
    this.createEpisodeEventEmit.emit();
  }
}
