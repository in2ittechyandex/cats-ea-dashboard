import { Component, OnInit } from '@angular/core';
import { EpisodeService } from './episode.services';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'cats-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {
  closeResult = '';
  constructor(private episodeService:EpisodeService, private modalService: NgbModal) { }
alarmList;

operatorList;
filterList;
nmsList;
episodeModel={
  "name":"",
  "description":"",
  "selectedNams":"",
  "selectedAlarm":"",
  "filterMapping":[{'filter':"",'operator':"",'value':""}],
  "notificationMapping":[{'type':"",'value':""}],
  "subject":"",
  "body":""

  
  
}
open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });

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

  ngOnInit() {
    this.episodeService.getAlarmList().subscribe((res)=>{
      if(res['status']){
        this.alarmList=res['data'];
      }
    });
    this.episodeService.getOperatorList().subscribe((res)=>{
      if(res['status']){
        this.operatorList=res['data'];
      }
    });
    this.episodeService.getFilterList().subscribe((res)=>{
      if(res['status']){
        this.filterList=res['data'];
      }
    });
    this.episodeService.getInputSourceList().subscribe((res)=>{
      if(res['status']){
        this.nmsList=res['data'];
      }
    });
  }

  addFilter(){
    this.episodeModel.filterMapping.push({'filter':"",'operator':"",'value':""});
  }
  removeFilter(i){
    this.episodeModel.filterMapping.splice(i,1);
  }
  addNotification(){
    this.episodeModel.notificationMapping.push({'type':"",'value':""});
  }
  removeNotification(i){
    this.episodeModel.notificationMapping.splice(i,1);
  }
  append(toText,whatText){
   if(toText=="subject"){
     if(whatText=="time"){
      this.episodeModel.subject=this.episodeModel.subject+" $time "
     }else if(whatText=="host"){
      this.episodeModel.subject=this.episodeModel.subject+" $host "
    }
   }else{
      if(whatText=="time"){
        this.episodeModel.body=this.episodeModel.body+" $time "
      }else if(whatText=="host"){
        this.episodeModel.body=this.episodeModel.body+" $host "
      }else if(whatText=="signature"){
        this.episodeModel.body=this.episodeModel.body+" $signature "
      }
   }
  }
}
