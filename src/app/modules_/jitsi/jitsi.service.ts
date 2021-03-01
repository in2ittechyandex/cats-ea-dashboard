import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JitsiComponent } from './jitsi.component';
import { Injectable, EventEmitter } from '@angular/core';

import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { JsonPipe } from '@angular/common';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/services_/user.services'; 

@Injectable({
  providedIn: 'root'
})
export class JitsiService {

  ws: $WebSocket;
  dialogRef_:any;

  loading = new EventEmitter<boolean>();
  onRefresh = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog,private http: HttpClient, private userService: UserService
    ) {
    this.ws = new $WebSocket('ws://172.27.63.182:8088/name');
    this.ws.onOpen(() => {
      console.log("connected");
      const currentUser_ = localStorage.getItem('currentUser');
      // const token = currentUser_ ? JSON.parse(currentUser_).access_token : 'none';
      const userName = currentUser_ ? JSON.parse(currentUser_).userName : 'none';
      let session_ = {
        "type": "handshake",
        "user_name": userName
      }
      this.sendMessage(session_);
    })

    this.ws.onMessage(
      (res: MessageEvent) => {
        console.log("socket connect" + res.data);
        let msg = JSON.parse(res.data);
        // if(msg['status'] == "success"){
        //    this.handshek();
        // }
        // TODO : send when call need to initaite

        if(msg['status'] == true && msg['type'] == 'Handshake'){
          console.log('..... socket ...Handshake :'+msg['msg']);
        }else if (msg['status'] == true && msg['type'] == 'Connection Open'){
          console.log('..... socket ...Connection :'+msg['msg']);
        }else if(msg['status'] == true && msg['type'] == 'res_start_call'){
          console.log('..... socket ...start call :'+msg['msg']);
          this.sessionId=msg['session_id'];
          this.sendNotificationsToSubscribers(msg);
        }
        
      },
      { autoApply: false }
    );


  }
sessionId;
  sendMessage(params_: any) {
    this.ws.send(params_).subscribe(
      (msg) => {
        console.log("next", msg.data);
      },
      (msg) => {
        console.log("error", msg);
      },
      () => {
        console.log("complete");
      }
    );
  }

  scheduleMeeting(participants_: any[], episode_id: any) {
    const currentUser_ = localStorage.getItem('currentUser');
    const userName = currentUser_ ? JSON.parse(currentUser_).userName : 'none';
    let inv = [];
    participants_.forEach(element => {
      inv.push(element['userName']);
    });
    let str = {
      "type": "start_call",
      "org": userName,
      "episode_id": episode_id,
      "participants": inv
    }
    this.sendMessage(str);
  }


  socketDisconnect() {
    this.ws.close();
    this.ws.onClose((msg: MessageEvent) => {
      this.ws = null;
      console.log("socket disconnect");
    },
    );
  }

  public open(data) {
    let promise;
    var dialogRef;
    promise = new Promise((resolve, reject) => {
      dialogRef = this.dialog.open(JitsiComponent, {
        height: '80%',
        width: '65%',
        backdropClass: 'backdropBackground',
        panelClass: 'my-popup-dialog',
        data: data
      });
      dialogRef.componentInstance.onDialogOpened.subscribe((res) => {
        console.log("opened"+JSON.stringify( res));
        resolve(res);
      })
    });
    this.dialogRef_ = dialogRef;
    return promise;
  }

  closePopup(){
    this.dialogRef_.componentInstance.dialogClose();
    this.endCall().subscribe((res)=>{
    if(res.status){
      
    }
    })
  }
  public endCall() { 
    const url = environment._WEBGATEWAY_BASIC_URL_ + 'call/kpi/call_end';
    const formData: FormData = new FormData();
            formData.append('session_id', this.sessionId);
    return this.http.post(url, formData).map(res => <any>res);
}
  // public jitsiNotificatiions= [];
  public subjectTabs = new Subject();

  public getJitsiSubscriber() {
    return this.subjectTabs.asObservable();
  }

  public sendNotificationsToSubscribers(notification_) {
    this.subjectTabs.next(notification_);
  }

}
