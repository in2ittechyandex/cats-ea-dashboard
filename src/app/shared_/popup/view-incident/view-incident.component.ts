import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service';
import { EventsService } from 'src/app/modules_/events/events.service';
import { NgbModalRef, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from 'src/app/config/app.config';

export interface DialogData {
  
}
@Component({
  selector: 'cats-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.css']
})
export class ViewIncidentComponent implements OnInit {
  onDialogOpened=new EventEmitter(); 
    actionformdataManageEngine = [];
    actionformdataServiceNow = [];
    actionformdataMail = []; 
    actionformdataManageEngineKeys = [];
    actionformdataServiceNowKeys = [];
    actionformdataMailKeys = [];
    typeIdList = [];
    noRecordFound:boolean=true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService,
  private eventsService:EventsService,private modalService: NgbModal,public dialogRef: MatDialogRef<ViewIncidentComponent>
  ,public appConfig:AppConfig) {
     
  }
   
  dialogOpened(): void {
    this.onDialogOpened.emit(true);
  }
 
  ngOnInit() {
   this.dialogRef.updatePosition({right: `40px`});
    this.incidentData.reason_resolve='';  
    this.showCloserNotes=false;
    // this.getActionFormData(this.data['alarm_id'],'incident');
    this.data['ticket_no']="i-149071";
    this.showIncident(this.data['ticket_no']); 
    this.getIncidentStatus();
    this.getResolutionCode()
  }

getActionFormData(id,type) { 
  this.actionformdataManageEngine = [];
  this.actionformdataServiceNow = [];
  this.actionformdataMail = []; 
  this.actionformdataManageEngineKeys = [];
  this.actionformdataServiceNowKeys = [];
  this.actionformdataMailKeys = [];
  this.typeIdList = [];
  this.alarmService.getActionFormData(id,type).subscribe((res) => {
    if (res['Status']) { 
      if(type=='incident'){
         
        this.actionformdataManageEngine = res.data.manageengine_data;
        this.actionformdataServiceNow = res.data.servicenow_data;
        this.actionformdataMail = res.data.mail_data;
        this.actionformdataManageEngineKeys = Object.keys(this.actionformdataManageEngine);
        this.actionformdataServiceNowKeys = Object.keys(this.actionformdataServiceNow);
        if(this.actionformdataServiceNowKeys.length>0){
          this.noRecordFound=true;
        }else{
          this.noRecordFound=false;
        }
        this.actionformdataMailKeys = Object.keys(this.actionformdataMail);
        this.typeIdList = res.data.type_code; 
        // this.showIncident(); 
      }     
          
    }else{
   alert(res['data']);
    } 
    this.dialogOpened();
  }, (err) => {  
    this.dialogOpened();
  });
} 
showIncident(ticketId) {
  this.incidentData.reason_resolve='';  
  // document.getElementById("modalViewIncidentId1").click();
  this.getIncident(this.typeIdList['servicenow_data'], ticketId);
}
setSelectedTabWorklog(event){
  this.incidentData.reason_resolve='';  
  this.incidentData.reason_resolve="";
        this.resolutionCode.selected=""; 
        this.incidentStatus.selected="";
        this.showCloserNotes=false;
}
incidentData = {
  "Incident_Number": "",
    "incident_status": "",
    "Incident_Description": "",
    "Incident_Category": "",
    "Incident_Priority": "",
    "Approval": "",
    "Reopen_Count": "",
    "Incident_Type": "",
    "Resolved_By": "",
    "Resolved_At": "",
    "Incident_Opened_At": "",
    "Sys_Id": "",
    "Contact_Type": "",
    "Sys_Updated_by": "",
    "reason_resolve":""
};
incidentDetails;
incidentDetailsKey=[];
incidentDataReceived:boolean=false;

public getIncident(typeid, workorderid) {
  var ticketIds=workorderid.split('-');

  this.eventsService.getIncident('', ticketIds[1]).subscribe((res) => {
    if (res.status) {
      console.log("incident info received");
      this.incidentDetails=res.data;
      this.incidentDetailsKey=Object.keys(this.incidentDetails);
      this.incidentDataReceived=true;
      // this.getallworklog(this.typeIdList['servicenow_data'], this.actionformdataServiceNow['Sys Id']);
      this.getallworklog('', ticketIds[1]);
    }
    this.dialogOpened();
  }, (err) => {
    // this.completeLoading();
    this.dialogOpened();
  });
}
incidentStatus={
  data:[],
  selected:""
}
resolutionCode={
  data:[],
  selected:""
}
getIncidentStatus(){
  this.alarmService.getIncidentStatus().subscribe((res) => {
    if (res.status) {
       this.incidentStatus.data=res['data'];
    } 
  }, (err) => {  
  });
}
getResolutionCode(){
  this.alarmService.getResolutionCode().subscribe((res) => {
    if (res.status) {
       this.resolutionCode.data=res['data'];
    } 
  }, (err) => {  
  });
}
workLogData = [];
    public getallworklog(typeid, workorderid) {
      // this.loading=true;
      this.workLogData = [];
 
      // if(this.data['input_source']==='EMC NMS'){
        let incNumber = this.incidentDetails["Incident Number"]; // ramji old value :this.incidentDetails["Ticket Number"] 
        // let typeId = 'CATS' // typeid; //  ramji : passing static value 
        this.eventsService.getallworklogByIncidentId(typeid,workorderid).subscribe((res) => {
          if (res.status) {
            
            this.workLogData = [];
            // this.workLogData = res.data;
          }
          // this.loading=false;
        }, (err) => {
          // this.loading=false;
          // this.completeLoading();
        });
      // }else{
      //   this.eventsService.getallworklog(typeid, workorderid).subscribe((res) => {
      //     if (res.Status) {
            
      //       this.workLogData = [];
      //       this.workLogData = res.data;
      //     }
      //     // this.loading=false;
      //   }, (err) => {
      //     // this.loading=false;
      //     // this.completeLoading();
      //   });
      // }
      
    }

    public addworklog() {

      // if(this.data['input_source']==='EMC NMS'){
        var ticketIds=this.data['ticket_no'].split('-');
            let formData: FormData = new FormData(); 
            // formData.append("incident_id", this.incidentDetails["Ticket Number"]);

            // let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
            // formData.append("logged_user", loggedUser['userName']);
            formData.append("type_id", "vikas");
            formData.append("ticket_id", ticketIds[1]); // Ramji old value : "Ticket Number"
            formData.append("description", this.incidentData.reason_resolve); // Ramji  old value :"description"
            this.eventsService.addworklog(formData).subscribe((res) => {
              if (res.status) {
                this.getallworklog(this.typeIdList['servicenow_data'], ticketIds[1]);
      
                this.incidentData.reason_resolve = '';
                alert("worklog added successfully");
              } else {
                alert(res.msg);
              }
              // this.loading=false;
            }, (err) => {
              // this.loading=false;
            });
      
          
      
    // }else{
    //   let formData: FormData = new FormData();
    //   formData.append("sys_id", this.actionformdataServiceNow['Sys Id']);
    //   formData.append("type_id", this.typeIdList['servicenow_data']);
    //   formData.append("description", this.incidentData.reason_resolve);
    //   this.eventsService.addworklog(formData).subscribe((res) => {
    //     if (res.Status) {
    //       this.getallworklog(this.typeIdList['servicenow_data'], this.actionformdataServiceNow['Sys Id']);

    //       this.incidentData.reason_resolve = '';
    //       alert("worklog added successfully");
    //     } else {
    //       alert(res.msg);
    //     }
    //     // this.loading=false;
    //   }, (err) => {
    //     // this.loading=false;
    //   });
    //   }

  }
  checkDisable(){
    if(this.incidentStatus.selected!=''){
    const result = this.incidentStatus.data.find( ({ id }) => id === this.incidentStatus.selected );
        
       if(result['close note enable']){
         if(this.resolutionCode.selected=='' || this.incidentData.reason_resolve=='' || this.incidentStatus.selected==''){
           return true;
         }
       }else{
        if(this.incidentStatus.selected==''){
          return true;
        }
       }}else{
        return true;
       }
    return false;
  }
    public resolution() {
      // this.loading=true;
      let formData: FormData = new FormData();
      {
        let formData: FormData = new FormData();
        formData.append("sys_id", this.actionformdataServiceNow['Sys Id']);
        formData.append("type_id", this.typeIdList['servicenow_data']);
        const result = this.incidentStatus.data.find( ({ id }) => id === this.incidentStatus.selected );
        
       if(result['close note enable']){
        formData.append("close_note", this.incidentData.reason_resolve);
        formData.append("close_code", this.resolutionCode.selected);
       }else{
        this.incidentData.reason_resolve="";
        this.resolutionCode.selected="";
        formData.append("close_note", this.incidentData.reason_resolve);
        formData.append("close_code", this.resolutionCode.selected);
       }
        
        formData.append("state", this.incidentStatus.selected);
        // formData.append("workorderId", this.actionformdataManageEngine['Ticket No']);
        // formData.append("type_id", this.typeIdList['manageengine_data']);
        // formData.append("description", this.incidentData.reason_resolve);
        this.eventsService.resolution(formData).subscribe((res) => {
          if (res.Status) {
            this.incidentData.reason_resolve = '';
            this.incidentStatus.selected='';
            alert(res.msg);
            this.getIncident(this.typeIdList['servicenow_data'], this.actionformdataServiceNow['Ticket Number']);
          } else {
            alert(res.msg);
          }
          // this.loading=false;
        }, (err) => {
          // this.loading=false;
        });
  
      }
    }
    showCloserNotes:boolean=false;
    incidentStatusChange(){
       
       const result = this.incidentStatus.data.find( ({ id }) => id === this.incidentStatus.selected );
        
       if(result['close note enable']){
        this.showCloserNotes=true;
       }else{
        this.showCloserNotes=false;
       }
    }
    breakLongText(str): Array<string> {
      var myStrToken: Array<string> = [];
      myStrToken = str.split("<br>");
      return myStrToken;
    }




 
private modalRef: NgbModalRef;
closeResult: string;
     
    openFullScreen(content) {
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
} 
