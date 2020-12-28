import APP_CONFIG from '../../../app.config';
import { rgb } from 'd3';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  type: string;
  linkCount: number = 0;
 name:string;
 ip:string;
 hidden:boolean=false;
 nodeData;
  constructor(nodeData) { 
    this.id = nodeData.id;
    this.type=nodeData.type;
    this.name=nodeData.name;
    this.ip=nodeData.id;
    this.nodeData=nodeData;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get r() {
    return 30;//50 * this.normal() + 10;
  }

  get fontSize() {
    return (10 * this.normal() + 10) + 'px';
  }
get outerR(){
  return 40;
}
get outerColor() {
  let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
  return rgb(255,255,255);
}
  get color() {
    if(this.type=="host"){
      return APP_CONFIG.HOSTCOLOR;
    }
    return APP_CONFIG.SERVICECOLOR;
    // let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    // return APP_CONFIG.SPECTRUM[index];
  }
}
