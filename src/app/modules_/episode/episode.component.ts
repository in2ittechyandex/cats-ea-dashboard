import { Component, OnInit } from '@angular/core';
import { EpisodeService } from './episode.services';

@Component({
  selector: 'cats-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {

  constructor(private episodeService:EpisodeService) { }
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
