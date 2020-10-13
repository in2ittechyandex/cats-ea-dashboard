import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import * as $ from 'jquery';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-horizontalbar-charts',
  templateUrl: './am4-horizontalbar-charts.component.html',
  styleUrls: ['./am4-horizontalbar-charts.component.css']
})
export class Am4HorizontalbarChartsComponent implements OnInit, AfterViewInit {

  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Input() theme;

  constructor() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.dataProvider.data.length > 0) {
      this.buildChart();
    }
  }

  buildChart() {
    const interfaceColors = new am4core.InterfaceColorSet();

    const chart = am4core.create('' + this.chartUniqueId, am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon 

    chart.data = this.dataProvider.data;
    // the following line makes value axes to be arranged vertically.
    chart.bottomAxesContainer.layout = 'horizontal';
    chart.bottomAxesContainer.reverseOrder = true;
    chart.fontSize = 10;

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.dataProvider.config.titleField;
    // categoryAxis.renderer.grid.template.stroke = interfaceColors.getFor('background');
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.grid.template.strokeOpacity = 0; // 0.1 make 0 reduce cpu calculation time 14-10-2019
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10; // wil provide random label

    categoryAxis.renderer.opposite = true;

    // categoryAxis.width = am4core.percent(60);

    // categoryAxis.renderer.grid.template.disabled = true; // hide labels
    // categoryAxis.renderer.labels.template.disabled = true;
    // var label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    // label.maxWidth = 100;
    // chart.bottomAxesContainer.reverseOrder = true;


    const valueAxis2 = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.baseGrid.disabled = true;

    valueAxis2.renderer.labels.template.fillOpacity = 0;  // use to hide label value 14-10-2019

    // valueAxis2.marginRight = 1;
    // valueAxis2.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    // valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
    // valueAxis2.renderer.grid.template.stroke = interfaceColors.getFor('background');
    // valueAxis2.renderer.grid.template.strokeOpacity = 1;

    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.renderer.minGridDistance = 100;

    valueAxis2.title.text = this.dataProvider.config.xAxesTitle;

    const series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.showOnInit = false; // hide animation onload
    series2.dataFields.categoryY = this.dataProvider.config.titleField;
    series2.dataFields.valueX = this.dataProvider.config.valueField;
    series2.xAxis = valueAxis2;
    series2.name = this.dataProvider.config.yAxesTitle;
    series2.columns.template.tooltipText = '{categoryY}: [bold] :{valueX}[/]';
    // series2.columns.template.tooltipText = '{categoryY}\n'+
    //   'interface : name \n status1 : test \n status2:test2';


    // const bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    // bullet2.fillOpacity = 0;
    // bullet2.strokeOpacity = 0;
    // bullet2.tooltipText = '{valueX.value}';


    // const scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY = scrollbarY;

    let valueLabel = series2.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = '{valueX.value}';
    valueLabel.label.fontSize = 8;
    // valueLabel.marginRight = 10;
    // valueLabel.label.horizontalCenter = "left";
    valueLabel.label.dx = -5;

    // $("g[shape-rendering]").hide(); 
  }

}
