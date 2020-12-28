import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height" style="width:100% !important;">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" *ngFor="let node of nodes"
            [draggableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @Input('nodes') nodes;
  @Input('links') links;
  graph: ForceDirectedGraph;
  public _options: { width, height } = { width: 100, height: 100 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  public get options() {
    return this._options = {
      width: window.innerWidth-window.innerWidth*0.5,
      height: window.innerHeight-window.innerHeight*0.35
    };
  }
  lastNodeClicked:Node;
  currentNodeClicked:Node;
  nodeClicked(node){
  console.log("out"+JSON.stringify(node));
  // var nodeList:Node[];
  // nodeList=this.nodes;
  // for(var i=0;i<nodeList.length;i++){
  //   if(nodeList[i].hidden==false)
  // }
  this.currentNodeClicked=node;

if(this.lastNodeClicked!=null&&this.currentNodeClicked!=this.lastNodeClicked){
  this.lastNodeClicked.hidden=false;
}

  // if(this.lastNodeClicked!=null){
  //   if(this.lastNodeClicked.hidden){
  //   this.lastNodeClicked.hidden=false;
  // }
  // }
  this.lastNodeClicked=node;
  }
}
