import { Component, OnInit, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-divergent-stacked-bars',
  templateUrl: './am4-divergent-stacked-bars.component.html',
  styleUrls: ['./am4-divergent-stacked-bars.component.css']
})
export class Am4DivergentStackedBarsComponent implements OnInit {
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
    // Create chart instance
    const chart = am4core.create('' + this.chartUniqueId, am4charts.XYChart);

    chart.logo.hidden = true; // hide amchart4 icon 

    // Title
    const title = chart.titles.push(new am4core.Label());
    // title.text = "Research tools used by students";
    title.fontSize = 11;
    title.marginBottom = 5;

    // Add data
    chart.data = this.dataProvider.data;
    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.dataProvider.config['titleField'];
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.axisFills.template.disabled = true;
    // categoryAxis.renderer.axisFills.template.fillOpacity = 1 ; // 0.05 to reduce cpu calculation time impact on : labels 14-10-2019

    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;


    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = -100;
    // valueAxis.max = 100;
    valueAxis.renderer.minGridDistance = 70;
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.ticks.template.disabled = true;
    // valueAxis.renderer.ticks.template.strokeOpacity = 0.04;

    valueAxis.renderer.labels.template.fillOpacity = 0;  // use to hide label value 14-10-2019

    valueAxis.renderer.grid.template.disabled = true;
  
     //valueAxis.renderer.labels.template.adapter.add("text", function(text) {
//		 // console.log('h -------------------------------- '+text);
  //     return  text;
   //  })

    
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "right";
    // chart.legend.width = 100;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;

    // 'horizontalGap': 0,
    //   'maxColumns': 6,
    //   'position': 'bottom',
    //   'useGraphSettings': false,
    //   'markerSize': 10,

    // Use only absolute numbers
    chart.numberFormatter.numberFormat = '#a';

    const interfaceColors = new am4core.InterfaceColorSet();
    const positiveColor = interfaceColors.getFor('positive');
    const negativeColor = interfaceColors.getFor('negative');

    const seriesList = this.dataProvider.config.yAxes;
    seriesList.forEach((keySeries, index) => {
      this.createSeries(keySeries, keySeries, chart, index == 0 ? positiveColor : negativeColor);
    });
  }

  createSeries(field, name, chart, color) {
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.showOnInit = false; // hide animation onload
    series.dataFields.valueX = field;
    series.dataFields.categoryY = this.dataProvider.config['titleField'];
    series.stacked = true;
    series.name = name;
    series.stroke = color;
    series.fill = color;
    series.columns.template.tooltipText = '{categoryY}: [bold]{name} :{valueX}[/]';
    // // console.log(series.columns.template);


    // var label = series.bullets.push(new am4charts.LabelBullet);
    // label.label.text = "{valueX}%";
    // label.label.fill = am4core.color("#fff");
    // label.label.strokeWidth = 0;
    // label.label.truncate = false;
    // label.label.hideOversized = true;
    // label.locationX = 0.5;
 

    return series;

  }

}
