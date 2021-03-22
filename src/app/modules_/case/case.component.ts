import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RuleService } from './rule.services';
import {COMMA, ENTER} from '@angular/cdk/keycodes';  
import { FormControl } from '@angular/forms'; 
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
    'customer':[],
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

hostCtrl = new FormControl();
filteredHosts: Observable<any>; 
allHosts: string[];// = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];


hostIpCtrl = new FormControl();
filteredHostsIp: Observable<any>; 
allHostsIp: string[];// = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

@ViewChild('hostIpInput') hostInput: ElementRef<HTMLInputElement>;
@ViewChild('auto') matAutocomplete: MatAutocomplete;
@ViewChild('hostInput') hostIpInput: ElementRef<HTMLInputElement>;
@ViewChild('autoHostIp') matHostIpAutocomplete: MatAutocomplete;
  ngOnInit() {
    // this.filteredHosts = this.hostCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map(
    //     (host: string | null) =>{
    //       if(host){
    //         return this._filterHost(host)
    //       }
    //   //  return  host ? this._filterHost(host) : this.allHosts.slice()
    //     }
    //     )
    //     );
        this.hostCtrl.valueChanges
        // .debounceTime(200)
        // .distinctUntilChanged()
        .subscribe(result => this._filterHost(result));
        this.hostIpCtrl.valueChanges
        // .debounceTime(200)
        // .distinctUntilChanged()
        .subscribe(result => this._filterHostIp(result));

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
  customers=[];
  add(event: MatChipInputEvent,filter): void {
    const value = (event.value || '').trim();


  switch (filter) {
    case 'customer':
      if (value) {
        this.customers.push(value);
        event.value='';
        event.input.value ='';
      }
      break;
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
          this.hostIpCtrl.setValue(null);
        }
        break;
        case 'hostname':
          if (value) {
            this.hostnames.push(value);
            event.value='';
            event.input.value ='';
            // event.chipInput!.clear();
            this.hostCtrl.setValue(null);
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
      case 'customer':
          index = this.customers.indexOf(item);

        if (index >= 0) {
          this.customers.splice(index, 1);
        }
        break;
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
  selected(event: MatAutocompleteSelectedEvent): void {
    this.hostnames.push(event.option.viewValue);
    this.hostInput.nativeElement.value = '';
    this.hostCtrl.setValue(null);
  }

  private _filterHost(value: string){
    if(value!=null && value!=undefined){
      const filterValue = value.toLowerCase();
      this.ruleService.search_host(filterValue).subscribe((res) => {
        this.allHosts= [];
        if (res.status == true) {
          if (res.data.length > 0){
            let results = res.data;
            let host=[];
            results.forEach(element => {
               host.push(element.name)
            });
             this.allHosts=host;
            //  return this.allHosts;
            // return this.allHosts.filter(host => host.toLowerCase().indexOf(filterValue) === 0);
          }
            
        }
      }, (err) => {
        this.allHosts= [];
        // return this.allHosts;
      });
    }
    
    
    
  }
  selectedHostIp(event: MatAutocompleteSelectedEvent): void {
    this.hostips.push(event.option.viewValue);
    this.hostIpInput.nativeElement.value = '';
    this.hostIpCtrl.setValue(null);
  }
  private _filterHostIp(value: string){
    if(value!=null && value!=undefined){
      const filterValue = value.toLowerCase();
      this.ruleService.search_host_ip(filterValue).subscribe((res) => {
        this.allHostsIp= [];
        if (res.status == true) {
          if (res.data.length > 0){
            let results = res.data;
            let host=[];
            results.forEach(element => {
               host.push(element)
            });
             this.allHostsIp=host;
            //  return this.allHosts;
            // return this.allHosts.filter(host => host.toLowerCase().indexOf(filterValue) === 0);
          }
            
        }
      }, (err) => {
        this.allHostsIp= [];
        // return this.allHosts;
      });
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
  this.caseModel.customer=this.customers;

  var data={
    "rule_name" : this.caseModel.ruleName,
     "host_name" : this.caseModel.hostName,
     "alert_name" : this.caseModel.alertname,
     "description" : this.caseModel.ruleDescription,
     "wait_time" : this.caseModel.waittime,
     "sms" : this.caseModel.sms,
     "incident" : this.caseModel.incident,
     "mail" : this.caseModel.mail,
     "host_ip_address": this.caseModel.hostIp,
     "customer" : this.caseModel.customer,
     "nms":this.caseModel.nms,
     "priority":this.caseModel.priority

}

  console.log(this.caseModel);
this.ruleService.createRule(data).subscribe((res)=>{
if(res.status){
alert(res.msg);
this.toggleView();
this.getAllRules();
}
})


  }
}
