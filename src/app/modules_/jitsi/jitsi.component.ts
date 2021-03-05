import { environment } from './../../../environments/environment';

import { Component, OnInit, ViewChild, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var JitsiMeetExternalAPI: any;

export interface DialogData {

}

@Component({
  selector: 'cats-jitsi',
  templateUrl: './jitsi.component.html',
  styleUrls: ['./jitsi.component.css']
})
export class JitsiComponent implements OnInit, AfterViewInit {

  closeResult = '';
  domain: string =  "meet.jit.si"; // '172.16.10.112:443'; // 'alphacodes.hopto.org'; // '182.76.238.200:8443';//
  options: any;
  api: any;
  modalReferenceAddReport: any;
  @ViewChild('content') content;

  onDialogOpened = new EventEmitter();
  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<JitsiComponent>) { }

  dialogOpened(data): void {
    this.onDialogOpened.emit(data);
  }

  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit() {

    console.log('  data : ' + this.data);
  }

  ngAfterViewInit() {
    this.jitsiMeet(this.data);
  }
  jitsiMeet(user_) {
    let interfaceConfig_ = environment.envConfig['jitsi_interfaceConfigOverwrite'] ? environment.envConfig['jitsi_interfaceConfigOverwrite'] : {};
    let config_ = environment.envConfig['jitsi_configOverwrite'] ? environment.envConfig['jitsi_configOverwrite'] : {};

    this.options = {
      roomName: user_.roomId,
      width: '100%',
      height: 400,
      parentNode: document.querySelector('#meet'),
      userInfo: {
        // email: 'email@jitsiexamplemail.com',
        displayName: user_.username
      },
      // startWithVideoMuted:false,
      // noticeMessage:'Hi User',
      // interfaceConfigOverwrite: {
      //   TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup'
      //     // , 'profile', 'settings', 'raisehand', 'videoquality'
      //   ]
      // },
    //   "jitsi_interfaceConfigOverwrite": {
    //     "filmStripOnly": false,
    //     "SHOW_JITSI_WATERMARK": false,
    //     "SHOW_WATERMARK_FOR_GUESTS": false,
    //     "DEFAULT_REMOTE_DISPLAY_NAME": "New User",
    //     "TOOLBAR_BUTTONS": []
    // },
    // "jitsi_configOverwrite": {
    //     "doNotStoreRoom": true,
    //     "startVideoMuted": 0,
    //     "startWithVideoMuted": true,
    //     "startWithAudioMuted": true,
    //     "enableWelcomePage": false,
    //     "prejoinPageEnabled": false,
    //     "disableRemoteMute": true,
    //     "remoteVideoMenu": {
    //         "disableKick": true
    //     }
    // }

      interfaceConfigOverwrite: interfaceConfig_,
      configOverwrite: config_
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    this.api.getCurrentDevices().then(devices => {
      console.log('************ getCurrentDevices :: ' + devices);
    });

    this.api.addEventListener('videoConferenceLeft', (e) => {
      let rName = e.roomName;
      console.log(' end from my end ');
      // console.log('--------------Listening------------:::rName : ' + rName + ' , ' + this.modalService.hasOpenModals());
      // alert('end video ... ');
      this.dialogOpened({ "msg": "end_self" });
      // this.api.dispose();
    });

    // this.api.addEventListener('incomingMessage', (e) => {
    //   console.log('incomming ...from : ' + e.from + ' :message: ' + e.message + ' : e.nickName: ' + e.nick);
    //   console.log('incomingMessage... : ' + e);
    // });

    // this.api.addEventListener('outgoingMessage', (e) => {
    //   console.log('message **** :' + e.message + ' ,isPrivateMessage : ' + e.privateMessage);
    //   // console.log('outgoingMessage... : '+e);
    // });


    // this.api.addEventListener('participantJoined', (e) => {
    //   console.log('participantJoined... : ' + e);
    // });

    // this.api.addEventListener('participantLeft', (e) => {
    //   console.log('participantLeft... : ' + e);
    // });


    // https://catsportal.dashboard.liquidtelecom.co.za/assets/img_alpha/i.png
    this.api.executeCommand('avatarUrl', 'http://localhost:4200/assets/img/user/user-13.jpg');


    this.api.isVideoAvailable().then(function (available) {
      console.log('....isVideoAvailable... ' + available);
    })
  }

  endMeeting() {
    console.log('end meeting .....');
    this.dialogOpened({ "msg": "end meeting" });
    this.api.dispose();
  }

}
