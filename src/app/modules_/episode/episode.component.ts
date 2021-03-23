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
        headerName: 'Action',
        'isActive': true,
        minWidth: 100,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
          label: 'Delete',
          rendererType: 'button'
        }
      },
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
  "selectedNms":[],
  "selectedAlarm":[],
  "filterMapping":[{'filter':"",'operator':"",'value':""}],
  "notificationMapping":[{'type':"",'value':""}],
  "subject":"",
  "body":""
}
globalFilterModal = {
  isListenOnBlur: false,
  identifier: 'global-customer-filter',
  filtersToggle: false,
  userTabFilters: null,
  masterSelectedNMS: false,
  nms: [],
  editNMS: [],
  modifyNMS: [],
  timeType: 'cu'
};
onBtnClick1(e) { 
  this.episodeService.deleteEpisodeConfig(e.rowData.guid).subscribe((res)=>{
    if(res['status']){
      alert(res['msg']);
      this.getAllEpisode();
    }
  });
}
 /**
   * Ramji : 03-11-2020
   * @param event
   * @param obj_
   */
  showDDNMS(event, obj_) {
    setTimeout(function () {
      const element_: Element = (event.target as Element);
      const elementDD: Element = element_.nextElementSibling;
      const existingClass = elementDD.getAttribute('class');
      const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
      obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
      elementDD.setAttribute('class', toggleClass);
    }, 100);
  }

 /**
   * Ramji : 03-11-2020
   * @param event
   */
  globalFilterClickOutSideNMS(event) {
    const identifir = event.Identifier;
    this.globalFilterModal.isListenOnBlur = false;
    document.getElementById(identifir).click();
  }

  checkUncheckAll(checklist, masterSelected) {
    for (let i = 0; i < checklist.length; i++) {
      checklist[i].value = masterSelected;
    }
  }
  isAllSelected(checklist, masterSelected) {
    this.globalFilterModal[masterSelected] = checklist.every(function (item: any) {
      return item.value == true;
    });
  }




  globalFilterModalAlarmsType = {
    isListenOnBlur: false,
    identifier: 'global-customer-filter-alarm-type',
    filtersToggle: false,
    userTabFilters: null,
    masterSelectedAlarmsType: false,
    AlarmsType: [],
    editAlarmsType: [],
    modifyAlarmsType: [],
    timeType: 'cu'
  };
   /**
     * Ramji : 03-11-2020
     * @param event
     * @param obj_
     */
    showDDAlarmsType(event, obj_) {
      setTimeout(function () {
        const element_: Element = (event.target as Element);
        const elementDD: Element = element_.nextElementSibling;
        const existingClass = elementDD.getAttribute('class');
        const toggleClass = (existingClass.indexOf('show') > -1) ? existingClass.replace('show', '').trim() : existingClass + ' show';
        obj_['isListenOnBlur'] = (toggleClass.indexOf('show') > -1);
        elementDD.setAttribute('class', toggleClass);
      }, 100);
    }
  
   /**
     * Ramji : 03-11-2020
     * @param event
     */
    globalFilterClickOutSideAlarmsType(event) {
      const identifir = event.Identifier;
      this.globalFilterModalAlarmsType.isListenOnBlur = false;
      document.getElementById(identifir).click();
    }
  
    checkUncheckAllAlarmsType(checklist, masterSelected) {
      for (let i = 0; i < checklist.length; i++) {
        checklist[i].value = masterSelected;
      }
    }
    isAllSelectedAlarmsType(checklist, masterSelected) {
      this.globalFilterModalAlarmsType[masterSelected] = checklist.every(function (item: any) {
        return item.value == true;
      });
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
        this.globalFilterModalAlarmsType.AlarmsType = res['data'].map((elm)=>{
          elm['value'] = false;
          return elm;
        });
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
        this.globalFilterModal.nms = res['data'].map((elm)=>{
          elm['value'] = false;
          return elm;
        }); 
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

  submit(){
    this.episodeModel.selectedNms=[];
  for(let i=0;i<this.globalFilterModal.nms.length;i++){
      if(this.globalFilterModal.nms[i].value==true){
        this.episodeModel.selectedNms.push(this.globalFilterModal.nms[i].name);
      }
  }
  for(let i=0;i<this.globalFilterModalAlarmsType.AlarmsType.length;i++){
    if(this.globalFilterModalAlarmsType.AlarmsType[i].value==true){
      this.episodeModel.selectedAlarm.push(this.globalFilterModalAlarmsType.AlarmsType[i].master_alarm_guid);
    }
}
  var data={
  "name": this.episodeModel.name,
  "description": this.episodeModel.description,
  "selectedNms": this.episodeModel.selectedNms,
  "selectedAlarms":this.episodeModel.selectedAlarm,
  "filterMapping": this.episodeModel.filterMapping,
  "notificationMapping": this.episodeModel.notificationMapping,
  "subject":this.episodeModel.subject,
  "body": this.episodeModel.body
}

this.episodeService.createEpisode(data).subscribe((res)=>{
if(res.status){
alert(res.msg);
this.toggleView(); 
this.getAllEpisode();
}
})

    console.log(JSON.stringify(data));
  }
}
