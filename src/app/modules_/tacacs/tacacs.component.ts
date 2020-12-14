import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import themeConf_ from '../../config/theme-settings'; 
import { TacacsService } from './tacacs.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms'; 
import { Subscription } from 'rxjs';
import { TimeFilterService } from 'src/app/shared_/time-filter/time-filter.service.component';
@Component({
  selector: 'cats-tacacs',
  templateUrl: './tacacs.component.html',
  styleUrls: ['./tacacs.component.css']
})
export class TacacsComponent implements OnInit {
  themeConf_;
  allLogs; 
  allUser;
  allRemoteIp;
  allCommands;
  logDetail;
  closeResult: string;
  model={
    selectedIp:"",
    selectedUser:"",
    selectedRemoteIp:""

  }
  expandedIndexUser:number;
  expandedIndexRemoteIp:number;
  loading:boolean=false;
  public timeServicesSubsc$: Subscription;
  constructor(private modalService: NgbModal,private timeServices_: TimeFilterService,private tacacsService:TacacsService) { 
    this.timeServicesSubsc$ = this.timeServices_.getTimeFilterSubscriber().subscribe(obj => {
      console.log(" time changed=");
      console.log(" time changed start="+timeServices_.getstartDateInTimestamp);
      console.log(" time changed end="+timeServices_.getendDateInTimestamp);
      // this.onChangeTimeServices(obj);
    });
  }
  public collapsUser(index: number,user) { 
    console.log("index user"+index); 
    // this.expandedIndexUser = -1;
    this.expandedIndexRemoteIp=-1;
    this.expandedIndexUser = index === this.expandedIndexUser ? -1 : index;  
    //some values  
      this.clickedOnUser(user);
    } 
    collapsRemoteIp(index: number,remoteip) { 
      console.log("index user"+index); 
      this.expandedIndexRemoteIp = index === this.expandedIndexRemoteIp ? -1 : index;  
      //some values  
        this.clickedOnRemoteIp(remoteip);
      } 
  ngOnInit() {
    this.expandedIndexUser = -1;
    this.expandedIndexRemoteIp=-1;
    this.themeConf_ = themeConf_;
  // bg-{{themeConf_.selectedColor}}
  // this.getAllTacacsLogs();
  // this.getDeviceIp();
  // 
  this.initSearch();
  }
  resultsDeviceIp: any[] = [];
  queryFieldDeviceIp: FormControl = new FormControl();
  resultsUser: any[] = [];
  queryFieldUser: FormControl = new FormControl();
  resultsRemoteIp: any[] = [];
  queryFieldRemoteIp: FormControl = new FormControl();
  resultsCommand: any[] = [];
  queryFieldCommand: FormControl = new FormControl();
  query;
  initSearch() {
    this.queryFieldDeviceIp.patchValue("");
           this.queryFieldUser.patchValue("");
          this.queryFieldRemoteIp.patchValue("");
          this.queryFieldCommand.patchValue("");
    this.queryFieldDeviceIp.valueChanges 
      .subscribe(result => this.getSearchData(result,"deviceip"));
    this.queryFieldUser.valueChanges 
      .subscribe(result => this.getSearchData(result,"user"));
    this.queryFieldRemoteIp.valueChanges 
      .subscribe(result => this.getSearchData(result,"remoteip"));
      this.queryFieldCommand.valueChanges 
      .subscribe(result => this.getSearchData(result,"command"));
      this.applyFilter()
  }
  checkDisablequeryFieldDeviceIp(){
    
    if(this.queryFieldDeviceIp.value==""){
      console.log("this.queryFieldDeviceIp.value inside"+this.queryFieldDeviceIp.value);
      return true;
    }
    console.log("this.queryFieldDeviceIp.value outside"+this.queryFieldDeviceIp.value);
    return false;
  }
  errortext="";
  onUserFocus(searchtag){
    
      // if(this.queryFieldDeviceIp.value!=''){
        this.loading=true; 
      this.tacacsService.search_user(this.timeServices_.getstartDateInTimestamp(),
      this.timeServices_.getendDateInTimestamp(),this.queryFieldDeviceIp.value,searchtag,'','').subscribe((res) => {
        if (res.Status) {
          if (res.data.length > 0){
            this.resultsUser=[];
             
            this.resultsUser = res.data;
            console.log("users"+this.resultsUser)
          }
          this.loading=false; 
        }else{
          this.loading=false;
        }
      }, (err) => { 
        this.loading=false;
      });
    // }else{
    //   this.queryFieldUser.patchValue("");
    //   this.errortext="Please select Device Ip first.";
    // } 
  }
  onRemoteIpFocus(searchtag){ 
      // if(this.queryFieldUser.value!=''){
        this.loading=true; 
      this.tacacsService.search_rem_ip(this.timeServices_.getstartDateInTimestamp(),
      this.timeServices_.getendDateInTimestamp(),
      this.queryFieldDeviceIp.value,this.queryFieldUser.value,searchtag,'').subscribe((res) => {
        if (res.Status) {
          if (res.data.length > 0){
            this.resultsRemoteIp=[];
            
            this.resultsRemoteIp = res.data;
          }
     this.loading=false; 
        }else{
          this.loading=false;
        }
      }, (err) => { 
        this.loading=false;
      });
    // }else{
    //   this.queryFieldRemoteIp.patchValue("");
    //   this.errortext="Please select User first.";
    // } 
  }
  getSearchData(result,tag) {
    console.log("result"+this.queryFieldDeviceIp.value);
    
    if (result != "") {
      
      if(tag=="deviceip"){
        this.tacacsService.search_device_ip(this.timeServices_.getstartDateInTimestamp(),
        this.timeServices_.getendDateInTimestamp(),result,'','','').subscribe((res) => {

          if (res.Status) {
            if (res.data.length > 0){
              this.resultsDeviceIp=[];
               
               this.resultsDeviceIp = res.data;
            }
          }
        }, (err) => { 
        });
      }else if(tag=="user"){
        this.onUserFocus(result);
      }else if(tag=="remoteip"){
        this.onRemoteIpFocus(result);
      }else if(tag=="command"){
        // if(this.queryFieldRemoteIp.value!=''){
        this.tacacsService.search_cmds(this.timeServices_.getstartDateInTimestamp(),
        this.timeServices_.getendDateInTimestamp(),this.queryFieldDeviceIp.value,this.queryFieldUser.value,this.queryFieldRemoteIp.value, result).subscribe((res) => {
          if (res.Status) {
            if (res.data.length > 0){
              this.resultsCommand=[];
              
              this.resultsCommand = res.data;
            }
       this.loading=false; 
          }else{
            this.loading=false;
          }
        }, (err) => { 
          this.loading=false;
        });
      // }else{
      //   this.queryFieldCommand.patchValue("");
      //   this.errortext="Please select Remote Ip first.";
      // }
      }
      
    } else {

    }

  }

tacacsData;
  applyFilter(){
      // if(this.queryFieldRemoteIp.value!=''){
        this.errortext="";
        this.loading=true; 
        this.tacacsService.search_all_cmds(this.timeServices_.getstartDateInTimestamp(),
        this.timeServices_.getendDateInTimestamp(),this.queryFieldDeviceIp.value,this.queryFieldUser.value,this.queryFieldRemoteIp.value, this.queryFieldCommand.value).subscribe((res) => {
          if (res.Status) {
            // if (res.data.length > 0)
            {
              // this.tacacsData=;
              this.tacacsData=res.data;
              this.allLogs = Object.keys(res.data);
              this.allUser=[];
              this.allRemoteIp=[];
              this.allCommands=[];
              this.model.selectedIp=this.allLogs[0];
              if(this.allLogs.length>0){
              this.clickedOnIp(this.model.selectedIp);
            }
              // this.allCommands =[];
              // this.allCommands = res.data;
              // this.allLogs =[];
              // this.allUser =[];
              // this.allRemoteIp =[];
              // this.allLogs.push(this.queryFieldDeviceIp.value);
              // this.allUser.push(this.queryFieldUser.value);
              // this.allRemoteIp.push(this.queryFieldRemoteIp.value);
            }
       this.loading=false; 
          }else{
            this.loading=false;
          }
        }, (err) => { 
          this.loading=false;
        });
      // }else{ 
      //  this.errortext="Please select filter value.";
      // }
    
  }
  resetFilter(){
    this.allCommands =[]; 
          this.allLogs =[];
          this.allUser =[];
          this.allRemoteIp =[];
          this.queryFieldDeviceIp.patchValue("");
           this.queryFieldUser.patchValue("");
          this.queryFieldRemoteIp.patchValue("");
          this.queryFieldCommand.patchValue("");
          // this.getDeviceIp();
          this.applyFilter();
  }
  checkResultLengthdeviceip() { 
    if (this.resultsDeviceIp.length > 0) {
      return true;
    }  
     
   

    return false;
  }
  checkResultLengthuser() {
    if (this.resultsUser.length > 0) {
      return true;
    } 
        return false;
      }
      checkResultLengthremoteip() {
        if (this.resultsRemoteIp.length > 0) {
          return true;
        } 
        
            return false;
          }
          checkResultLengthcommand() {
            if (this.resultsCommand.length > 0) {
              return true;
            } 
            
                return false;
              }
  getDeviceIp(){
    this.loading=true;
    this.tacacsService.getDeviceIp().subscribe((res) => {
      if (res.Status) {
        this.allLogs = res.data;
         this.model.selectedIp=this.allLogs[0];
         this.loading=false;
         this.getUserByIp();
      }else{
this.loading=false;
      }
    }, (err) => { 
      this.loading=false;
    });
  }
  clickedOnIp(ip){
    this.expandedIndexUser = -1;
    this.expandedIndexRemoteIp=-1;
    this.allUser=[];
    this.allRemoteIp=[];
    this.allCommands=[];
      this.model.selectedIp=ip;
      this.getUserByIp();
  }
  clickedOnUser(user){
    this.allRemoteIp=[];
    this.allCommands=[];
this.model.selectedUser=user;
this.getRemoteIp();
  }
  clickedOnRemoteIp(remoteIp){
    // this.allRemoteIp=[];
    this.allCommands=[];
    this.model.selectedRemoteIp=remoteIp;
    this.getCommands();
  }
  getUserByIp(){
    // this.loading=true;
    // this.tacacsService.getUserByIp(this.model.selectedIp).subscribe((res) => {
    //   if (res.Status) {
        this.allUser =Object.keys(this.tacacsData[this.model.selectedIp]);
        this.model.selectedUser=this.allUser[0];
        if(this.allUser.length>0){
          this.clickedOnUser(this.model.selectedUser);
        }
//         this.loading=false;
//         this.getRemoteIp();
//       }else{
// this.loading=false;
//       }
//     }, (err) => { 
//       this.loading=false;
//     });
  }
  getRemoteIp(){
    // this.loading=true;
    // this.tacacsService.getRemoteIp(this.model.selectedIp,this.model.selectedUser).subscribe((res) => {
    //   if (res.Status) {
      const selectedUserList=(this.tacacsData[this.model.selectedIp]);
        this.allRemoteIp = Object.keys(selectedUserList[this.model.selectedUser]);
   this.model.selectedRemoteIp=this.allRemoteIp[0];
   if(this.allRemoteIp.length>0){
    this.clickedOnRemoteIp(this.model.selectedRemoteIp);
  }
  //  this.loading=false;
  //  this.getCommands();
  //     }else{
  //       this.loading=false;
  //     }
  //   }, (err) => { 
  //     this.loading=false;
  //   });
  }
  getCommands(){
    // this.loading=true;
    // this.tacacsService.getCommands(this.model.selectedIp,this.model.selectedUser,this.model.selectedRemoteIp).subscribe((res) => {
    //   if (res.Status) {

      const selectedUserList=(this.tacacsData[this.model.selectedIp]);
      const selectedRemoteList=(selectedUserList[this.model.selectedUser]);
      this.allCommands = (selectedRemoteList[this.model.selectedRemoteIp]);
         
        this.loading=false;
    //   }else{
    //     this.loading=false;
    //   }
    // }, (err) => { 
    //   this.loading=false;
    // });
  }
  getAllTacacsLogs() {
    this.tacacsService.gettacacsLogList().subscribe((res) => {
      if (res.Status) {
        this.allLogs = res.msg;
   
      }
    }, (err) => { 
    });
  } 

  getTacacsLogDetail(id) {
    this.logDetail =[];
    this.tacacsService.getTacacsDetailById(id).subscribe((res) => {
      if (res.Status) {
        this.logDetail = res.msg;
   
      }
    }, (err) => { 
    });
  } 

  getKeys(dataObj){
    
    return Object.keys(dataObj);
  }


  clickOnLog(data){
    console.log(data);
    this.getTacacsLogDetail(data.id);
    document.getElementById("modalLogDetailsId").click();
  }

  private modalRef: NgbModalRef;
  open(content) {
      
    this.modalRef=this.modalService.open(content,{size:'lg'});
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
