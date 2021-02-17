import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { VideoConferencingService } from './video-conferencing.service';
import { Component, OnInit, ViewChild } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'cats-video-conferencing',
  templateUrl: './video-conferencing.component.html',
  styleUrls: ['./video-conferencing.component.css']
})
export class VideoConferencingComponent implements OnInit {

  public allEngineer = [];
  closeResult = '';
  domain: string = 'alphacodes.hopto.org'; // '182.76.238.200:8443';// "meet.jit.si"; // '172.16.10.112:443'; //
  options: any;
  api: any;
  modalReferenceAddReport: any;
  @ViewChild('content') content;

  constructor(private vcService_: VideoConferencingService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getAllEngineer();
  }

  getAllEngineer() {
    this.vcService_.getAllEngineer().subscribe((res) => {
      if (res['status'] == true) {
        // TODO : read participant list
        let a: Array<any> = res['data'];
        a.map(e => { return e['selected'] = false });
        this.allEngineer = a;
      } else {
        // TODO : Handle User Exception
      }
    }, err => {
      // TODO : Handle Server Error
    })
  }

  startMeeting() {
    // TODO : show participant list 
    let inviteeList = this.allEngineer.filter(elm => elm.selected);
    console.log('To be invite : ' + inviteeList);
    this.prepareVideoModal({ 'username': 'Test User' }, this.content, 'lg');
    //  this.jitsiMeet({'username':'Test User'});

  }

  changeParticipant(e) {

  }


  // Jitsi 

  prepareVideoModal(obj, content, size) {
    console.log(obj);
    let uName = obj.username;
    this.open(content, size);

  }


  open(content, size) {
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;     
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });

    this.modalReferenceAddReport = this.modalService.open(content,
      { size: size ? size : 'lg', backdrop: 'static', windowClass: 'In2_huge_popup' });
    this.modalReferenceAddReport.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.jitsiMeet({ user: 'Test User' });
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

  jitsiMeet(user_) {
    this.options = {
      roomName: this.getUniqueRoomId(),
      width: '100%',
      height: 430,
      parentNode: document.querySelector('#meet'),
      userInfo: {
        // email: 'email@jitsiexamplemail.com',
        displayName: user_.username
      }
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    this.api.getCurrentDevices().then(devices => {
      console.log('************ getCurrentDevices :: ' + devices);
    });

    this.api.addEventListener('videoConferenceLeft', (e) => {
      let rName = e.roomName;
      console.log('--------------Listening------------:::rName : ' + rName + ' , ' + this.modalService.hasOpenModals());
      alert('end video ... ');
      // if (this.modalService.hasOpenModals()) {
      //   this.modalService.dismissAll();
      // }
    });

    this.api.addEventListener('incomingMessage', (e) => {
      console.log('incomming ...from : ' + e.from + ' :message: ' + e.message + ' : e.nickName: ' + e.nick);
      console.log('incomingMessage... : ' + e);
    });

    this.api.addEventListener('outgoingMessage', (e) => {
      console.log('message **** :' + e.message + ' ,isPrivateMessage : ' + e.privateMessage);
      // console.log('outgoingMessage... : '+e);
    });


    this.api.addEventListener('participantJoined', (e) => {
      console.log('participantJoined... : ' + e);
    });


    // https://catsportal.dashboard.liquidtelecom.co.za/assets/img_alpha/i.png
    this.api.executeCommand('avatarUrl', 'http://localhost:4200/assets/img/user/user-13.jpg');


    this.api.isVideoAvailable().then(function (available) {
      console.log('....isVideoAvailable... ' + available);
    })



  }

  recordMeeting() {
    console.log('.... inside recordMeeting...');
    this.api.executeCommand('startRecording', {
      mode: 'file', //string //recording mode, either `file` or `stream`.
      dropboxToken: 'sl.Aq8Be2tM4SiugIrczWGrXw1TJyTT_HsY2QzvzJgRD3QPrx78_PJQy209nZ4wm6btExnF9Kv7dql9sHeOOF1Znh154yClxnC1zsCGG-Wt2vJJZJuOG3hyIsTBygTb3BAk60cF1fs', //string, //dropbox oauth2 token.
      shouldShare: true,// boolean, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
      // rtmpStreamKey: string, //the RTMP stream key.
      // rtmpBroadcastID: string, //the RTMP broadcast ID.
      // youtubeStreamKey: string, //the youtube stream key.
      // youtubeBroadcastID: string //the youtube broacast ID.
    });
  }

  stopRecording(){
    console.log('stop Recording options .....');
    this.api.executeCommand('stopRecording','file');
  }

  endMeeting() {
    console.log('end meeting .....');
    this.api.dispose();
  }

  getUniqueRoomId() {
    // TODO : get unique room id
    return 'Room-' + (Math.floor(Math.random() * (10 - 1 + 1)) + 1);
  }

}
