import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service';
import { PrintService } from 'src/app/print.service';
import { NumberToDatePipe } from '../../pipes_/number-to-date.pipe'; 
import { TimeFilterService } from '../../time-filter/time-filter.service.component';

export interface DialogData {
  
}
@Component({
  selector: 'cats-view-alarm',
  templateUrl: './view-alarm.component.html',
  styleUrls: ['./view-alarm.component.css']
})
export class ViewAlarmComponent implements OnInit {
  onDialogOpened=new EventEmitter();
  actionformdataEvents = []; 
    actionformdataEventsKeys = []; 
    public dbAllcolumns =[
      {
        headerName: 'Host Name', 
        field: 'host_name', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Host Name',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { 
          
          return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      { 
        headerName: 'Description', 
        field: 'message', 
        sortable: true, 
        filter: true, 
        editable: false,
        draggable:true,
        resizable: true,
        flex:1,
        minWidth:200,
        headerTooltip:'Description',
        cellRenderer: function (params) { 
         
          return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;" title="' + params.value + '">'+params.value+'</span>'
        },
    'isActive': true,
      },
      {
        headerName: 'Severity', 
        field: 'severity', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Severity',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      
      {
        headerName: 'Interface', 
        field: 'interface', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Interface',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'Input Source', 
        field: 'input_source', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Input Source',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'State', 
        field: 'state', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'State',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'Alarm Name', 
        field: 'alarm_name', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Alarm Name',
        resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'Alarm Type', 
        field: 'alarm_type', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Alarm Type',
        // resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'Location', 
        field: 'location', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        minWidth:120,
        headerTooltip:'Location',
        'isActive': false,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      {
        headerName: 'Tech', 
        field: 'tech', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Tech',
        // resizable: true,
        'isActive': true,
        minWidth:100,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
      
      {
        headerName: 'First Occurance', 
        field: 'first_time', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'First Occurance',
        // resizable: true,
        'isActive': true,
        minWidth:120,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },{
        headerName: 'Last Occurance', 
        field: 'last_time', 
        sortable: true,
        editable: false,
        filter: true,
        headerTooltip:'Last Occurance',
        // resizable: true,
        'isActive': true,
        minWidth:120,
        cellRenderer: function (params) { return '<span style="user-select: initial;-moz-user-select: text;-ms-user-select: text;-webkit-user-select: text;">'+params.value+'</span>'
        },
      },
    ];
    alarmChildEvent;
    tableHeight="400";
   // timeRange="";
   //timeZone="";
  responseTime=0;
  showSetting:boolean=false;
  title="Child Events";
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public printService:PrintService,private alarmService:AlarmsService
  ,public dialogRef: MatDialogRef<ViewAlarmComponent>,private numberToDatePipe_: NumberToDatePipe,private timeServices_:TimeFilterService) { }
  // constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService
  // ,public dialogRef: MatDialogRef<ViewAlarmComponent>,private numberToDatePipe_: NumberToDatePipe) { }
   
  dialogOpened(): void {
    this.onDialogOpened.emit(true);
  }
 
  ngOnInit() {
    this.dialogRef.updatePosition({right: `1%`});
    this.getActionFormData(this.data['alarm_id'],'alarm');
    this.getalarmtotal_pop(this.data['alarm_id']);


/*
    var timestring=new Date().toTimeString();
    var timeArray=timestring.split(' ');
    var newstr="";
    for(var i=1;i<timeArray.length;i++){
    newstr+=timeArray[i]+' ';
    }
   // this.timeZone=' ( '+newstr+' )';*/
  }

  eventChildData=[];
  getalarmtotal_pop(id) {
    // id="KVvJa3MB_0W5-psRyDFU"
  this.actionformdataEvents = []; 
  this.actionformdataEventsKeys = [];  
  const startTime: number = new Date().getTime();
  this.alarmService.getalarmtotal_pop(id).subscribe((res) => {
    if (res['status']) {  
          // this.eventChildData = res.data.event; 
          const endTime: number = new Date().getTime();
          const diffTime = endTime - startTime;
          this.responseTime = this.numberToDatePipe_.transform(diffTime, 'ms');
          this.alarmChildEvent=res.data;
         this.title=this.title+" - "+this.data['host_name'];
    }else{
   alert(res['data']);
    } 

    
  }, (err) => {  
  });

  
//

  this.timeRange=this.getHeaders(this.timeServices_.getstartDateInTimestamp(),this.timeServices_.getendDateInTimestamp());

}
timeRange="";

getHeaders(startDate,endDate) {
  const startTime = startDate;
  const endTime = endDate;
  let str = '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const myDateStart = new Date(startTime);
  const myDateEnd = new Date(endTime);
  str += '';

    str += this.getDatePart(myDateStart)['full'] + ' - ' + this.getDatePart(myDateEnd)['full'];
 
  str +=  '';
  
  

return str;
  
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


//



onEventDetect(event){
  const type=event['type'];
  const data=event['data'];
  const event_=event['event']
  if(type=='reload'){
    this.getalarmtotal_pop(this.data['alarm_id']);
  } 
}
getActionFormData(id,type) {
  this.actionformdataEvents = []; 
  this.actionformdataEventsKeys = [];  
  this.alarmService.getActionFormData(id,type).subscribe((res) => {
    if (res['status']) { 
      if(type=='alarm'){
       
          this.actionformdataEvents = res.data.event;
          this.actionformdataEventsKeys = Object.keys(this.actionformdataEvents); 
          this.getDeviceInfoData(this.actionformdataEvents['Host']);
      }     
          
    }else{
   alert(res['data']);
    } 
    this.dialogOpened();
  }, (err) => {  
    this.dialogOpened();
  });
}

deviceInfoData;
getDeviceInfoData(id) {   
  this.alarmService.getDeviceInfoData("172.16.17.25").subscribe((res) => {
    if (res['status']) {  
      this.deviceInfoData=res['data'];
          // this.actionformdataEvents = res.data.event;
          // this.actionformdataEventsKeys = Object.keys(this.actionformdataEvents); 
          
          
    }else{
   alert(res['data']);
    } 
    this.dialogOpened();
  }, (err) => {  
    this.dialogOpened();
  });
}

}
