import { Component, OnInit, Input } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-dumbbell-plot-charts',
  templateUrl: './am4-dumbbell-plot-charts.component.html',
  styleUrls: ['./am4-dumbbell-plot-charts.component.css']
})
export class Am4DumbbellPlotChartsComponent implements OnInit {
  private chart: am4charts.XYChart

  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  //public dataPro = {"data":[{"Opened":"34","Closed":"1","nextFilter":"","Date":"11-09-2019"},{"Date":"11-09-2019","Opened":"134","Closed":"12","nextFilter":""}],"config":{"sortKey":"Date","titleField":"Date","xAxesTitle":"Date","yAxes":["Opened","Closed"],"xAxes":"Date","filterName":"assigned_to","valueField":"Tickets","yAxesTitle":"Tickets"}};

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    if(this.dataProvider && this.dataProvider.data.length>0){
      this.buildChart();
    }
  }

  buildChart(){
    let chart = am4core.create(this.chartUniqueId, am4charts.XYChart);

    chart.logo.hidden = true; // hide amchart4 icon 
    
    // chart.width = am4core.percent(99);
    // chart.height = 400;
    chart.legend = new am4charts.Legend();
    chart.data = this.dataProvider.data;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = this.dataProvider.config.titleField;//"category";
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
    categoryAxis.renderer.labels.template.rotation = -90; // rotate label bottom -90 up side
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.inside = false; // prevent labels tobe aded inside chart

    // categoryAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
    //   return -target.maxRight / 2;
    // })

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.showOnInit = false; // hide animation onload
    series.dataFields.categoryX = this.dataProvider.config.titleField;
    series.dataFields.openValueY = this.dataProvider.config.yAxes[0]; //"open";
    series.dataFields.valueY = this.dataProvider.config.yAxes[1];//"close";
    series.tooltipText = this.dataProvider.config.yAxes[0]+": {openValueY.value}"+  this.dataProvider.config.yAxes[1]+" {valueY.value}";
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.columns.template.width = 1; // 0.5 to 1 stroke width 14-10-2019
    series.tooltip.pointerOrientation = "horizontal";

    let openBullet: any = series.bullets.create(am4charts.CircleBullet);
    openBullet.locationY = 1;

    let closeBullet = series.bullets.create(am4charts.CircleBullet);
    closeBullet.fill = chart.colors.getIndex(4);
  
    // Added our custom markers 
    let legenddata = [];
    legenddata.push({
      name: series.dataFields.valueY,
      fill: chart.colors.getIndex(0)
    },{
      name: series.dataFields.openValueY,
      fill: chart.colors.getIndex(4)
    })
   
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;

    chart.legend.data = legenddata;

    chart.legend.itemContainers.template.clickable = false; // disable chart click
    chart.legend.itemContainers.template.focusable = false; // disable chart edit
    chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default; // hide mouse hover
    closeBullet.stroke = closeBullet.fill;

    // chart.cursor = new am4charts.XYCursor();

    // chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarY = new am4core.Scrollbar();
  }
  
  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    // });
  }

}
