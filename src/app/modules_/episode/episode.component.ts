import { Component, HostListener, OnInit } from '@angular/core';
import { EpisodeService } from './episode.services';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'cats-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {
  closeResult = '';
  public columnDefs;
  constructor(private episodeService:EpisodeService, private modalService: NgbModal) { 
    this.columnDefs = [
      
      { 
        headerName: 'Time',
        field: 'created_time', 
        sortable: true, 
        filter: true, 
        editable: false,
        resizable: true,
        'isActive':true
      },
      {
        headerName: 'Name', 
        field: 'name', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      { 
        headerName: 'Description', 
        field: 'description', 
        sortable: true, 
        filter: true, 
        editable: false,
        draggable:true,
        resizable: true,
        'isActive':true
      },
      
      {
        headerName: 'Status', 
        field: 'status', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      }
    ];
    
    this.tableHeight=(window.innerHeight-this.topmargin).toString(); 
  }
  topmargin=180;
  @HostListener("window:resize")
  onResize() {
      this.tableHeight=(window.innerHeight-this.topmargin).toString();
   
  }
  episodeList=[];
  tableHeight='475';//588
  secondsToRefresh: number = 60;
  timeLeft: number = 60; 
  responseTime=0;
alarmList;
isView:boolean=true;
operatorList;
filterList;
nmsList;
episodeModel={
  "name":"",
  "description":"",
  "selectedNms":"",
  "selectedAlarm":"",
  "filterMapping":[{'filter':"",'operator':"",'value':""}],
  "notificationMapping":[{'type':"",'value':""}],
  "subject":"",
  "body":""
}
 
toggleView(){
  this.isView=!this.isView;
}
onEventDetect(event){
  const type=event['type'];
  const data=event['data'];
  const event_=event['event']
  if(type=='reload'){
    this.callKpis();  
  } 
}
callKpis() {

  this.getAllEpisode();  

}
getAllEpisode() { 
  this.episodeList=[];
   this.episodeService.getAllEpisode().subscribe((res) => {
    if (res.status) {
      
    this.episodeList=res['data'];
    }
    
  }, (err) => {
     
     
  });
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
    this.callKpis();
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
