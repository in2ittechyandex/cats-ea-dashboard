import { map } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);


@Component({
  selector: 'cats-am4-solid-gauge-charts',
  templateUrl: './am4-solid-gauge-charts.component.html',
  styleUrls: ['./am4-solid-gauge-charts.component.css']
})
export class Am4SolidGaugeChartsComponent implements OnInit,AfterViewInit {
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

  // public myData = [
  //   {
  //     "nextFilter": "Email",
  //     "Count": "9333",
  //     "Source": "Email",
  //     "fill":"100"
  //   },
  //   {
  //     "nextFilter": "Phone",
  //     "Count": "1607",
  //     "Source": "Phone",
  //      "fill":"100"
  //   },
  //   {
  //     "nextFilter": "Proactive alert",
  //     "Count": "586",
  //     "Source": "Proactive alert",
  //      "fill":"100"
  //   },
  //   {
  //     "nextFilter": "Integration",
  //     "Count": "5",
  //     "Source": "Integration",
  //      "fill":"100"
  //   },
  //   {
  //     "nextFilter": "Self-service",
  //     "Count": "4",
  //     "Source": "Self-service",
  //      "fill":"100"
  //   }
  // ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.dataProvider.data.length > 0) {
         this.buildChart();
    }
  }

  buildChart() {
    this.dataProvider.data.map(elm=>{
      elm['full'] = '100';
    })

    var chart = am4core.create(this.chartUniqueId, am4charts.RadarChart);
    chart.logo.hidden = true; // hide amchart4 icon 

    // Add data
    chart.data =  this.dataProvider.data;
    // Make chart not full circle
    chart.startAngle = -90;
    chart.endAngle = 180;
    chart.innerRadius = am4core.percent(20);

    // Set number format
    chart.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis<any>());
    categoryAxis.dataFields.category = this.dataProvider['config']['titleField'];
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.fontWeight = 500;

    //Add if u wants to add custome colors :  TODO : fetch color details based on theme selection
    categoryAxis.renderer.labels.template.adapter.add("fill", function(fill, target) {
      return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
    });
    categoryAxis.renderer.minGridDistance = 10;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis<any>());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;

    // Create series
    var series1:any = chart.series.push(new am4charts.RadarColumnSeries());
    series1.showOnInit = false; // hide animation onload
    series1.dataFields.valueX = "full";
    series1.dataFields.categoryY = this.dataProvider['config']['titleField'];//"Source";
    series1.clustered = false;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1.columns.template.fillOpacity = 0.08;
    series1.columns.template.cornerRadiusTopLeft = 20;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    var series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.showOnInit = false; // hide animation onload
    series2.dataFields.valueX = this.dataProvider['config']['valueField']; //"Count";
    series2.dataFields.categoryY = this.dataProvider['config']['titleField'];//"Source";
    series2.clustered = false;
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = this.balloonFunction(); //"{Source}: [bold]{Count}[/]";
    series2.columns.template.radarColumn.cornerRadius = 20;

    series2.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Add cursor
    chart.cursor = new am4charts.RadarCursor();

      }

      ngOnDestroy() {
        // this.zone.runOutsideAngular(() => {
          if (this.chart) {
            this.chart.dispose();
          }
        // });
      }

      // buildSeries(arrSeries:Array<any>,chart){
      //   arrSeries.forEach((seriesName,index) => {
      //   let series = chart.series.push(new am4charts.RadarColumnSeries());
      //   series.columns.template.radarColumn.strokeOpacity = 1;
      //   series.name = seriesName;
      //   series.dataFields.categoryX = this.dataProvider['config']['xAxesTitle'];
      //   series.columns.template.tooltipText = "{name}: {valueY.value}";
      //   series.dataFields.valueY = seriesName;
      //   series.stacked = true;
      //   });
    
        
      //  }


        /**
   * this f/n used to manage custom hover f/nality on bar
   * @param graphDataItem graph bar items
   * @param graph graph object
   */
  balloonFunction(): string {
    if (this.dataProvider.config['graphBalloonFn']) {
      let custFName = this.dataProvider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return "{"+ this.dataProvider['config']['titleField']+"}: [bold]{"+this.dataProvider['config']['valueField']+"}[/]";
      }
    }
    return "{"+ this.dataProvider['config']['titleField']+"}: [bold]{"+this.dataProvider['config']['valueField']+"}[/]";
  }

}
