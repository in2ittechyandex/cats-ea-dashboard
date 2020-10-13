import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpClient } from "@angular/common/http"
import * as $ from 'jquery';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-clustered-bar-chart',
  templateUrl: './am4-clustered-bar-chart.component.html',
  styleUrls: ['./am4-clustered-bar-chart.component.css']
})
export class Am4ClusteredBarChartComponent implements OnInit {
  chartData: any

  constructor(private _http: HttpClient) {
    // this._http.get("https://api.myjson.com/bins/13s1z5").subscribe(da=>{
    //   this.chartData = da
    // }
    //   , err=>{});
  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.fontSize = 10;

    chart.logo.hidden = true; // hide amchart4 icon 
    
    // chart.legend = new am4charts.Legend();
   
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "right";
    // chart.legend.width = 100;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;


    // Add data
    // chart.data = this.chartData;
    chart.data = [{
      "SID": "027RAND1742012688213",
      "Speed on BPM": 10,
      "Average Out Utilization": 1230.63
    }, {
      "SID": "027PORT2360011182924",
      "Speed on BPM": 10,
      "Average Out Utilization": 36.44
    }, {
      "SID": "027CAPE680010852446",
      "Speed on BPM": 100,
      "Average Out Utilization": 259.64
    }, {
      "SID": "027STAN1802012318388",
      "Speed on BPM": 5,
      "Average Out Utilization": 144.88
    }, {
      "SID": "027EAST1776009271579",
      "Speed on BPM": 6,
      "Average Out Utilization": 81.29
    },
    {
      "SID": "027CAPE680011071740",
      "Speed on BPM": 100,
      "Average Out Utilization": 172.10
    },
    {
      "SID": "027UMHL1802010589900",
      "Speed on BPM": 4,
      "Average Out Utilization": 58.31
    },
    {
      "SID": "027DURB1802008463330",
      "Speed on BPM": 10,
      "Average Out Utilization": 56.17
    },
    {
      "SID": "027JOHA2360012481276",
      "Speed on BPM": 102,
      "Average Out Utilization": 141.05
    }];

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "SID";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    
    categoryAxis.renderer.minGridDistance = 10; // wil provide random label 

    // categoryAxis.title.text = "SID";

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Bandwidth"
    // valueAxis.renderer.opposite = true;

    // Create series
    function createSeries(field, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "SID";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;

      let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueX}";
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      // categoryLabel.label.text = "{name}";
      categoryLabel.label.horizontalCenter = "right";
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color("#fff");
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }

    createSeries("Speed on BPM", "Speed on BPM");
    createSeries("Average Out Utilization", "Average Out Utilization");
    $("g[shape-rendering]").hide(); 
  }

}
