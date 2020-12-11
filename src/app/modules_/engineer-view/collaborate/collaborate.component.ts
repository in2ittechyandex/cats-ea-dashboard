import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CollaborateService } from './collaborate.services';
import '../../../../assets/scripts/jitsi.js';

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
  domain: string = "meet.jit.si";
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

    this.jitsiMeet();
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

  jitsiMeet() {
    this.options = {
      roomName: "JitsiMeetAPIExample",
      width: '100%',
      height: 430,
      parentNode: document.querySelector('#meet')
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }

}
