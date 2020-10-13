import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-bars-with-moving-bullets',
  templateUrl: './am4-bars-with-moving-bullets.component.html',
  styleUrls: ['./am4-bars-with-moving-bullets.component.css']
})
export class Am4BarsWithMovingBulletsComponent implements OnInit,AfterViewInit {
  private chart: am4charts.XYChart
  // public myData = [{"nextFilter":"Himanshu Tomar","Tickets":"633","Count":"Himanshu Tomar","href":"assets/img_alpha/a.png"},{"nextFilter":"","Tickets":"466","Count":"","href":"assets/img_alpha/b.png"},{"nextFilter":"Vasu Garg","Tickets":"357","Count":"Vasu Garg","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Suresh Uniyal","Tickets":"319","Count":"Suresh Uniyal","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Shahid Sheikh","Tickets":"307","Count":"Shahid Sheikh","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Nitish Rana","Tickets":"299","Count":"Nitish Rana","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Abhishek Singh","Tickets":"273","Count":"Abhishek Singh","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Anny Tyagi","Tickets":"267","Count":"Anny Tyagi","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Vishal Sharma","Tickets":"255","Count":"Vishal Sharma","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"},{"nextFilter":"Prince Arora","Tickets":"250","Count":"Prince Arora","href":"https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"}];

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

    var chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.logo.hidden = true; // hide amchart4 icon 

    chart.paddingRight = 10;
    chart.fontSize = 10;


    chart.data = this.dataProvider.data;
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.dataProvider['config']['titleField'];
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dx = -40;
    categoryAxis.renderer.minWidth = 140;  // 120 use to manage label & chart distance
    categoryAxis.renderer.tooltip.dx = -40;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0;  // 0.3 make 0 to reduce cpu calculation time impact on : labels 14-10-2019
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;
    valueAxis.renderer.labels.template.dy = 20;

    

    var series = chart.series.push(new am4charts.ColumnSeries);
    series.showOnInit = false; // hide animation onload
    series.dataFields.valueX = this.dataProvider['config']['valueField'];//"Tickets";
    series.dataFields.categoryY = this.dataProvider['config']['titleField']//"Count";

    // series.dataFields.valueY = this.dataProvider['config']['valueField'];
    // series.dataFields.categoryX = this.dataProvider['config']['titleField'];

    series.tooltipText = "{valueX.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = - 30;
    series.columnsContainer.zIndex = 100;

    var columnTemplate = series.columns.template;
    columnTemplate.height = am4core.percent(50);
    columnTemplate.maxHeight = 20;
    columnTemplate.column.cornerRadius(60, 10, 60, 10);
    columnTemplate.strokeOpacity = 0;

    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
    series.mainContainer.mask = undefined;

    var cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = "none";

    var bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 13;
    bullet.valign = "middle";
    bullet.align = "left";
    bullet.isMeasured = true;
    bullet.interactionsEnabled = false;
    bullet.horizontalCenter = "right";
    bullet.interactionsEnabled = false;

    var hoverState = bullet.states.create("hover");
    var outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius, target) {
      var circleBullet: any = target.parent;
      return circleBullet.circle.pixelRadius + 5;
    })

    var image = bullet.createChild(am4core.Image);
    image.width = 30;
    image.height = 30;
    image.horizontalCenter = "middle";
    image.verticalCenter = "middle";
    image.propertyFields.href = "href";

    image.adapter.add("mask", function (mask, target) {
      var circleBullet: any = target.parent;
      return circleBullet.circle;
    })

    var previousBullet;
    chart.cursor.events.on("cursorpositionchanged", function (event) {
      var dataItem: any = series.tooltipDataItem;

      if (dataItem.column) {
        var bullet = dataItem.column.children.getIndex(1);

        if (previousBullet && previousBullet != bullet) {
          previousBullet.isHover = false;
        }

        if (previousBullet != bullet) {

          var hs = bullet.states.getKey("hover");
          hs.properties.dx = dataItem.column.pixelWidth;
          bullet.isHover = true;

          previousBullet = bullet;
        }
      }
    })
    this.chart = chart;
  }

  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
    if (this.chart) {
      this.chart.dispose();
    }
    // });
  }

}
