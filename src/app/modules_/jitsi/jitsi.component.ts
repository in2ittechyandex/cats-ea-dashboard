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
  domain: string = 'supportcall.in2ittech.com'; //"meet.jit.si"; // '172.16.10.112:443'; // 'alphacodes.hopto.org'; //  '182.76.238.200:8443';//
  options: any;
  api: any;
  modalReferenceAddReport: any;
  @ViewChild('content') content;

  onDialogOpened = new EventEmitter();
  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<JitsiComponent>) {
    // this.domain = environment.envConfig['jitsiDomain'] ? environment.envConfig['jitsiDomain'] : '';
  }

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
    console.log('.... user_ : ' + user_);
    let interfaceConfig_ = environment.envConfig['jitsi_interfaceConfigOverwrite'] ? environment.envConfig['jitsi_interfaceConfigOverwrite'] : {};
    // interfaceConfig_['DISABLE_JOIN_LEAVE_NOTIFICATIONS'] = true;
    // interfaceConfig_['DISABLE_PRESENCE_STATUS'] = true;
    // interfaceConfig_['DISABLE_TRANSCRIPTION_SUBTITLES'] = true;
    // interfaceConfig_['ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT'] = 10000;


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
      // },
      // "jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.IgfIWP_XtusfBW3ltGuDKdGk4xJZkOjmyoqkjkAkWSI",
      interfaceConfigOverwrite: interfaceConfig_,
      configOverwrite: config_
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    this.api.executeCommand('subject', 'CATS Meeting : ' + user_.episode_name);


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

    // set new password for channel
    // this.api.addEventListener('participantRoleChanged', function (event) {
    //   console.log(' Role  event.role  : '+event.role);
    //   // if (event.role === "moderator") {
    //     this.api.executeCommand('password', 'The Password');
    //   // }
    // });

    // this.api.isVideoAvailable().then(function (available) {
    //   console.log('....isVideoAvailable... ' + available);
    //   if (!this.data['areYouOrganizer']) {
    //     this.api.executeCommand('password', 'The Password');
    //   }
    // })

    // this.api.on("videoConferenceJoined", this.addPassword.bind(this));
    // this.api.isVideoAvailable().then(this.isVideoAvailable.bind(this));
    // this.api.addEventListener("participantRoleChanged", this.makePassword.bind(this));
    // this.api.on("passwordRequired", this.addPassword.bind(this));

    // join a protected channel
    // this.api.on('passwordRequired', function () {
    //   this.api.executeCommand('password', 'The Password');
    // });

    // this.api.addEventListener('incomingMessage', (e) => {
    //   console.log('incomming ...from : ' + e.from + ' :message: ' + e.message + ' : e.nickName: ' + e.nick);
    //   console.log('incomingMessage... : ' + e);
    // });

    // this.api.addEventListener('outgoingMessage', (e) => {
    //   console.log('message **** :' + e.message + ' ,isPrivateMessage : ' + e.privateMessage);
    //   // console.log('outgoingMessage... : '+e);
    // });


    this.api.addEventListener('participantJoined', (e) => {
      console.log('participantJoined... : ' + e);
    });

    // this.api.addEventListener('videoConferenceJoined', (response) => {
    //   console.log('videoConferenceJoined... : ');
    // });

    // this.api.addEventListener('participantLeft', (e) => {
    //   console.log('participantLeft... : ' + e);
    // });


    // https://catsportal.dashboard.liquidtelecom.co.za/assets/img_alpha/i.png
    // this.api.executeCommand('avatarUrl', 'http://localhost:4200/assets/img/user/user-13.jpg');



  }

  recordMeeting() {
    console.log('.... inside recordMeeting...');
    this.api.executeCommand('startRecording', {
      mode: 'file', //string //recording mode, either `file` or `stream`.
      // dropboxToken: 'sl.Aq8Be2tM4SiugIrczWGrXw1TJyTT_HsY2QzvzJgRD3QPrx78_PJQy209nZ4wm6btExnF9Kv7dql9sHeOOF1Znh154yClxnC1zsCGG-Wt2vJJZJuOG3hyIsTBygTb3BAk60cF1fs', //string, //dropbox oauth2 token.
      // shouldShare: true,// boolean, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
      // rtmpStreamKey: string, //the RTMP stream key.
      // rtmpBroadcastID: string, //the RTMP broadcast ID.
      // youtubeStreamKey: string, //the youtube stream key.
      // youtubeBroadcastID: string //the youtube broacast ID.
    });
  }

  stopRecording() {
    console.log('stop Recording options .....');
    this.api.executeCommand('stopRecording', 'file');
  }

  //   api.addEventListener('participantRoleChanged', function (event) {
  //     if(event.role === 'moderator') {
  //        api.executeCommand('password', 'The Password');
  //     }
  // });

  makePassword(event) {
    console.log('makePassword : ' + JSON.stringify(event) + ' :isOrganizer :  ' + this.data['areYouOrganizer'] + 'role: ' + event.role);
    let areYouOrganizer = this.data['areYouOrganizer'];
    // if(areYouOrganizer){
    //   this.api.executeCommand('password', 'The Password');
    // }
    if (event.role === 'moderator') {
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& MAKING PASSWORD &&&&&&&&&&&&&&&&&& :isOrganizer :' + areYouOrganizer + ' :role: ' + event.role);
      this.api.executeCommand('password', 'Password');
    }else {
      setTimeout(() => {
        console.log("..............................................");
        // why timeout: I got some trouble calling event listeners without setting a timeout :)
            // when local user is trying to enter in a locked room 
            this.api.addEventListener('passwordRequired', () => {
                this.api.executeCommand('password', "Password");
            });

            // when local user has joined the video conference 
            this.api.addEventListener('videoConferenceJoined', (response) => {
                setTimeout(function(){ this.api.executeCommand('password', "Password");}, 300);
            });

        }, 10);
    }
  }

  addPassword(event) {
    console.log('addPassword : ' + JSON.stringify(event) + ' :isOrganizer :  ' + this.data['areYouOrganizer']);
    let areYouOrganizer = this.data['areYouOrganizer'];
    // if(!areYouOrganizer){
    console.log(' REQUIRED PASSWORD ----------------------------- :isOrganizer :' + areYouOrganizer + ' :role: ' + event.role);
    // this.api.executeCommand('password', 'The Password');
    //}
    // this.api.executeCommand('password', 'The Password');
    setTimeout(()=>{  
      this.api.executeCommand('password', 'The Password');
      }, 200);
  }


  isVideoAvailable(event) {
    console.log('... isVideoAvailable... : ' + event);
    let areYouOrganizer = this.data['areYouOrganizer'];
    if (!areYouOrganizer) {
      // this.api.executeCommand('password', 'The Password');
    }
  }


  endMeeting() {
    console.log('end meeting .....');
    this.dialogOpened({ "msg": "end meeting" });
    this.api.dispose();
  }

}
