import { config } from 'rxjs';
import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);


@Component({
  selector: 'cats-am4-radiusradar-charts',
  templateUrl: './am4-radiusradar-charts.component.html',
  styleUrls: ['./am4-radiusradar-charts.component.css']
})
export class Am4RadiusradarChartsComponent implements OnInit,AfterViewInit,OnDestroy {
  private chart: am4charts.RadarChart;
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
  }

  ngAfterViewInit() {
    if (this.dataProvider.data.length > 0) {
         this.buildChart();
    }
  }

  buildChart() {

    var chart  = am4core.create(this.chartUniqueId, am4charts.RadarChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.logo.hidden = true; // hide amchart4 icon 

    var label = chart.createChild(am4core.Label);
    label.text = ""; // your chart Name here
    label.exportable = false;

    chart.data = this.dataProvider.data;
    chart.radius = am4core.percent(80);
    chart.startAngle = 270 - 180;
    chart.endAngle = 270 + 180;
    chart.innerRadius = am4core.percent(45);

    var categoryAxis: any = chart.xAxes.push(new am4charts.CategoryAxis<any>());
    categoryAxis.dataFields.category = this.dataProvider['config']['xAxesTitle'];  // this.dataProvider['config']['titleField'];//"Assignee"; WARNING should be titleField
    categoryAxis.renderer.labels.template.location = 0.5;
    // categoryAxis.renderer.grid.template.strokeOpacity =  1; //0.1; 14-10-2019
    categoryAxis.renderer.axisFills.template.disabled = true;
    categoryAxis.mouseEnabled = false;
    /* categoryAxis.renderer.opposite = true; */
    /* categoryAxis.labelPosition = "top"; */
    categoryAxis.renderer.labels.template.rotation = 270

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis<any>());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0.05;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.axisAngle = 260;
    valueAxis.renderer.labels.template.horizontalCenter = "right";
    valueAxis.min = 0;

    this.buildSeries(this.dataProvider['config']['yAxes'],chart);
    // var series1 = chart.series.push(new am4charts.RadarColumnSeries());
    // series1.columns.template.radarColumn.strokeOpacity = 1;
    // series1.name = "Opened";
    // series1.dataFields.categoryX = "Assignee";
    // series1.columns.template.tooltipText = "{name}: {valueY.value}";
    // series1.dataFields.valueY = "Opened";
    // series1.stacked = true;

    // var series2: any = chart.series.push(new am4charts.RadarColumnSeries());
    // series2.columns.template.radarColumn.strokeOpacity = 1;
    // series2.columns.template.tooltipText = "{name}: {valueY.value}";
    // series2.name = "Closed";
    // series2.dataFields.categoryX = "Assignee";
    // series2.dataFields.valueY = "Closed";
    // series2.stacked = true;
    // series2.labelPosition = "top";
    // series2.labelRotation = 270;

    /* var series3 = chart.series.push(new am4charts.RadarColumnSeries());
    series3.columns.template.radarColumn.strokeOpacity = 1;
    series3.columns.template.tooltipText = "{name}: {valueY.value}";  
    series3.name = "Series 3";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.stacked = true;
    
    var series4 = chart.series.push(new am4charts.RadarColumnSeries());
    series4.columns.template.radarColumn.strokeOpacity = 1;
    series4.columns.template.tooltipText = "{name}: {valueY.value}";
    series4.name = "Series 4";
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "value4";
    series4.stacked = true; */

    // chart.seriesContainer.zIndex = -1;
	
	
	// Create series
    var series = chart.series.push(new am4charts.RadarColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = this.dataProvider['config']['valueField'];
    series.dataFields.categoryX = this.dataProvider['config']['titleField'];
    series.columns.template.strokeWidth = 0;
    series.tooltipText = this.balloonFunction();
    series.columns.template.radarColumn.cornerRadius = 10;
    series.columns.template.radarColumn.innerCornerRadius = 0;

    series.tooltip.pointerOrientation = "vertical";

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.radarColumn.states.create("hover");
    hoverState.properties.cornerRadius = 0;
    hoverState.properties.fillOpacity = 1;

    // series.columns.template.events.on("hit", function(ev) {
    //   // // console.log("clicked on ", ev.target);
    //   // console.log("clicked on ", ev.target._dataItem.dataContext);

    // }, this);

    series.columns.template.events.on("hit", this.doOperationClickOnChart.bind(this));
    series.columns.template.events.on("rightclick", this.doOperationRightClickOnChart.bind(this)); // Added on 18-sep-2019 (V) (for right click)
    
    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    })
	
	

    var slider = chart.createChild(am4core.Slider);
    slider.start = 0.5;
    slider.exportable = false;
    slider.events.on("rangechanged", function () {
      var start = slider.start;
      chart.startAngle = 270 - start * 175 - 1;
      chart.endAngle = 270 + start * 175 + 1;
      valueAxis.renderer.axisAngle = chart.startAngle;
    });

  }
  
  
  // Added on 18-sep-2019 (V)
  doOperationRightClickOnChart(event){
    let xCord = event.event.pageX;
    let yCord = event.event.pageY;
    let screenX = event.event.screenX;
    let screenY = event.event.screenY;
    let res = {
      screenX:screenX,
      screenY:screenY,
      clientX: xCord,
      clientY: yCord,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };
    this.rightClickDetection.emit(res);
  }

  balloonFunction(): string {
    if (this.dataProvider.config['graphBalloonFn']) {
      let custFName = this.dataProvider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return "{categoryX} Hours: {valueY} Tickets";
      }
    }
    return "{categoryX}:{valueY}";
  }

  doOperationClickOnChart(event) {
    let xCord = event.event.pageX;
    let yCord = event.event.pageY;
    let screenX = event.event.screenX;
    let screenY = event.event.screenY;
    let res = {
      screenX:screenX,
      screenY:screenY,
      clientX: xCord,
      clientY: yCord,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };
    if (event.event.which == 1) {
      
      let label_ = event.target._dataItem.categoryX;
      let dataContext_ = event.target._dataItem.dataContext;
      let dataContextNextFilter_ = dataContext_['nextFilter'];
      let filterName_ = this.dataProvider.config['filterName'];
      // let valueCount_ = event.item.values.value;
      // let keyofLabel_ = "";
      // Object.keys(dataContext_).forEach(element => {
      //   if (dataContext_[element] == valueCount_) {
      //     keyofLabel_ = element;
      //   }
      // });

      let arrayDrill: any[] = [];
      let key = this.dataProvider.config.xAxesTitle;
      let value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.leftClickDetection.emit(res);
    } else if (event.event.which == 3) {

      let label_ = event.item.category;
      let dataContext_ = event.item.dataContext;
      let dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      let filterName_ = this.dataProvider.config['filterName'];
      let valueCount_ = event.item.values.value;
      let keyofLabel_ = "";
      Object.keys(dataContext_).forEach(element => {
        if (dataContext_[element] == valueCount_) {
          keyofLabel_ = element;
        }
      });

      let arrayDrill: any[] = [];
      let key = this.dataProvider.config.xAxesTitle;
      let value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.rightClickDetection.emit(res);

    }
  }


   buildSeries(arrSeries:Array<any>,chart){
    arrSeries.forEach((seriesName,index) => {
    let series = chart.series.push(new am4charts.RadarColumnSeries());
    series.showOnInit = false; // hide animation onload
    series.columns.template.radarColumn.strokeOpacity = 1;
    series.name = seriesName;
    series.dataFields.categoryX = this.dataProvider['config']['xAxesTitle'];
    series.columns.template.tooltipText = "{name}: {valueY.value}";
    series.dataFields.valueY = seriesName;
    series.stacked = true;
    });

    
   }


  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
    if (this.chart) {
      this.chart.dispose();
    }
    // });
  }

}
