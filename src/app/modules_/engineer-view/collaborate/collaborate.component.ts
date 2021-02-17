import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CollaborateService } from './collaborate.services';
// import '../../../../assets/scripts/jitsi.js';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'cats-collaborate',
  templateUrl: './collaborate.component.html',
  styleUrls: ['./collaborate.component.css']
})
export class CollaborateComponent implements OnInit {
  allComments = [];
  commentText = "";
  commentsLoading: boolean = false;
  commentsLoadingError: boolean = false;
  closeResult = '';
  domain: string = 'alphacodes.hopto.org'; // '182.76.238.200:8443';// "meet.jit.si"; // '172.16.10.112:443'; //
  options: any;
  api: any;
  modalReferenceAddReport: any;
  constructor(private collaborateService: CollaborateService, private modalService: NgbModal) {

  }


  ngOnInit() {

    this.getDiscussions();

  }
  getDiscussions() {
    this.commentsLoading = true;
    this.collaborateService.getDiscussions(28).subscribe((res) => {
      console.log(res);
      if (res['status']) {
        this.allComments = res['data'];
      } else {
        this.commentsLoadingError = true;
      }
      this.commentsLoading = false;
    }, (err) => {
      this.commentsLoading = false;
      this.commentsLoadingError = true;
    })
  }
  doComment(comment_text, commentTextBox) {
    this.collaborateService.comment(28, comment_text).subscribe((res) => {
      console.log(res);
      if (res['status']) {
        commentTextBox.value = "";
        this.getDiscussions();
      }
    })
  }
  editComment(comment_text, commentTextBo, commentId) {

  }
  commentReply(replytext, replyTextBox, commentId) {
    this.collaborateService.commentReply(commentId, replytext).subscribe((res) => {
      console.log(res);
      if (res['status']) {
        replyTextBox.value = "";
        this.collabReplyCancel();
      }
    })
  }
  commentAction(commentId, action) {
    this.collaborateService.commentAction(commentId, action).subscribe((res) => {
      console.log(res);
      if (res['status']) {
        this.getDiscussions();
      }
    })
  }
  showTemplate = null;
  clickedID = null;
  username = null;
  collabReplyEdit: string;
  collabOnReply(username, id, n) {     //on clicking reply button
    this.username = username;
    this.clickedID = id;
    this.showTemplate = n;

  }

  collabOnEdit(commentedit, n) {
    this.collabReplyEdit = commentedit;
    this.showTemplate = n;
  }

  collabOnDelete(objID, outerInner) {

  }

  collabEditCancel() {
    this.showTemplate = null;
  }

  collabReplyCancel() {     //on clicking inner reply cancel button
    this.username = '';
    this.clickedID = null;
    this.showTemplate = null;
  }


  prepareVideoModal(obj, content, size) {
    console.log(obj);
    let uName = obj.username;
    this.open(content, size);
    this.jitsiMeet(obj);
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

    // this.jitsiMeet(obj);
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
      console.log('incomming ...from : '+e.from +' :message: '+e.message + ' : e.nickName: '+e.nick);
      console.log('incomingMessage... : '+e);
    });

    this.api.addEventListener('outgoingMessage', (e) => {
      console.log('message **** :'+e.message + ' ,isPrivateMessage : '+e.privateMessage);
      // console.log('outgoingMessage... : '+e);
    });

    
    this.api.addEventListener('participantJoined', (e) => {
      console.log('participantJoined... : '+e);
    });
    
    
    // https://catsportal.dashboard.liquidtelecom.co.za/assets/img_alpha/i.png
    this.api.executeCommand('avatarUrl', 'http://localhost:4200/assets/img/user/user-13.jpg');


  }

  startMeeting(){
    this.jitsiMeet({'username':'Test User'});
  }

  endMeeting(){
    console.log('end meeting .....');
    this.api.dispose();
  }

  getUniqueRoomId(){
    // TODO : get unique room id
     return 'Room-'+(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
  }


}
