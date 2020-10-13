import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'cats-am-tabular-chart',
  templateUrl: './am-tabular-chart.component.html',
  styleUrls: ['./am-tabular-chart.component.css']
})
export class AmTabularChartComponent implements OnInit,  AfterViewInit {

  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

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


  drill(event,data_,key){
    // console.log('drill data : '+event +': data_  '+JSON.stringify(data_));
    const xCord = event.pageX;
    const yCord = event.pageY;
    const screenX = event.screenX;
    const screenY = event.screenY;

    const res = {
      screenX: screenX,
      screenY: screenY,
      clientX: xCord,
      clientY: yCord,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };
    if (event.which === 1) {
      // const label_ = event.item.category;
      // const dataContext_ = event.item.dataContext;
      const dataContextNextFilter_ = data_['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      // const valueCount_ = event.item.values.value;
      const keyofLabel_ = key;

      const arrayDrill: any[] = [];
      // const key = this.dataProvider.config.xAxesTitle;
      // const value = label_;
      arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;
      // console.log('clickedData . 1 :'+res);
      this.leftClickDetection.emit(res);
    } else if (event.which === 3) {
      // Right Click Detect
       // const label_ = event.item.category;
      // const dataContext_ = event.item.dataContext;
      const dataContextNextFilter_ = data_['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      // const valueCount_ = event.item.values.value;
      const keyofLabel_ = key;

      const arrayDrill: any[] = [];
      // const key = this.dataProvider.config.xAxesTitle;
      // const value = label_;
      arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;
      // console.log('clickedData . 3 :'+res);
      // this.rightClickDetection.emit(res);
    }
  }

  // doOperationClickOnChart(event) {
  //   // console.log('stack---------------------------------');
  //   const xCord = event.event.pageX;
  //   const yCord = event.event.pageY;
  //   const screenX = event.event.screenX;
  //   const screenY = event.event.screenY;

  //   const res = {
  //     screenX: screenX,
  //     screenY: screenY,
  //     clientX: xCord,
  //     clientY: yCord,
  //     reportId: this.reportId,
  //     reportSequence: this.reportSequence
  //   };
  //   if (event.which === 1) {
  //     const label_ = event.item.category;
  //     const dataContext_ = event.item.dataContext;
  //     const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
  //     const filterName_ = this.dataProvider.config['filterName'];
  //     const valueCount_ = event.item.values.value;
  //     let keyofLabel_ = '';
  //     Object.keys(dataContext_).forEach(element => {
  //       // tslint:disable-next-line: triple-equals
  //       if (dataContext_[element] == valueCount_) {
  //         keyofLabel_ = element;
  //       }
  //     });

  //     const arrayDrill: any[] = [];
  //     const key = this.dataProvider.config.xAxesTitle;
  //     const value = label_;
  //     arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
  //     res['clickedData'] = arrayDrill;
  //     // console.log('clickedData . 1 :'+res);
  //     // this.leftClickDetection.emit(res);
  //   } else if (event.which === 3) {
  //     // Right Click Detect
  //     const label_ = event.item.category;
  //     const dataContext_ = event.item.dataContext;
  //     const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
  //     const filterName_ = this.dataProvider.config['filterName'];
  //     const valueCount_ = event.item.values.value;
  //     let keyofLabel_ = '';
  //     Object.keys(dataContext_).forEach(element => {
  //       // tslint:disable-next-line: triple-equals
  //       if (dataContext_[element] == valueCount_) {
  //         keyofLabel_ = element;
  //       }
  //     });

  //     const arrayDrill: any[] = [];
  //     const key = this.dataProvider.config.xAxesTitle;
  //     const value = label_;

  //     arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
  //     res['clickedData'] = arrayDrill;
  //     // console.log('clickedData . 3 :'+res);
  //     // this.rightClickDetection.emit(res);
  //   }
  // }

}

