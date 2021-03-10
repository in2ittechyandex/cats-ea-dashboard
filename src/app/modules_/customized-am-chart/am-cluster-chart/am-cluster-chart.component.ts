import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FocusTrap } from '@angular/cdk/a11y';
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
// am4core.useTheme(am4themes_animated);
// am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_material);
@Component({
  selector: 'cats-am-cluster-chart',
  templateUrl: './am-cluster-chart.component.html',
  styleUrls: ['./am-cluster-chart.component.css']
})
export class AmClusterChartComponent implements OnInit {
  @Input('chartData') chartData: Array<any>;
  @Output() alarmIdChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log(this.chartData);
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;




    // Add data
    chart.data = [{
      "nms": "nms1",
      "c1": 2.5,
      "c2": 2.5,
      "c3": 2.1,
      "c4": 1.2,
      "c5": 0.2,
      "c6": 0.1
    }, {
      "nms": "nms2",
      "c1": 2.6,
      "c2": 2.7,
      "c3": 2.2,
      "c4": 1.3,
      "c5": 0.3,
      "c6": 0.1
    }, {
      "nms": "nms3",
      "c1": 2.8,
      "c2": 2.9,
      "c3": 2.4,
      "c4": 1.4,
      "c5": 0.3,
      "c6": 0.1
    }];
    chart.data = this.chartData['data'];
    // chart.data = this.getChartData(); 

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nms";
    categoryAxis.title.text = "Element Manager";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Count";

    



    let legenddata = [];
    var seriesData = this.chartData["config"]["legend"];
    var seriesDataKeys = Object.keys(seriesData);
    for (var i = 0; i < seriesDataKeys.length; i++) {
      this.createSeries(chart,seriesDataKeys[i], seriesData[seriesDataKeys[i]].displayname, false, seriesData[seriesDataKeys[i]].color);
      legenddata.push({
        name: seriesData[seriesDataKeys[i]].displayname,
        fill: am4core.color(seriesData[seriesDataKeys[i]].color)
      })
    }

    //Add legend
    chart.legend = new am4charts.Legend();

    /* Create a separate container to put legend in */
    var legendContainer = am4core.create("legenddiv", am4core.Container);
    legendContainer.width = am4core.percent(100);
    legendContainer.height = am4core.percent(100);
    chart.legend.parent = legendContainer;

    legendContainer.logo.hidden = true; // hide amchart4 icon
    legendContainer.logo.disabled = true;
    chart.events.on("datavalidated", resizeLegend);
    chart.events.on("maxsizechanged", resizeLegend);

    function resizeLegend(ev) {
      document.getElementById("legenddiv").style.height = chart.legend.contentHeight + "px";
    }


    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;

    chart.legend.data = legenddata;
  }

// Create series
  createSeries(chart,field, name, stacked, color) {
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = field;
  series.dataFields.valueX = name;
  series.dataFields.categoryX = "nms";
  series.dataFields.categoryY = name;
  series.name = name;
  series.stacked = stacked;
  series.fillOpacity = 0;
  series.strokeOpacity = 1;
  series.columns.template.width = 0.0;
 
  var bullet1 = series.bullets.push(new am4charts.CircleBullet()); 

bullet1.tooltipText = field+'----'+name+`----[/]
NMS: {categoryX}
Count: {valueY}`;

bullet1.dummyData="its dummy data";
bullet1.circle.fill = am4core.color(color);
bullet1.clickable=true; 
bullet1.events.on('hit', (ev: any) => {
  const val = ev.target;//._dataItem;//._dataContext;
  // console.log(val.properties.tooltipText); 
  let toolTip=val.properties.tooltipText;
  var splitted = toolTip.split("----"); 
  let clusterName=splitted[0];
// console.log(splitted)
  // console.log( ev.target._dataItem.categories.categoryX);
 let tData={
   'cluster':clusterName,
   'nms':ev.target._dataItem.categories.categoryX
 }
  this.alarmIdChange.emit(tData);
}, this);
// series.columns.template.events.on("hit", function(ev) {
//   console.log("clicked on ", ev.target);
// }, this);
series.heatRules.push({
  target: bullet1.circle,
  min: 10,
  max: 60,
  property: "radius"
});

}

  


}




