import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service';
import { EventsService } from 'src/app/modules_/events/events.service';

export interface DialogData {
  
}
@Component({
  selector: 'cats-view-sia',
  templateUrl: './view-sia.component.html',
  styleUrls: ['./view-sia.component.css']
})
export class ViewSiaComponent implements OnInit {
  onDialogOpened=new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService,
  private eventsService:EventsService
  ,public dialogRef: MatDialogRef<ViewSiaComponent>) { }
   
 dialogOpened(): void {
   this.onDialogOpened.emit(true);
 }

 ngOnInit() {
  //  this.dialogRef.updatePosition({right: `40px`});
    this.dialogOpened();
    this.getSIAReport(this.data['host_name']);
  }
  siaReportData =[];
loading:boolean=false;

  columnDefsSia=[{"headerName":"ExtraAttribute10","field":"ExtraAttribute10","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ExtraAttribute10","isActive":true},{"headerName":"SERVICENAME","field":"SERVICENAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"SERVICENAME","isActive":true},{"headerName":"Attribute_1","field":"Attribute_1","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"Attribute_1","isActive":true},{"headerName":"AEND_SITE","field":"AEND_SITE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AEND_SITE","isActive":true},{"headerName":"AEND_BUILDING","field":"AEND_BUILDING","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AEND_BUILDING","isActive":true},{"headerName":"AEND_SUBPLACE","field":"AEND_SUBPLACE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AEND_SUBPLACE","isActive":true},{"headerName":"AEND_PROVINCE","field":"AEND_PROVINCE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AEND_PROVINCE","isActive":true},{"headerName":"AEND_COUNTRY","field":"AEND_COUNTRY","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AEND_COUNTRY","isActive":true},{"headerName":"ZEND_SITE","field":"ZEND_SITE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZEND_SITE","isActive":true},{"headerName":"ZEND_BUILDING","field":"ZEND_BUILDING","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZEND_BUILDING","isActive":true},{"headerName":"ZEND_SUBPLACE","field":"ZEND_SUBPLACE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZEND_SUBPLACE","isActive":true},{"headerName":"ZEND_PROVINCE","field":"ZEND_PROVINCE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZEND_PROVINCE","isActive":true},{"headerName":"ZEND_COUNTRY","field":"ZEND_COUNTRY","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZEND_COUNTRY","isActive":true},{"headerName":"CUSTOMERNAME","field":"CUSTOMERNAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"CUSTOMERNAME","isActive":true},{"headerName":"SPEED","field":"SPEED","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"SPEED","isActive":true},{"headerName":"PROTECTIONSTATUS","field":"PROTECTIONSTATUS","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"PROTECTIONSTATUS","isActive":true},{"headerName":"PROTECTINGCIRCUIT","field":"PROTECTINGCIRCUIT","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"PROTECTINGCIRCUIT","isActive":true},{"headerName":"NODEALIASNAME","field":"NODEALIASNAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"NODEALIASNAME","isActive":true},{"headerName":"AENDALIASNAME","field":"AENDALIASNAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AENDALIASNAME","isActive":true},{"headerName":"ZENDALIASNAME","field":"ZENDALIASNAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZENDALIASNAME","isActive":true},{"headerName":"CRAMERCKTNAME","field":"CRAMERCKTNAME","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"CRAMERCKTNAME","isActive":true},{"headerName":"BANDWIDTH","field":"BANDWIDTH","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"BANDWIDTH","isActive":true},{"headerName":"AENDINTERFACETYPE","field":"AENDINTERFACETYPE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"AENDINTERFACETYPE","isActive":true},{"headerName":"ZENDINTERFACETYPE","field":"ZENDINTERFACETYPE","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"ZENDINTERFACETYPE","isActive":true},{"headerName":"CIRCUITBANDWIDTH","field":"CIRCUITBANDWIDTH","sortable":false,"editable":false,"minWidth":100,"filter":false,"resizable":true,"headerTooltip":"CIRCUITBANDWIDTH","isActive":true}];
  getSIAReport(id) {
    this.loading = true;
    this.isSiaLoaded=false;
  
    this.siaReportData = []; 
    // this.columnDefsSia=[];
  
    let formData: FormData = new FormData();
    formData.append("host", this.data['host_name']);
    this.eventsService.getSIAReport(formData).subscribe((res) => {
      if (res.Status) { 
        
        this.siaReportData = res.data; 
        this.generateColumnDefSia(Object.keys(this.siaReportData[0]));
  this.isSiaLoaded=true;
  
      }else{
        this.isSiaLoaded=true;
      }
      this.loading = false;
    }, (err) => { 
      
      this.loading = false;
    });
  }
  gridApiSia;
  gridParamsSia;
  gridColumnApiSia;
  paramsSia;
  isSiaLoaded:boolean=false;;
  onGridReadySia(params) {
    this.gridApiSia = params.api;
    this.gridParamsSia=params;
    this.gridColumnApiSia = params.columnApi;
    this.paramsSia=params;
    
    this.paramsSia.api.sizeColumnsToFit();
  
  }
  generateColumnDefSia(key){
    for(var i=0;i<key.length;i++){
      var column={
        headerName: key[i], 
        field: key[i], 
        sortable: false,
        editable: false,
        minWidth:100, 
        filter: false,
        resizable: true,
        headerTooltip:key[i],
        'isActive': true,
      };
      this.columnDefsSia.push(column);
      // this.paramsSia.api.sizeColumnsToFit();
    }
    console.log("sia keys"+JSON.stringify(this.columnDefsSia));
  
  }
  exportReportDataSia() {
    const params = {
      'skipHeader': false,
      'columnGroups': true,
      'skipGroups': false,
      'allColumns': true,
      'fileName': 'Report',
      'columnSeparator': ''
    };
  
    this.gridApiSia.exportDataAsCsv(params);
  }
}
