import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);



@Component({
  selector: 'cats-am4-micro-charts-sparklines',
  templateUrl: './am4-micro-charts-sparklines.component.html',
  styleUrls: ['./am4-micro-charts-sparklines.component.css']
})
export class Am4MicroChartsSparklinesComponent implements OnInit, AfterViewInit {

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
    // Create chart instance
    var container = am4core.create(this.chartUniqueId, am4core.Container);
    container.logo.hidden = true; // hide amchart4 icon 
    container.layout = "grid";
    container.fixedWidthGrid = false;
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    // Color set
    var colors = new am4core.ColorSet();
    this.buildCharts(container, this.dataProvider.data, colors);

  }

  buildCharts(container, myData, colors) {
    for (var i = 0; i < myData.series.length; i++) {
      var series_ = myData.series[i];
      if (series_.hasOwnProperty('line')) {
        this.createLine(container, series_['line'].data.charts, colors.getIndex(i));
      }
      if (series_.hasOwnProperty('bar')) {
        this.createBar(container, series_['bar'].data.charts, colors.getIndex(i));
      }
      if (series_.hasOwnProperty('pie')) {
        this.createPie(container, series_['pie'].data.charts, colors.getIndex(i));
      }
    }
  }

  createPie(container, providerData, color) {
    var chart = container.createChild(am4charts.PieChart);
    // chart.logo.hidden = true; // hide amchart4 icon 

    chart.width = am4core.percent(15);
    chart.height = 70;
    chart.padding(20, 0, 2, 0);
    chart.data = providerData.data;
    chart.titles.create().text = providerData.config['reportTitle']; //'Pie Chart Title';

    // Add and configure Series r
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.showOnInit = false; // hide animation onload
    pieSeries.dataFields.value = providerData.config.valueField;
    pieSeries.dataFields.category = providerData.config.titleField;
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.fill = color;
    // pieSeries.slices.template.adapter.add("fill", function (fill, target) {
    //   return fill.lighten(0.1 * target.dataItem.index);
    // });
    pieSeries.slices.template.stroke = am4core.color("#fff");

    // chart.chartContainer.minHeight = 40;
    // chart.chartContainer.minWidth = 40;

    return chart;

  }


  // Functions that create various sparklines
  createLine(container, providerData, color) {

    var chart = container.createChild(am4charts.XYChart);
    // chart.logo.hidden = true; // hide amchart4 icon 
    chart.width = am4core.percent(40);
    chart.height = 70;

    chart.data = providerData.data;

    chart.titles.template.fontSize = 10;
    chart.titles.template.textAlign = "left";
    chart.titles.template.isMeasured = false;
    chart.titles.create().text = providerData.config['reportTitle']; // 'Line Chart Title';

    chart.padding(20, 5, 2, 5);

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.7;
    dateAxis.cursorTooltipEnabled = false;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 1;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.behavior = "none";

    var series = chart.series.push(new am4charts.LineSeries());
    //"{" + providerData.config.titleField + "}: [bold]{" + providerData.config.valueField + "}";
    series.showOnInit = false; // hide animation onload
    series.dataFields.dateX = providerData.config.titleField;
    series.dataFields.valueY = providerData.config.valueField;
    series.tooltipText = this.balloonFunctionLine(providerData);
    series.tensionX = 1.8;
    series.strokeWidth = 2;
    series.stroke = color;
    return chart;
  }

  createBar(container, providerData, color) {
    var chart = container.createChild(am4charts.XYChart);
    // chart.logo.hidden = true; // hide amchart4 icon 

    chart.data = providerData.data;
    chart.width = am4core.percent(45);
    chart.height = 70;
    chart.titles.template.fontSize = 10;
    chart.titles.template.textAlign = "left";
    chart.titles.template.isMeasured = false;

    chart.titles.create().text = providerData.config['reportTitle'];//'Bar Chart Title';
    chart.padding(10, 5, 2, 5);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = providerData.config['titleField'];
    // categoryAxis.title.text = providerData.config['titleField'];
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.cursorTooltipEnabled = false;


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = providerData.config['yAxisTitle'];
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;

    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.lineY.disabled = true;

    let seriesList = providerData.config.yAxes;
    seriesList.forEach(keySeries => {
      this.createSeries(chart, keySeries, providerData, true);
    });
  }

  createSeries(chart, field, providerData_, stacked) {
    let name = providerData_.config['titleField'];
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.showOnInit = false; // hide animation onload
    series.dataFields.valueY = field;
    series.dataFields.categoryX = name;
    series.name = field;
    series.columns.template.tooltipText = this.balloonFunctionStack(providerData_); //"{categoryX}:[bold] " + field + " {valueY}[/]";
    series.stacked = stacked;
    series.columns.template.width = am4core.percent(45);
    series.strokeWidth = 5;
    series.fillOpacity = 1;
    // series.columns.template.propertyFields.fillOpacity = "opacity";

  }

  balloonFunctionStack(provider): string {
    if (provider.config['graphBalloonFn']) {
      let custFName = provider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return "{categoryX} Hours: {valueY} Tickets :{name} Priority";
      }
    }
    return "{categoryX}:{valueY}";
  }

  balloonFunctionLine(provider): string {
    if (provider.config['graphBalloonFn']) {
      let custFName = provider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return "{" + provider.config.titleField + "} Hours : [bold]{" + provider.config.valueField + "} Tickets";
      }
    }
    return "{" + provider.config.titleField + "}: [bold]{" + provider.config.valueField + "}";
  }




}
