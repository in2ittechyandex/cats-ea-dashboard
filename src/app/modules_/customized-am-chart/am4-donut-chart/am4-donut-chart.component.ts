import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'cats-am4-donut-chart',
  templateUrl: './am4-donut-chart.component.html',
  styleUrls: ['./am4-donut-chart.component.css']
})
export class Am4DonutChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.PieChart;
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.dataProvider.data.length > 0) {
      this.buildChart();
    }
  }


  buildChart() {
    const chart = am4core.create(this.chartUniqueId, am4charts.PieChart);

    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;

    // Add data
    chart.data = this.dataProvider.data;
    // Set inner radius
    chart.innerRadius = am4core.percent(30);
    //  chart.legend = new am4charts.Legend();
    //  chart.legend.useDefaultMarker = true;
 
    // Ramji made changes 31-03-2020 , add title
    let title = chart.titles.create();
    title.text = this.chartTitleName;
    title.fontSize = 12;
    title.fontWeight = '800';
    

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = this.dataProvider.config.valueField;
    pieSeries.dataFields.category = this.dataProvider.config.titleField;
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;

    pieSeries.slices.template.events.on("hit", this.doOperationClickOnChart.bind(this));
    pieSeries.slices.template.events.on("rightclick", this.doOperationClickOnChart.bind(this)); // Added on 18-sep-2019 (V) (for right click)

    // pieSeries.ticks.template.disabled = true;
    // pieSeries.alignLabels = false;

    // pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";

    pieSeries.labels.template.text = ''; // remove pie labels 
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color('white');
    pieSeries.labels.template.relativeRotation = 90;


    pieSeries.slices.template.propertyFields.fill = this.dataProvider.config['colorField'] ?
     this.dataProvider.config['colorField'] : null,

     
    // pieSeries.labels.template.text = '{category:value}';


    // if (this.dataProvider.config.innerText) {
    //   const label = chart.seriesContainer.createChild(am4core.Label);
    //   label.text = this.dataProvider.config.innerText;
    //   label.horizontalCenter = 'middle';
    //   label.verticalCenter = 'middle';
    //   label.fontSize = 15;
    // }

    // This creates initial animation
    // pieSeries.hiddenState.properties.opacity = 1;
    // pieSeries.hiddenState.properties.endAngle = -90;
    // pieSeries.hiddenState.properties.startAngle = -90;


    chart.legend = new am4charts.Legend();
    chart.legend.valueLabels.template.disabled = true; // hide value from legends
    // chart.legend.useDefaultMarker = true;
    const markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    chart.legend.position = 'bottom';
    chart.legend.itemContainers.template.paddingTop = 2; // manage space between legends markers 
    chart.legend.itemContainers.template.paddingBottom = 2;
    chart.legend.fontSize = 9;

    this.chart = chart;

  }


  getInnerText() {

  }

  doOperationClickOnChart(event) {
    let xCord = event.event.pageX;
    let yCord = event.event.pageY;
    let screenX = event.event.screenX;
    let screenY = event.event.screenY;
    let res = {
      screenX:screenX,
      screenY:screenY,
      clientX: xCord,
      clientY: yCord,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };
    if (event.event.which == 1) {
      
      let label_ = event.target._dataItem.categoryX;
      let dataContext_ = event.target._dataItem.dataContext;
      let dataContextNextFilter_ = dataContext_['nextFilter'];
      let filterName_ = this.dataProvider.config['filterName'];
      // let valueCount_ = event.item.values.value;
      // let keyofLabel_ = "";
      // Object.keys(dataContext_).forEach(element => {
      //   if (dataContext_[element] == valueCount_) {
      //     keyofLabel_ = element;
      //   }
      // });

      let arrayDrill: any[] = [];
      let key = this.dataProvider.config.xAxesTitle;
      let value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.leftClickDetection.emit(res);
    } else if (event.event.which == 3) {

      let label_ = event.item.category;
      let dataContext_ = event.item.dataContext;
      let dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      let filterName_ = this.dataProvider.config['filterName'];
      let valueCount_ = event.item.values.value;
      let keyofLabel_ = "";
      Object.keys(dataContext_).forEach(element => {
        if (dataContext_[element] == valueCount_) {
          keyofLabel_ = element;
        }
      });

      let arrayDrill: any[] = [];
      let key = this.dataProvider.config.xAxesTitle;
      let value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.rightClickDetection.emit(res);

    }
  }



  ngOnDestroy() {
    // this.zone.runOutsideAngular(() => {
    if (this.chart) {
      this.chart.dispose();
    }
    // });
  }

}
