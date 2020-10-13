import { Component, OnInit, NgZone, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";


// am4core.useTheme(am4themes_animated);


@Component({
  selector: 'cats-am4-radial-histogram-charts',
  templateUrl: './am4-radial-histogram-charts.component.html',
  styleUrls: ['./am4-radial-histogram-charts.component.css']
})
export class Am4RadialHistogramChartsComponent implements OnInit,AfterViewInit {
  
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
  
  constructor(private zone: NgZone) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.dataProvider.data.length > 0) {
         this.buildChart();
    }
  }


  buildChart() {
    // this.zone.runOutsideAngular(() => {
    let chart = am4core.create(this.chartUniqueId, am4charts.RadarChart);

    chart.logo.hidden = true; // hide amchart4 icon 

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;  // position scroll bottom

    chart.paddingRight = 20

    // chart.data = [{"Hour":"00","nextFilter":"00","Count":"2"},{"Hour":"01","nextFilter":"01","Count":"3"},{"Hour":"02","nextFilter":"02","Count":"3"},{"Hour":"03","nextFilter":"03","Count":"4"},{"Hour":"04","nextFilter":"04","Count":"3"},{"Hour":"05","nextFilter":"05","Count":"3"},{"Hour":"06","nextFilter":"06","Count":"5"},{"Hour":"07","nextFilter":"07","Count":"20"},{"Hour":"08","nextFilter":"08","Count":"40"},{"Hour":"09","nextFilter":"09","Count":"57"},{"Hour":"10","nextFilter":"10","Count":"39"},{"Hour":"11","nextFilter":"11","Count":"10"}]
    chart.data = this.dataProvider['data']; //[{"nextFilter":"00","Tickets":"11.0","Hour":"00"},{"nextFilter":"01","Tickets":"10.0","Hour":"01"},{"nextFilter":"02","Tickets":"11.0","Hour":"02"},{"nextFilter":"03","Tickets":"20.0","Hour":"03"},{"nextFilter":"04","Tickets":"90.0","Hour":"04"},{"nextFilter":"05","Tickets":"34.0","Hour":"05"},{"nextFilter":"06","Tickets":"27.0","Hour":"06"},{"nextFilter":"07","Tickets":"58.0","Hour":"07"},{"nextFilter":"08","Tickets":"12.0","Hour":"08"},{"nextFilter":"09","Tickets":"104.0","Hour":"09"},{"nextFilter":"10","Tickets":"132.0","Hour":"10"},{"nextFilter":"11","Tickets":"72.0","Hour":"11"},{"nextFilter":"12","Tickets":"88.0","Hour":"12"},{"nextFilter":"13","Tickets":"12.0","Hour":"13"},{"nextFilter":"14","Tickets":"90.0","Hour":"14"},{"nextFilter":"15","Tickets":"19.0","Hour":"15"},{"nextFilter":"16","Tickets":"8.0","Hour":"16"},{"nextFilter":"17","Tickets":"4.0","Hour":"17"},{"nextFilter":"18","Tickets":"3.0","Hour":"18"},{"nextFilter":"19","Tickets":"23.0","Hour":"19"},{"nextFilter":"20","Tickets":"2.0","Hour":"20"},{"nextFilter":"21","Tickets":"89.0","Hour":"21"},{"nextFilter":"22","Tickets":"2.0","Hour":"22"},{"nextFilter":"23","Tickets":"7.0","Hour":"23"}];
    chart.radius = am4core.percent(100);
    chart.innerRadius = am4core.percent(50);

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis<any>());
    categoryAxis.dataFields.category = this.dataProvider['config']['titleField'];
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    //categoryAxis.renderer.labels.template.disabled = true;
    let labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.radius = am4core.percent(-60);
    labelTemplate.location = 0.5;
    labelTemplate.relativeRotation = 90;  

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis<any>());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.tooltip.disabled = true;

    // Create series
    var series = chart.series.push(new am4charts.RadarColumnSeries());
    series.showOnInit = false; // hide animation onload
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

    // Cursor
    chart.cursor = new am4charts.RadarCursor();
    chart.cursor.innerRadius = am4core.percent(50);
    chart.cursor.lineY.disabled = true;
    this.chart = chart;
    // });
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


  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    // });
  }

 /**
   * this f/n used to manage custom hover f/nality on bar
   * @param graphDataItem graph bar items
   * @param graph graph object
   */
  balloonFunction(): string {
    if (this.dataProvider.config['graphBalloonFn']) {
      let custFName = this.dataProvider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return "{categoryX} Hours: {valueY} Tickets";
      }
    }
    return "{categoryX}:{valueY}";
  }

  custLabelFunction(graphDataItem, graph): string {
    const value = graphDataItem.values.value;
    const title = graph.title;
    const category = graphDataItem.category;
    if (this.dataProvider.config['graphLabelFn']) {
      let custFName = this.dataProvider.config['graphLabelFn'];
      if (custFName === 'hourwisetrends') {
        return value;
      }
    }
    return value;
  }


}
