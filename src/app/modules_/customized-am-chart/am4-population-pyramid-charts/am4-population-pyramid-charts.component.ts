import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-population-pyramid-charts',
  templateUrl: './am4-population-pyramid-charts.component.html',
  styleUrls: ['./am4-population-pyramid-charts.component.css']
})
export class Am4PopulationPyramidChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var mainContainer = am4core.create("chartdiv", am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = "horizontal";
    
    var usData = [
      {
        "age": "0 to 5",
        "male": 10175713,
        "female": 9736305
      },
      {
        "age": "5 to 9",
        "male": 10470147,
        "female": 10031835
      },
      {
        "age": "10 to 14",
        "male": 10561873,
        "female": 10117913
      },
      {
        "age": "15 to 17",
        "male": 6447043,
        "female": 6142996
      },
      {
        "age": "18 to 21",
        "male": 9349745,
        "female": 8874664
      },
      {
        "age": "22 to 24",
        "male": 6722248,
        "female": 6422017
      },
      {
        "age": "25 to 29",
        "male": 10989596,
        "female": 10708414
      },
      {
        "age": "30 to 34",
        "male": 10625791,
        "female": 10557848
      },
      {
        "age": "35 to 39",
        "male": 9899569,
        "female": 9956213
      },
      {
        "age": "40 to 44",
        "male": 10330986,
        "female": 10465142
      },
      {
        "age": "45 to 49",
        "male": 10571984,
        "female": 10798384
      },
      {
        "age": "50 to 54",
        "male": 11051409,
        "female": 11474081
      },
      {
        "age": "55 to 59",
        "male": 10173646,
        "female": 10828301
      },
      {
        "age": "60 to 64",
        "male": 8824852,
        "female": 9590829
      },
      {
        "age": "65 to 69",
        "male": 6876271,
        "female": 7671175
      },
      {
        "age": "70 to 74",
        "male": 4867513,
        "female": 5720208
      },
      {
        "age": "75 to 79",
        "male": 3416432,
        "female": 4313697
      },
      {
        "age": "80 to 84",
        "male": 2378691,
        "female": 3432738
      },
      {
        "age": "85 and Older",
        "male": 2000771,
        "female": 3937981
      }
    ];
    
    var maleChart = mainContainer.createChild(am4charts.XYChart);
    maleChart.logo.hidden = true; // hide amchart4 icon 

    maleChart.paddingRight = 0;
    maleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
    maleCategoryAxis.dataFields.category = "age";
    maleCategoryAxis.renderer.grid.template.location = 0;
    //maleCategoryAxis.renderer.inversed = true;
    maleCategoryAxis.renderer.minGridDistance = 15;
    
    var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
    maleValueAxis.renderer.inversed = true;
    maleValueAxis.min = 0;
    maleValueAxis.max = 10;
    maleValueAxis.strictMinMax = true;
    
    maleValueAxis.numberFormatter = new am4core.NumberFormatter();
    maleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    
    // Create series
    var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
    maleSeries.dataFields.valueX = "male";
    maleSeries.dataFields.valueXShow = "percent";
    maleSeries.calculatePercent = true;
    maleSeries.dataFields.categoryY = "age";
    maleSeries.interpolationDuration = 1000;
    maleSeries.columns.template.tooltipText = "Males, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    //maleSeries.sequencedInterpolation = true;
    
    
    var femaleChart = mainContainer.createChild(am4charts.XYChart);
    femaleChart.paddingLeft = 0;
    femaleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
    femaleCategoryAxis.renderer.opposite = true;
    femaleCategoryAxis.dataFields.category = "age";
    femaleCategoryAxis.renderer.grid.template.location = 0;
    femaleCategoryAxis.renderer.minGridDistance = 15;
    
    var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
    femaleValueAxis.min = 0;
    femaleValueAxis.max = 10;
    femaleValueAxis.strictMinMax = true;
    femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
    femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    femaleValueAxis.renderer.minLabelPosition = 0.01;
    
    // Create series
    var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
    femaleSeries.dataFields.valueX = "female";
    femaleSeries.dataFields.valueXShow = "percent";
    femaleSeries.calculatePercent = true;
    femaleSeries.fill = femaleChart.colors.getIndex(4);
    femaleSeries.stroke = femaleSeries.fill;
    //femaleSeries.sequencedInterpolation = true;
    femaleSeries.columns.template.tooltipText = "Females, age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    femaleSeries.dataFields.categoryY = "age";
    femaleSeries.interpolationDuration = 1000;

  }

}
