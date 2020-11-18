import { Component, OnInit, ViewChild } from '@angular/core'; 
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap'; 
import { MyAlertsService } from './my-alerts.services';

@Component({
  selector: 'cats-my-alerts',
  templateUrl: './my-alerts.component.html',
  styleUrls: ['./my-alerts.component.css']
})
export class MyAlertsComponent implements OnInit {
  loading:boolean=false;
  chartData:Array<any>=[];
  isChartDataReceived:boolean=false;
  chartDataTopology:any;


  caseData = {
    caseId:'',
    caseStatus:"",
    network:"",
    time:"",
    tech:"",
    ticket_number:""
  };
  @ViewChild('tabs') public tabs:NgbTabset;
  constructor(private myAlertsService:MyAlertsService ) { 
    var currentCase=JSON.parse(localStorage.getItem('currentCase'));
    console.log(currentCase);
    if(currentCase!=undefined){
      this.caseData.caseId=currentCase['caseId'];
      this.caseData.caseStatus=currentCase['caseStatus'];
      this.caseData.network=currentCase['network'];
      this.caseData.time=currentCase['time'];
      this.caseData.tech=currentCase['tech'];
      this.caseData.ticket_number=currentCase['ticket_number'];
    }
     
  }
  
methodFromParent(data) {
  
}
 
  ngOnInit() { 
    this.selectedTab='alertsTab';
    this.getAlertList();
  }
  // public dbAllcolumns = [  
  //   {
  //     headerName: 'Action', 
  //     field: 'alert_id', 
  //     sortable: false,
  //     editable: false,
  //     minWidth:100,
  //     cellRenderer: "dataRenderer",
  //     filter: false,
  //     resizable: true,
  //     headerTooltip:'Action',
  //     'isActive': true,
  //   },
  //   { 
  //     headerName: 'Episode Id',
  //     field: 'situation_id', 
  //     sortable: true, 
  //     filter: true, 
  //     editable: false,
  //     resizable: true,
  //     headerTooltip:'Episode Id',
  //     minWidth:120,
  //     enableCellTextSelection:true,
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     },
  //     // cellRenderer:'dataRenderer'
  //   },{ 
  //     headerName: 'Host',
  //     field: 'host', 
  //     sortable: true, 
  //     filter: true, 
  //     editable: false,
  //     resizable: true,
  //     headerTooltip:'Host Name',
  //     minWidth:120,
  //     enableCellTextSelection:true,
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     },
  //     // cellRenderer:'dataRenderer'
  //   },
  //   { 
  //     headerName: 'Message', 
  //     field: 'message', 
  //     sortable: true, 
  //     filter: true, 
  //     editable: false,
  //     draggable:true,
  //     resizable: true,
  //     flex:1,
  //     minWidth:200,
  //     headerTooltip:'Message',
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     }, 
  //   },
  //   {
  //     headerName: 'State', 
  //     field: 'state', 
  //     sortable: true,
  //     // editable: false,
  //     filter: true,
  //     resizable: true,
  //     minWidth:120,
  //     headerTooltip:'State',
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     },
  //   } ,
  //   {
  //     headerName: 'Alarm Type', 
  //     field: 'alarm_type', 
  //     sortable: true,
  //     // editable: false,
  //     filter: true,
  //     resizable: true,
  //     minWidth:120,
  //     headerTooltip:'Alarm Type',
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     },
  //   },{ 
  //     headerName: 'Time',
  //     field: 'time', 
  //     sortable: true, 
  //     filter: true, 
  //     editable: false,
  //     resizable: true,
  //     headerTooltip:'Time',
  //     minWidth:120,
  //     enableCellTextSelection:true,
  //     'isActive': true,
  //     cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
  //     },
  //     // cellRenderer:'dataRenderer'
  //   }
  // ];
  alertList=[];
  timeLineAlertList=[];
  public gridObj = {
    timeLineAlertList:[],
    dbAllcolumns : [  
      // {
      //   headerName: 'Action', 
      //   field: 'alert_id', 
      //   sortable: false,
      //   editable: false,
      //   minWidth:100,
      //   cellRenderer: 'buttonRenderer',
      // cellRendererParams: {
      //   onClick: this.onBtnRemoveAlert.bind(this),
      //   label: 'See More',
      //   rendererType: 'button'
      // },
      //   filter: false,
      //   resizable: true,
      //   headerTooltip:'Action',
      //   'isActive': true,
      // },
      { 
        headerName: 'Episode Id',
        field: 'situation_id', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        headerTooltip:'Episode Id',
        minWidth:120,
        enableCellTextSelection:true,
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
        // cellRenderer:'dataRenderer'
      },{ 
        headerName: 'Host',
        field: 'host', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        headerTooltip:'Host Name',
        minWidth:120,
        enableCellTextSelection:true,
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
        // cellRenderer:'dataRenderer'
      },
      { 
        headerName: 'Message', 
        field: 'message', 
        sortable: true, 
        filter: true, 
        editable: false,
        draggable:true,
        resizable: true,
        flex:1,
        minWidth:200,
        headerTooltip:'Message',
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        }, 
      },
      {
        headerName: 'State', 
        field: 'state', 
        sortable: true,
        // editable: false,
        filter: true,
        resizable: true,
        minWidth:120,
        headerTooltip:'State',
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      } ,
      {
        headerName: 'Alarm Type', 
        field: 'alarm_type', 
        sortable: true,
        // editable: false,
        filter: true,
        resizable: true,
        minWidth:120,
        headerTooltip:'Alarm Type',
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },{ 
        headerName: 'Time',
        field: 'time', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        headerTooltip:'Time',
        minWidth:120,
        enableCellTextSelection:true,
        'isActive': true,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
        // cellRenderer:'dataRenderer'
      }
    ]

  }
  onBtnRemoveAlert(e) {
    // this.selectedEvent = e.rowData;
    // this.selectedEventKeys = Object.keys(this.selectedEvent);
    // if (this.selectedEvent) {
    //   this.getRawData(this.selectedEvent.code);
    // }

  }
  alartsLoading:boolean=false;
  getAlertList(){
    this.alartsLoading=true;
    this.myAlertsService.getAllAlertsInSituation(this.caseData.caseId).subscribe((res)=>{
      if(res['status']){
        this.gridObj.timeLineAlertList=res['data'];
      }
      this.alartsLoading=false;
    });
  }
   
  selectedTab;
    setSelectedTab($event: NgbTabChangeEvent) {
      this.selectedTab = $event.nextId;
      if(this.selectedTab=='topologyTab'){
       
      }else if(this.selectedTab=='timelineTab'){
         
      }

    }

    
  
    
}
