import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import themeConf_ from '../../../config/theme-settings';


@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  inputs: ['title', 'variant', 'noBody', 'noButton', 'bodyClass', 'footerClass', 'panelClass', 'buttonsArr'],
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewInit, OnInit {
  @ViewChild('panelFooter') panelFooter;
  showFooter = false;
  themeConf_;

  @Input() dataObj: any;
  @Input() reload: any = false;

  @Input() expand: any = false;
  @Input() collapse: any = false;
  @Input() remove: any = false;
  @Input() print: any = false;

  @Input() buttonArr: any = ['back', 'expand', 'reload', 'collapse', 'remove', 'print'];
  @Input() buttonExpand: any = ['reload', 'expand', 'collapse'];

  @Output() event = new EventEmitter();

  ngAfterViewInit() {
    setTimeout(() => {
      this.showFooter = this.panelFooter.nativeElement && this.panelFooter.nativeElement.children.length > 0;
    });
  }

  ngOnInit() {
    this.themeConf_ = themeConf_;
  }

  panelExpand() {
    this.expand = !this.expand;
    this.event.emit({ eventType: 'expand', modifiedObj: this.dataObj, value: this.expand });
  }
  panelReload() {
    this.reload = true;
    this.event.emit({ eventType: 'reload', modifiedObj: this.dataObj });
    setTimeout(() => {
      this.reload = false;
    }, 1000);
  }
  panelCollapse() {
    this.collapse = !this.collapse;
    this.event.emit({ eventType: 'collapse', modifiedObj: this.dataObj, value: this.collapse });
  }
  panelRemove() {
    this.event.emit({ eventType: 'close', modifiedObj: this.dataObj });

  }

  clickOnForecast() {
    this.event.emit({ eventType: 'forecast', modifiedObj: this.dataObj });
  }

  clickOnBack() {
    this.event.emit({ eventType: 'back', modifiedObj: this.dataObj });
  }

  constructor() { }

  public printPanelChart() {
    this.event.emit({ eventType: 'print', modifiedObj: this.dataObj });
  }


}

