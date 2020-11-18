import { Component, OnInit, Input } from '@angular/core'; 
import { CollaborateService } from './collaborate.services';
@Component({
  selector: 'cats-collaborate',
  templateUrl: './collaborate.component.html',
  styleUrls: ['./collaborate.component.css']
})
export class CollaborateComponent implements OnInit {
  allComments=[];
  commentText="";
  commentsLoading:boolean=false;
  commentsLoadingError:boolean=false;
  constructor(private collaborateService:CollaborateService) { 
      
  }

  ngOnInit() {

    this.getDiscussions();
    
  }
  getDiscussions()
  {
    this.commentsLoading=true;
   this.collaborateService.getDiscussions(28).subscribe((res)=>{
    console.log(res);
    if(res['status']){
      this.allComments=res['data'];
    }else{
      this.commentsLoadingError=true;
    }
    this.commentsLoading=false;
   },(err)=>{
    this.commentsLoading=false;
    this.commentsLoadingError=true;
   })
  }
  doComment(comment_text,commentTextBox)
  {
   this.collaborateService.comment(28,comment_text).subscribe((res)=>{
    console.log(res);
    if(res['status']){ 
      commentTextBox.value="";
      this.getDiscussions();
    }
   })
  }
  editComment(comment_text,commentTextBo,commentId){

  }
  commentReply(replytext,replyTextBox,commentId)
  {
   this.collaborateService.commentReply(commentId,replytext).subscribe((res)=>{
    console.log(res);
    if(res['status']){
      replyTextBox.value="";
      this.collabReplyCancel();
    }
   })
  }
  commentAction(commentId,action)
  {
   this.collaborateService.commentAction(commentId,action).subscribe((res)=>{
    console.log(res);
    if(res['status']){
      this.getDiscussions();
    }
   })
  }
  showTemplate=null;
  clickedID=null;
  username=null;
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
}
