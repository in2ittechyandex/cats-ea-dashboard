import { Injectable, EventEmitter } from '@angular/core';
// import { MatDialog } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ViewSendSmsComponent } from './view-send-sms/view-send-sms.component';
import { ViewSendMailComponent } from './view-send-mail/view-send-mail.component';
import { ViewSiaComponent } from './view-sia/view-sia.component';
import { ViewNiaComponent } from './view-nia/view-nia.component';
import { ViewIncidentComponent } from './view-incident/view-incident.component';
import { ViewAlarmComponent } from './view-alarm/view-alarm.component';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  
  components={
  'View Alarm': ViewAlarmComponent,
  'View Incident':ViewIncidentComponent,
  'Go to NIA':ViewNiaComponent,
  'Go to SIA':ViewSiaComponent,
  'Send Mail':ViewSendMailComponent,
  'Send SMS':ViewSendSmsComponent
}
  // loading:boolean=true;
  loading=new EventEmitter<boolean>();
  onRefresh=new EventEmitter<boolean>();
  constructor(private dialog: MatDialog ) { }
  
  public open(data,menuselection){
    let promise;
    var dialogRef;
    if ( menuselection === 'View Alarm') { 
        promise = new Promise((resolve, reject) => {
          dialogRef=this.dialog.open(ViewAlarmComponent,{
          height: '80%',
          width: '85%',
          backdropClass: 'backdropBackground' ,
          panelClass:'my-popup-dialog',
          data: data
        });
        dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
          console.log("opened");
          resolve();
        })
         
      
  }); 
    } else if ( menuselection === 'View Incident') {
      promise = new Promise((resolve, reject) => {
        dialogRef=this.dialog.open(ViewIncidentComponent,{
        height: '80%',
        width: '80%',
        backdropClass: 'backdropBackground' ,
        panelClass:'my-popup-dialog',
        data: data
      });
      dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
        console.log("opened");
        resolve();
      })
      
    
});  
    }else if ( menuselection === 'Assign To Me') { 
      
    }else if ( menuselection === 'Go to SIA') { 
      promise = new Promise((resolve, reject) => {
        dialogRef=this.dialog.open(ViewSiaComponent,{
        height: '80%',
        width: '60%',
        backdropClass: 'backdropBackground' ,
        panelClass:'my-popup-dialog',
        data: data
      });
      dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
        console.log("opened");
        resolve();
      })
      
    
}); 
    }else if ( menuselection === 'Go to NIA') { 
      promise = new Promise((resolve, reject) => {
        dialogRef=this.dialog.open(ViewNiaComponent,{
        height: '80%',
        width: '60%',
        backdropClass: 'backdropBackground' ,
        panelClass:'my-popup-dialog',
        data: data
      });
      dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
        console.log("opened");
        resolve();
      })
      
    
}); 
   }else if ( menuselection === 'Send SMS') { 
    
    promise = new Promise((resolve, reject) => {
      dialogRef=this.dialog.open(ViewSendSmsComponent,{
      height: '80%',
      width: '60%',
      backdropClass: 'backdropBackground' ,
      panelClass:'my-popup-dialog',
      data: data
    });
    dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
      console.log("opened");
      resolve();
    })
    
  
}); 
  }else if ( menuselection === 'Send Mail') { 
    promise = new Promise((resolve, reject) => {
      dialogRef=this.dialog.open(ViewSendMailComponent,{
      height: '80%',
      width: '60%',
      backdropClass: 'backdropBackground' ,
      panelClass:'my-popup-dialog',
      data: data
    });
    dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
      console.log("opened");
      resolve();
    })
    dialogRef.componentInstance.onRefresh.subscribe((res)=>{
      console.log("onRefresh");
      this.onRefresh.emit(res);
    })
  
}); 
  }
    // const dialogRef=this.dialog.open(ViewAlarmComponent,{
    //   height: '80%',
    //   width: '70%',
    //   backdropClass: 'backdropBackground' ,
    //   panelClass:'my-popup-dialog',
    //   data: data
    // });
    // dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
    //   console.log("opened");
    //   this.loading.emit(false);
    //   // return true;
    // })


//     let promise = new Promise((resolve, reject) => {
//       const dialogRef=this.dialog.open(ViewAlarmComponent,{
//         height: '80%',
//         width: '70%',
//         backdropClass: 'backdropBackground' ,
//         panelClass:'my-popup-dialog',
//         data: data
//       });
//       dialogRef.componentInstance.onDialogOpened.subscribe((res)=>{
//         console.log("opened");
//         resolve();
//       })
      
    
// });
return promise;
} 
  search(term:string) {
    let promise = new Promise((resolve, reject) => {
       
            resolve();
          
    });
    return promise;
  }

}
