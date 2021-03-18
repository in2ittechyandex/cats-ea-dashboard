import { Component, HostListener, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RuleService } from './rule.services';
import {COMMA, ENTER} from '@angular/cdk/keycodes'; 
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'cats-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {

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


  closeResult = '';
  caseModel={
    'ruleName':'',
    'ruleDescription':'',
    'alertname':[],
    'alertDescription':'',
    'waittime':5,
    'sms':true,
    'incident':true,
    'mail':true,
    'hostIp':[],
    'hostName':[],
    'nms':[],
    'priority':''
  };
    
  public columnDefs;
  constructor(private ruleService:RuleService, private modalService: NgbModal) { 
    this.columnDefs = [
      
      { 
        headerName: 'Rule Name',
        field: 'rule_name', 
        sortable: true, 
        filter: true, 
        editable: false,
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
        headerName: 'Host Name', 
        field: 'host_name', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      
      
      {
        headerName: 'Host Ip Address', 
        field: 'host_ip_address', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      
      
      {
        headerName: 'Customer', 
        field: 'customer', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      
      
      {
        headerName: 'NMS', 
        field: 'nms', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      },
      
      
      {
        headerName: 'Priority', 
        field: 'priority', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      }
      ,
      
      
      {
        headerName: 'Wait Time', 
        field: 'wait_time', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      } 
      ,
      
      
      {
        headerName: 'SMS', 
        field: 'sms', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      } 
      ,
      
      
      {
        headerName: 'Incident', 
        field: 'incident', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      } 
      ,
      
      
      {
        headerName: 'MAIL', 
        field: 'mail', 
        sortable: true,
        editable: false,
        filter: true,
        resizable: true,
        'isActive':true
      } 
    ];
    
    this.tableHeight=(window.innerHeight-this.topmargin).toString(); 
  }
  topmargin=220;
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

   

   
  ngOnInit() {
    this.ruleService.getInputSourceList().subscribe((res)=>{
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
    callKpis() {

      this.getAllRules();  
    
    }
    ruleList;
    getAllRules() { 
      this.ruleList=[];
       this.ruleService.getAllRules().subscribe((res) => {
        if (res.status) {
          this.ruleList=res['data'];
        }
        
      }, (err) => {
         
         
      });
    } 




  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  alarms = [];
  hostips= [];
  hostnames= [];
  add(event: MatChipInputEvent,filter): void {
    const value = (event.value || '').trim();


  switch (filter) {
    case 'alarm':
      if (value) {
        this.alarms.push(value);
        event.value='';
        event.input.value ='';
      }
      break;
      case 'hostip':
        if (value) {
          this.hostips.push(value);
          event.value='';
          event.input.value ='';
        }
        break;
        case 'hostname':
          if (value) {
            this.hostnames.push(value);
            event.value='';
            event.input.value ='';
          }
          break;
  
    default:
      break;
  }

    // Add our fruit
    

    // Clear the input value
    // event.input.placeholder = 'placeafter';
    
    // event.chipInput.clear();
    //console.log(this.alarms);
  }

  remove(item,filter): void {
    let index;
    switch (filter) {
      case 'alarm':
          index = this.alarms.indexOf(item);

        if (index >= 0) {
          this.alarms.splice(index, 1);
        }
        break;
        case 'hostip':
            index = this.hostips.indexOf(item);

          if (index >= 0) {
            this.hostips.splice(index, 1);
          }
          break;
          case 'hostname':
              index = this.hostnames.indexOf(item);

    if (index >= 0) {
      this.hostnames.splice(index, 1);
    }
            break;
    
      default:
        break;
    }
    
  }

  onSubmit(){
this.caseModel.nms=[];
  for(let i=0;i<this.globalFilterModal.nms.length;i++){
      if(this.globalFilterModal.nms[i].value==true){
        this.caseModel.nms.push(this.globalFilterModal.nms[i].name);
      }
  }
  this.caseModel.hostName=this.hostnames;
  this.caseModel.hostIp=this.hostips;
  this.caseModel.alertname=this.alarms;
  console.log(this.caseModel);
this.ruleService.createRule(this.caseModel).subscribe((res)=>{
if(res.status){
alert(res.msg);
this.getAllRules();
}
})


  }
}
