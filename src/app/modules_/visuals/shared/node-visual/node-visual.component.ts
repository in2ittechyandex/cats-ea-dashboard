import { Component, Input } from '@angular/core';
import { Node } from '../../../d3';
import { NodedataService } from '../../../nodedata.service';

@Component({
  selector: '[nodeVisual]',
  template: `
    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
    <svg:circle *ngIf="node.type=='host'"
          class="nodeHost"
          [attr.fill]="node.color"
          cx="0"
          cy="0"
          [attr.r]="node.r"  (click)="mouseOver()" (mouseout)="mouseExit()">
      </svg:circle>
      <svg:circle *ngIf="node.type!='host'"
          class="nodeService"
          [attr.fill]="node.color"
          cx="0"
          cy="0"
          [attr.r]="node.r"  (click)="mouseOver()" (mouseout)="mouseExit()">
      </svg:circle>
      <svg:text
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.name}}
      </svg:text>
     
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
  hidden:boolean=false;
  constructor(private nodeDataService:NodedataService){

  }
  mouseOver(){
    // console.log("Node Clicked"+JSON.stringify(this.node));
    // if(this.hidden){
      // this.node.hidden=!this.node.hidden;
    // }
    this.nodeDataService.nodeSelected.emit(this.node);
  }
  mouseExit(){
    // console.log("Node Clicked"+JSON.stringify(this.node));
    // if(this.hidden){
      // this.node.hidden=!this.node.hidden;
    // }
  }
}
