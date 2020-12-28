 
import { Component, OnInit ,Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AlarmsService } from 'src/app/modules_/alarms/alarms.service'; 
import { NgbModalRef, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodedataService } from 'src/app/modules_/nodedata.service';
import { Link, Node } from '../../../modules_/d3';
export interface DialogData {
  
}
@Component({
  selector: 'cats-view-nia',
  templateUrl: './view-nia.component.html',
  styleUrls: ['./view-nia.component.css']
})
export class ViewNiaComponent implements OnInit {
  nodeData = {
    "key": [],
    "data": []
  };
  linkData;
  onDialogOpened=new EventEmitter();
  static thisObj=null;
  constructor(private nodeDataService:NodedataService,@Inject(MAT_DIALOG_DATA) public data: DialogData,private alarmService:AlarmsService
  ,public dialogRef: MatDialogRef<ViewNiaComponent>,private modalService: NgbModal) { 
    ViewNiaComponent.thisObj=this;
  }
   
  dialogOpened(): void {
    this.onDialogOpened.emit(true);
  }
 isPopUpOpen:boolean=false;
  ngOnInit() {
    // this.dialogRef.updatePosition({right: `40px`});
    this.dialogOpened();
    this.nodeDataService.nodeSelected
    .subscribe(
      (node: Node) => {
        this.nodeData.key = [];
        this.nodeData.data = [];
        this.linkData = [];
        this.nodeData.data = node.nodeData['display'];
        this.nodeData.key = Object.keys(this.nodeData.data);
        if(!ViewNiaComponent.thisObj.isPopUpOpen){
          ViewNiaComponent.thisObj.isPopUpOpen=true;
        document.getElementById("modalViewNiaDetailBtn").click();}
      }
    )
  this.nodeDataService.linkSelected
    .subscribe(
      (link: Link) => {
        this.nodeData.key = [];
        this.nodeData.data = [];
        this.linkData = []; 
        this.getLinkData(link.source['id'], link.target['id']);
      }
    )
    this.getGraphViewNia();
  }
  getLinkData(source, target) {
    console.log("source" + source, "target" + target);
    this.linkData = this.jsonStr.relation[source + target];
    if(!ViewNiaComponent.thisObj.isPopUpOpen){
      ViewNiaComponent.thisObj.isPopUpOpen=true;
    document.getElementById("modalViewNiaDetailBtn").click();
  }
  
  }
  nodes: Node[] = [];
  links: Link[] = [];
  jsonStr; 
  niaerror:boolean=false;
  levelNia=1;
  callLevel1(){
    this.levelNia=1;
    
     
    this.getGraphViewNia();
  }
  callLevel2(){
    this.levelNia=2;
    
    this.getGraphViewNia();
  }
  niaErrorResponse="";
  loading:boolean=false;
  getGraphViewNia() {
    this.loading = true;
    this.nodes = [];
    this.links = [];
    var hostList={
      "master_node":"WMARDRADFS3K03N",
        "list":["WMARDRADFS3K03N"]
    };
    if(this.levelNia==1){
      hostList={
        "master_node":this.data['host_name'],
      "list":[this.data['host_name']]
        
      };
    }else{
      hostList=this.jsonStr["znodes_list"];;
    }
    this.niaerror=false;
    this.jsonStr=null;
  
    this.nodeDataService.getNodesData(hostList).subscribe((res: {}) => {
      if (res["Status"]) {
        // setTimeout(() => {
          this.jsonStr = res["data"];
          var nodeList = this.jsonStr["nodes"];
          var linksList = this.jsonStr["links"];
          for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].type == "host") {
              this.nodes.push(new Node(nodeList[i]));
            } else if (nodeList[i].type == "master") {
              this.nodes.push(new Node(nodeList[i]));
            }
          }
          for (var i = 0; i < linksList.length; i++) {
            this.links.push(new Link(linksList[i].source, linksList[i].target));
          }
          this.loading = false;
        // }, 1000);
       
      }else{
        this.niaErrorResponse=res['msg']
        this.niaerror=true;
        this.loading = false;
      }
      
    },(error)=>{
      this.niaerror=true;
        this.loading = false;
    });
  }
  gethostname(obj) {
    return obj['host_name'];
    for (var i = 0; i < obj.Event.length; i++) {
      if (obj.Event[i].tag == "host_name") {
        return obj.Event[i].value;
      }
    }
  }


  
private modalRef: NgbModalRef;
closeResult: string;
     
    openFullScreen(content) {
      if(this.modalRef){
        // this.modalRef.close();
      }
      this.modalRef = this.modalService.open(content, { windowClass: 'my-mid' });
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        ViewNiaComponent.thisObj.isPopUpOpen=false;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        ViewNiaComponent.thisObj.isPopUpOpen=false;
      });
    }
    
    close() {
      this.modalRef.close();
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
}
