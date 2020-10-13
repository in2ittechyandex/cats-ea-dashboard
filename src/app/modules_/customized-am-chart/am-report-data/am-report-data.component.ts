import { Component, Input, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'cats-am-report-data',
  templateUrl: './am-report-data.component.html',
  styleUrls: ['./am-report-data.component.css']
})
export class AmReportDataComponent implements OnInit,  AfterViewInit {

  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  private headers: any[] = [];
  private data: any[] = [];
  constructor() { }

  ngAfterViewInit() {
    // if(this.dataProvider){
    //   this.headers = this.dataProvider.config.yAxes;
    //   this.data = this.dataProvider.data;
    // }
  }

  ngOnInit() {
    if (this.dataProvider) {
      this.headers = this.dataProvider.config.yAxes;
      this.data = this.dataProvider.data;
    }
  }


}

