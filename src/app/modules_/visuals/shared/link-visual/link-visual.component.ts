import { Component, Input } from '@angular/core';
import { Link } from '../../../d3';
import { NodedataService } from '../../../nodedata.service';

@Component({
  selector: '[linkVisual]',
  template: `
    <svg:line
        class="link"
        [attr.x1]="link.source.x"
        [attr.y1]="link.source.y"
        [attr.x2]="link.target.x"
        [attr.y2]="link.target.y"
        (click)="linkClicked()"
    ></svg:line>
  `,
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent  {
  @Input('linkVisual') link: Link;
  constructor(private nodeDataService:NodedataService){
    
  }
  linkClicked(){
    this.nodeDataService.linkSelected.emit(this.link);

  }
}
