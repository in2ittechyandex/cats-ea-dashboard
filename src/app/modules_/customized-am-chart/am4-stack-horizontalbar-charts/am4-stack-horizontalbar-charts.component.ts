import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';

// am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-stack-horizontalbar-charts',
  templateUrl: './am4-stack-horizontalbar-charts.component.html',
  styleUrls: ['./am4-stack-horizontalbar-charts.component.css']
})
export class Am4StackHorizontalbarChartsComponent implements OnInit, AfterViewInit {
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;

  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const interfaceColors = new am4core.InterfaceColorSet();

    const chart = am4core.create('' + this.chartUniqueId, am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon 
    chart.data = this.dataProvider.data;
    // the following line makes value axes to be arranged vertically.
    chart.bottomAxesContainer.layout = 'horizontal';
    chart.bottomAxesContainer.reverseOrder = true;

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.dataProvider.config['titleField'];
    categoryAxis.renderer.grid.template.stroke = interfaceColors.getFor('background');
    categoryAxis.renderer.grid.template.strokeOpacity = 1;
    categoryAxis.renderer.grid.template.location = 1;
    categoryAxis.renderer.minGridDistance = 10;

    const valueAxis2 = chart.xAxes.push(new am4charts.ValueAxis());
    // valueAxis2.min = 0;
    valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.marginRight = 10;
    valueAxis2.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis2.renderer.grid.template.stroke = interfaceColors.getFor('background');
    valueAxis2.renderer.grid.template.strokeOpacity = 1;
    valueAxis2.title.text = this.dataProvider.config['xAxesTitle'];

    const seriesList = this.dataProvider.config.yAxes;
    seriesList.forEach(keySeries => {
      this.createSeries(keySeries, keySeries, true, chart,valueAxis2);
    });


    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = 'zoomY';

    // const scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX = scrollbarX;
  }

  createSeries(field, name, stacked,chart,valueAxis2) {
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.showOnInit = false; // hide animation onload
    series.dataFields.categoryY = this.dataProvider.config['titleField'];
    series.dataFields.valueX = field;
    series.xAxis = valueAxis2;
    series.name = name;
    series.stacked = stacked;
    series.columns.template.tooltipText = '{categoryY}: [bold]{name} :{valueX}[/]';
  }


}
