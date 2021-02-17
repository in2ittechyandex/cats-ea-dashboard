import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service';
import { DatePipe } from '@angular/common';

export interface DialogData {
  
}
@Component({
  selector: 'cats-view-send-mail',
  templateUrl: './view-send-mail.component.html',
  styleUrls: ['./view-send-mail.component.css']
})
export class ViewSendMailComponent implements OnInit {

  onDialogOpened=new EventEmitter();
  onRefresh=new EventEmitter();
  selectedRowObject;
  constructor(private datePipe:DatePipe,@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService  ,public dialogRef: MatDialogRef<ViewSendMailComponent>) { 
    this.selectedRowObject=data;
  }
   
  dialogOpened(): void {
    this.onDialogOpened.emit(true);
  }
  refresh(){
    this.onRefresh.emit(true);
  }
 noRecordFound:boolean=false;
  ngOnInit() {
    // this.dialogRef.updatePosition({right: `40px`});
    
  console.log("ashhgaskjkjda jkasgfbasjc jssjcs acascas csic as"+this.selectedRowObject['ticket_no']);
    this.getResolutionCode();
    this.getIncidentStatus();

    if(this.selectedRowObject['ticket_no']==''){
      this.noRecordFound=false;
    }else{
      this.noRecordFound=true;
      this.getNotificationInfo(this.selectedRowObject['ticket_no']);
      
    }
    
  }
  update_notification_time="";
getNotificationInfo(id){
  this.alarmService.getNotificationInfo(id).subscribe((res) => {
    if (res.status) {
      var data=res['data']
        var datakeys=Object.keys(data);
        if(datakeys.length>0){
          this.update_notification_time=data['update_notification_time'];
        }
        this.dialogOpened();
        this.clickOnSendNotification();
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
    // this.completeLoading();
  });
}
  enableResolutionTab:boolean=true;
clickOnSendNotification(){
  this.resetNotificationPopup();
this.modelSendMail.to_addr_list='';
  this.notificationAlarmData["Site Name"]=this.selectedRowObject['host_name'];
    this.notificationAlarmData["Date and Time Triggered"]=this.selectedRowObject['first_time'];
    this.notificationAlarmData["Alarms Triggered"]=this.selectedRowObject["message"];
    this.notificationAlarmData["Alarm Status"]=this.selectedRowObject["state"];
    this.notificationAlarmData["Escalated To (FST/Vendor)"]="";
    this.notificationAlarmData["Method of Notification"]="Email";
    this.notificationAlarmData["Noc Ref Number"]="";
    this.notificationAlarmData["Incident Number"]=this.selectedRowObject["ticket_no"];
    this.notificationAlarmData["Case Opened By"]=this.selectedRowObject["name"];
    this.notificationAlarmData["NMS IP"]="";
    this.notificationAlarmData["StackCode"]="";
    this.notificationAlarmData["Initial Fault Analysis"]=this.selectedRowObject["alarm_name"];
    this.notificationAlarmData["Sender"]="vikas"//this.alarmService.getUser().userName;
    this.notificationAlarmData["Comments"]="";

    this.updateAlarmData["Site Name"]=this.selectedRowObject['host_name'];
    this.updateAlarmData["Date and Time Triggered"]=this.selectedRowObject['first_time'];
    this.updateAlarmData["Date and Time of Update"]=this.datePipe.transform( new Date().toString(),"dd-MM-yyyy hh:mm:ss");
    this.updateAlarmData["Alarms Triggered"]=this.selectedRowObject['message'];
    this.updateAlarmData["Alarm Status"]=this.selectedRowObject['state'];
    this.updateAlarmData["UNoc Case Number"]=this.selectedRowObject['ticket_no'];
    this.updateAlarmData["Case Updated By"]="vikas"//this.alarmService.getUser().userName;
    this.updateAlarmData["Current Battery Voltage"]='';
    this.updateAlarmData["Current Site Temperature"]='';
    this.updateAlarmData["DG deployed"]="NO";
    
    this.updateAlarmData["Deployment Date/Time"]=this.update_notification_time;
    if(this.updateAlarmData["Deployment Date/Time"]!=""){
      this.updateAlarmData["DG deployed"]="YES";
    }
    this.updateAlarmData["Sender"]="vikas"//this.alarmService.getUser().userName;
    this.updateAlarmData["Comments"]=""

    this.resolutionAlarmData["Site Name"]=this.selectedRowObject['host_name'];
    this.resolutionAlarmData["Date and Time Triggered"]=this.selectedRowObject['first_time'];
    this.resolutionAlarmData["Date and Time Cleared"]=this.selectedRowObject['last_time'];
    this.resolutionAlarmData["Alarm Status"]=this.selectedRowObject['state'];
    if(this.selectedRowObject['state']=="CLEAR" || this.selectedRowObject['state']=="clear"){
      this.enableResolutionTab=false;
    }else{
      this.enableResolutionTab=true;
    }
    this.resolutionAlarmData["UNoc Case Number"]=this.selectedRowObject['ticket_no'];
    this.resolutionAlarmData["Case Closed By"]="vikas"//this.alarmService.getUser().userName;
    var str=this.selectedRowObject['first_time']; 
    var dt  = str.split(/\-|\s/);
  var  firstDate = new Date(dt.slice(0,3).reverse().join('/')+' '+dt[3]);
      
     str=this.selectedRowObject['last_time'];
       dt  = str.split(/\-|\s/);
  var  lastDate = new Date(dt.slice(0,3).reverse().join('/')+' '+dt[3]);
     
     var dif=Number(lastDate)-Number(firstDate);

    this.resolutionAlarmData["Period"]=this.toHHMMSS(dif);//((dif/ 60 / 60 / 1000).toFixed(2)).toString()+' Hr',
    this.resolutionAlarmData["DG Deployed Date/Time"]=this.update_notification_time;
     if(this.resolutionAlarmData["DG Deployed Date/Time"]!=""){
      this.resolutionAlarmData["DG recovered Date/Time"]=this.datePipe.transform( 
        new Date().toString(),"dd-MM-yyyy hh:mm:ss");

        
         
     }
     var str1=this.update_notification_time;
        var dt1 = str1.split(/\-|\s/);
       
        var firstDate1 =  new Date(dt1.slice(0,3).reverse().join('/')+' '+dt1[3]);
       
         str1=this.datePipe.transform( 
          new Date().toString(),"dd-MM-yyyy hh:mm:ss");
         dt1= str1.split(/\-|\s/);
         var  lastDate1= new Date(dt1.slice(0,3).reverse().join('/')+' '+dt1[3]);
         var dif1=Number(lastDate1)-Number(firstDate1);

   
   
    this.resolutionAlarmData["DG fuel supplied"]="";
    this.resolutionAlarmData["DG Deployed duration"]=this.toHHMMSS(dif1);
    this.resolutionAlarmData["Sender"]="vikas"//this.alarmService.getUser().userName;
    this.resolutionCode.selected="";
    this.resolutionAlarmData["Comments"]="";
    // this.notificationAlarmData.email_order_list=this.listOfEmail;
    //   this.updateAlarmData.email_order_list=this.listOfEmail;
    //   this.notificationAlarmData.email_order_list=this.listOfEmail;
 
}
// toHHMMSS = (secs) => {
//   var sec_num = parseInt(secs, 10)
//   var hours   = Math.floor(sec_num / 3600)
//   var minutes = Math.floor(sec_num / 60) % 60
//   var seconds = sec_num % 60
// var hourStr:string=(hours<=1)?' Hour ':' Hours ';
// var minuteStr:string=(minutes<=1)?' Minute ':' Minutes ';
// var secondStr:string=(seconds<=1)?' Second ':' Seconds ';
//   return ((hours===0)?'0':hours)+hourStr+
//   ((minutes===0)?'0':minutes)+minuteStr+
//   ((seconds===0)?'0':seconds)+secondStr;
// }

toHHMMSS = (ms) => {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  var pad = function (n) { return n < 10 ? '0' + n : n; };
   var days   = d;
  var hours   = pad(h);
  var minutes = pad(m);
  var seconds = pad(s);
  
  var dayStr=(days<=1)?' Day ':' Days ';
  var hourStr=(hours<=1)?' Hour ':' Hours ';
  var minuteStr=(minutes<=1)?'Minute':' Minutes ';
  var secondStr=(seconds<=1)?' Second ':' Seconds ';
  
  
  var result;
  result= days + dayStr + hours + hourStr +
  minutes+ minuteStr + seconds + secondStr;
  if(days==0){
   result= hours + hourStr +
  minutes+ minuteStr + seconds + secondStr;
  }
  if(hours==0){
   result= minutes+ minuteStr + seconds + secondStr;
  }
  if(minutes==0){
   result=  seconds + secondStr;
  }   
  return result;
}
checkForResolution(){
  if(this.resolutionCode.selected=='' || this.resolutionAlarmData.Comments==''){
    return true;
  }
  return false;
}
getTokenizeArray(str:string){
   return str.split(',');
}
getTokenizeArray2(str1:string){
  return str1.split(',');
}

listOfEmail="";
loading:boolean=false;
getEmailLlist(){
  this.alarmService.getEmailLlist().subscribe((res) => {
    if (res.Status) {
      this.listOfEmail=res['Data'].join(';');
      
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
    // this.completeLoading();
  });
}
notificationAlarmData={
  "table_header":"Alarm Fault Notification",
"Site Name":'',
"Date and Time Triggered":'',
"Alarms Triggered":'',
"Alarm Status":'',
"Escalated To (FST/Vendor)":"",
"Method of Notification":"Email",
"Noc Ref Number":"",
"Incident Number":'',
"Case Opened By":'',
"NMS IP":"",
"StackCode":"",
"Initial Fault Analysis":"",
"Comments":"",
"email_order_list":"",
"Sender":""
}
updateAlarmData={
  "table_header":"Alarm Fault Update",
  "Site Name":'',
  "Date and Time Triggered":'',
  "Date and Time of Update":'',
  "Alarms Triggered":'',
  "Alarm Status":"",
  "UNoc Case Number":"Email",
  "Case Updated By":"",
  "Current Battery Voltage":'',
  "Current Site Temperature":'',
  "DG deployed":"NO",
  "Deployment Date/Time":null, 
  "Comments":"",
  "email_order_list":"",
  "Sender":""
}
resolutionAlarmData={
  "table_header":"Alarm Fault Resolution",
  "Site Name":'',
  "Date and Time Triggered":'',
  "Date and Time Cleared":'', 
  "Alarm Status":"",
  "UNoc Case Number":"Email",
  "Case Closed By":"",
  "Period":'',
  "DG Deployed Date/Time":'',
  "DG recovered Date/Time":"",
  "DG fuel supplied":"",
  "DG Deployed duration":"", 
  "Comments":"",
  "email_order_list":"",
  "Sender":""
}

resetNotificationPopup(){
  this.notificationAlarmData={
    "table_header":"Alarm Fault Notification",
  "Site Name":'',
  "Date and Time Triggered":'',
  "Alarms Triggered":'',
  "Alarm Status":'',
  "Escalated To (FST/Vendor)":"",
  "Method of Notification":"Email",
  "Noc Ref Number":"",
  "Incident Number":'',
  "Case Opened By":'',
  "NMS IP":"",
  "StackCode":"",
  "Initial Fault Analysis":"",
  "Comments":"",
  "email_order_list":"",
  "Sender":""
  }
  this.updateAlarmData={
    "table_header":"Alarm Fault Update",
    "Site Name":'',
    "Date and Time Triggered":'',
    "Date and Time of Update":'',
    "Alarms Triggered":'',
    "Alarm Status":"",
    "UNoc Case Number":"Email",
    "Case Updated By":"",
    "Current Battery Voltage":'',
    "Current Site Temperature":'',
    "DG deployed":"NO",
    "Deployment Date/Time":null, 
    "Comments":"",
    "email_order_list":"",
    "Sender":""
  }
  this.resolutionAlarmData={
    "table_header":"Alarm Fault Resolution",
    "Site Name":'',
    "Date and Time Triggered":'',
    "Date and Time Cleared":'', 
    "Alarm Status":"",
    "UNoc Case Number":"Email",
    "Case Closed By":"",
    "Period":'',
    "DG Deployed Date/Time":'',
    "DG recovered Date/Time":"",
    "DG fuel supplied":"",
    "DG Deployed duration":"", 
    "Comments":"",
    "email_order_list":"",
    "Sender":""
  }
}
modelSendMail={'to_addr_list':''}
sendMail(){
  this.loading=true; 
    
  
  var ticketIds=this.selectedRowObject['ticket_no'].split('-');
    console.log("send mail");
  var formData=new FormData();
  formData.append("alarm_info",JSON.stringify(this.notificationAlarmData));
  formData.append("alarm_id",this.selectedRowObject['alarm_id']);
  formData.append("email_id",this.notificationAlarmData.email_order_list);
  formData.append("ticket_no",ticketIds[1]); 
  formData.append("notification_sent_time",this.datePipe.transform(new Date().toString(),"dd-MM-yyyy hh:mm:ss"));
  formData.append("initial_fault_analysis",this.selectedRowObject['alarm_name']); 
  this.alarmService.sendMail(formData).subscribe((res) => {
    if (res.status) {
      alert('Mail sent successfully');
      // this.close();
    } else {
      alert(res['msg']);
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
  });
}
onDgDeployed(){
  console.log("selected ="+this.updateAlarmData["DG deployed"]);
if(this.updateAlarmData["DG deployed"]=='YES'){
  var date=this.datePipe.transform( 
      new Date().toString(),"dd-MM-yyyy hh:mm:ss");
  // var  temp=date;
  // temp=temp.replace('T',' ');
  // var str=temp.split('.'); 
  this.updateAlarmData["Deployment Date/Time"]=date;
  // this.resolutionAlarmData["DG Deployed Date/Time"]=this.updateAlarmData["Deployment Date/Time"];
}else{
  this.updateAlarmData["Deployment Date/Time"]="";
}
  
}
onStartDateChange(event){
  this.updateAlarmData["Deployment Date/Time"]=event.date;
        console.log("selected date="+event.date); 
        this.resolutionAlarmData["DG Deployed Date/Time"]=this.updateAlarmData["Deployment Date/Time"];
}
onStartDateChangeResolution(event){
  this.resolutionAlarmData['DG recovered Date/Time']=event.date;
        console.log("selected date Resolution="+event.date);
        
}
updateNotification(){
  
    
    
    console.log("send mail");
    // "4/15/2020, 4:55:43 PM"
    // new Date(.toLocaleString();
    // var date=this.datePipe.transform( 
    //   new Date(this.updateAlarmData["Deployment Date/Time"]).toString(),"dd-MM-yyyy hh:mm:ss");
    // console.log(date);
    // var temp:string=date;
    // temp=temp.replace('/','-');
    // temp=temp.replace('/','-');
    // // var str=temp.split('.');
    // // console.log("Deployment Date/Time"+str[0]);
    // this.updateAlarmData["Deployment Date/Time"]=temp;
    var ticketIds=this.selectedRowObject['ticket_no'].split('-');
  var formData=new FormData();
  formData.append("alarm_info",JSON.stringify(this.updateAlarmData));
  formData.append("alarm_id",this.selectedRowObject['alarm_id']);
  formData.append("email_id",this.updateAlarmData.email_order_list);
  formData.append("ticket_no",ticketIds[1]); 
  formData.append("update_notification_time",this.updateAlarmData["Deployment Date/Time"]);
  formData.append("initial_fault_analysis",this.selectedRowObject['alarm_name']); 
  this.loading=true; 
  this.alarmService.sendMail(formData).subscribe((res) => {
    if (res.Status) {
      this.resolutionAlarmData["DG Deployed Date/Time"]=this.updateAlarmData["Deployment Date/Time"];
      if(this.resolutionAlarmData["DG Deployed Date/Time"]!=""){
        this.resolutionAlarmData["DG recovered Date/Time"]=this.datePipe.transform( 
          new Date().toString(),"dd-MM-yyyy hh:mm:ss");
       }
      //  this.alarmLoading=true;
      //  this.getAlarms();
      this.refresh();
      alert('Mail sent successfully');
      // this.close();


    } else {
      alert(res['msg']);
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
  });
}
resolutionMail(){
  this.loading=true; 
  console.log("send mail");
  var ticketIds=this.selectedRowObject['ticket_no'].split('-');
  var formData=new FormData();
  formData.append("alarm_info",JSON.stringify(this.resolutionAlarmData));
  formData.append("alarm_id",this.selectedRowObject['alarm_id']);
  formData.append("email_id",this.resolutionAlarmData.email_order_list);
  formData.append("close_code", this.resolutionCode.selected);
  formData.append("ticket_no",ticketIds[1]);
  formData.append("resolve_notification_time",this.datePipe.transform(new Date().toString(),"dd-MM-yyyy hh:mm:ss"));
  formData.append("initial_fault_analysis",this.selectedRowObject['alarm_name']); 
  this.alarmService.sendMail(formData).subscribe((res) => {
    if (res.Status) {
      // this.alarmLoading=true;
      // this.getAlarms();
      alert('Mail sent successfully');
      // this.close();
    } else {
      alert(res['msg']);
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
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
    if (res.Status) {
       this.incidentStatus.data=res['data'];
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
    // this.completeLoading();
  });
}
checkDisableSendMail(){
  // if(this.notificationAlarmData['Comments']=='')
  // {
  //   return true;
  // }
  // return false;
}
checkDisableResolveMail(){
  // if(this.resolutionAlarmData['Comments']=='')
  // {
  //   return true;
  // }
  // return false;
}
checkDisableUpdateMail(){
  // if(this.updateAlarmData['Comments']=='')
  // {
  //   return true;
  // }
  // return false;
}
getResolutionCode(){
  this.alarmService.getResolutionCode().subscribe((res) => {
    if (res.status) {
       this.resolutionCode.data=res['data'];
    }
    this.loading=false;
  }, (err) => {
    this.loading=false;
    // this.completeLoading();
  });
}
}
