import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'cats-am4-msline-chart',
  templateUrl: './am4-msline-chart.component.html',
  styleUrls: ['./am4-msline-chart.component.css']
})
export class Am4MslineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if(this.dataProvider.length>0){
      for(var i=0;i<this.dataProvider.length;i++){
        this.dataProvider[i].date=this.getDate(this.dataProvider[i].date);
        this.dataProvider[i].actual=parseInt(this.dataProvider[i].actual);
        this.dataProvider[i].expected=parseInt(this.dataProvider[i].expected);
        // this.dataProvider[i].actual=Math.floor(Math.random() * i);
        // this.dataProvider[i].expected=Math.floor(Math.random() * i);
      }
    }
  }
  getDate(str){
    return new Date(str);
  }

  ngAfterViewInit() {
    // if (this.dataProvider.data.length > 0) {
      this.buildChart();
    // }
  }

  buildChart() {

    var chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.paddingRight = 20; 
    chart.logo.hidden = true; // hide amchart4 icon
        chart.logo.disabled = true;
    
    chart.data = this.dataProvider; 
    // chart.data = [
    //   {date:new Date(2019,5,12), actual:50, expected:48, previousDate:new Date(2019, 5, 5)},
    //   {date:new Date(2019,5,13), actual:53, expected:51, previousDate:new Date(2019, 5, 6)},
    //   {date:new Date(2019,5,14), actual:56, expected:58, previousDate:new Date(2019, 5, 7)},
    //   {date:new Date(2019,5,15), actual:52, expected:53, previousDate:new Date(2019, 5, 8)},
    //   {date:new Date(2019,5,16), actual:48, expected:44, previousDate:new Date(2019, 5, 9)},
    //   {date:new Date(2019,5,17), actual:47, expected:42, previousDate:new Date(2019, 5, 10)},
    //   {date:new Date(2019,5,18), actual:59, expected:55, previousDate:new Date(2019, 5, 11)}
    // ]
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis()); 
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.title.text = "Events Count";
    
    var series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.dateX = "date";
    series1.dataFields.valueY = "actual"; 
    // series1.stroke = am4core.color("blue");
    
     series1.strokeOpacity = 1;  
     var bullet1 = series1.bullets.push(new am4charts.CircleBullet());
    //  bullet1.circle.fill = am4core.color("blue");
    bullet1.tooltipText = "Actual: {actual} Expected: {expected}";
     series1.heatRules.push({
       target: bullet1.circle,
       min: 10,
       max: 60,
       property: "radius"
     });
     
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "expected";  
    // series2.stroke = am4core.color("orange");
    series2.strokeOpacity = 1; 
    var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    // bullet2.circle.fill = am4core.color("orange");
    series2.heatRules.push({
      target: bullet2.circle,
      min: 10,
      max: 60,
      property: "radius"
    });
    
     
    
     
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    // /* chart.scrollbarX.series.push(series); */
    
    
    dateAxis.start = 0;
    dateAxis.keepSelection = true;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}

