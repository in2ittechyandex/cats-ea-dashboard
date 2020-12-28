import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service';

export interface DialogData {
  
}
@Component({
  selector: 'cats-view-send-sms',
  templateUrl: './view-send-sms.component.html',
  styleUrls: ['./view-send-sms.component.css']
})
export class ViewSendSmsComponent implements OnInit {

  onDialogOpened=new EventEmitter();
  smsData={
    "ETA":"",
    "current":"",
    "temp":"",
    "contact":""
  }
  constructor(public dialogRef: MatDialogRef<ViewSendSmsComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService) {

   }
  dialogOpened(): void {
    this.onDialogOpened.emit(true);
  }
  noRecordFound:boolean=false;
  ngOnInit() {
    // this.dialogRef.updatePosition({right: `40px`});
        this.smsData={
      "ETA":"",
      "current":"",
      "temp":"",
      "contact":""
    }
    this.dialogOpened();
    if(this.data['ticket_no']==''){
      this.noRecordFound=false;
    }else{
      this.noRecordFound=true; 
    }
  }
  loading:boolean=false;
  sendNotification(){
    this.loading=true;
    var formData=new FormData();
    formData.append("ETA",this.smsData.ETA);
    formData.append("alarm_id",this.data['alarm_id']);
    formData.append("current",this.smsData.current);
    formData.append("temp",this.smsData['temp']);
    formData.append("contact",this.smsData['contact']);
    this.alarmService.sendNotification(formData).subscribe((res) => {
      if (res.Status) {
        alert('Notification sent successfully');
      } else {
        alert(res['msg']);
      }
      this.loading=false;
    }, (err) => {
      this.loading=false;
    });
  }
}
