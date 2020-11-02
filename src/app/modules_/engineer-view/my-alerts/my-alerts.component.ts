import { Component, OnInit, ViewChild } from '@angular/core'; 
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'cats-my-alerts',
  templateUrl: './my-alerts.component.html',
  styleUrls: ['./my-alerts.component.css']
})
export class MyAlertsComponent implements OnInit {
  loading:boolean=false;
  chartData:Array<any>=[];
  isChartDataReceived:boolean=false;
  chartDataTopology:any;


  caseData = {
    caseId:'',
    caseStatus:"",
    network:"",
    time:"",
    tech:"",
    ticket_number:""
  };
  @ViewChild('tabs') public tabs:NgbTabset;
  constructor( ) { 
    var currentCase=JSON.parse(localStorage.getItem('currentCase'));
    console.log(currentCase);
    if(currentCase!=undefined){
      this.caseData.caseId=currentCase['caseId'];
      this.caseData.caseStatus=currentCase['caseStatus'];
      this.caseData.network=currentCase['network'];
      this.caseData.time=currentCase['time'];
      this.caseData.tech=currentCase['tech'];
      this.caseData.ticket_number=currentCase['ticket_number'];
    }
     
  }
  
methodFromParent(data) {
  
}
 
  ngOnInit() { 
    this.selectedTab='alertsTab';
     
  }
   
  alertList=[];
  timeLineAlertList=[];
  getAlertList(){
    
  }
   
  selectedTab;
    setSelectedTab($event: NgbTabChangeEvent) {
      this.selectedTab = $event.nextId;
      if(this.selectedTab=='topologyTab'){
       
      }else if(this.selectedTab=='timelineTab'){
         
      }

    }

    
  
    
}
