import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { CustomExcelService } from '../custom-excel.service';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'cats-am-area-range-chart',
  templateUrl: './am-area-range-chart.component.html',
  styleUrls: ['./am-area-range-chart.component.css']
})
export class AmAreaRangeChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;
  @Input() chartUniqueId = "chartdiv";
  @Input() chartType;
  @Input() dataProvider;
  @Input() titleChart = "Alarm Data";
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  constructor(private excelService_: CustomExcelService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // if (this.dataProvider.data.length > 0) {
    this.buildChart3();
    // }
  }

  buildChart() {

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var data = [];
    var open = 100;
    var close = 250;
    var mid = 250;
    var out = 250;
    for (var i = 1; i < 120; i++) {
      open += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4);
      mid = (close + open) / 2;
      out = (mid - 5);
      close = Math.round(open + Math.random() * 5 + i / 5 - (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2);
      data.push({ date: new Date(2018, 0, i), high: open, low: close, actual: mid, prediction: out });
    }

    chart.data = data;

    // chart.data = this.dataProvider;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.disabled = true;
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.tooltip.disabled = false;
    // valueAxis.renderer.baseGrid.disabled = true;
    // valueAxis.renderer.grid.template.disabled = true;
    dateAxis.title.text = 'Duration';

    var series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.dateX = "date";
    series1.dataFields.valueY = "high";
    series1.sequencedInterpolation = true;
    series1.defaultState.transitionDuration = 0;
    series1.stroke = am4core.color("#9acded"); // red outline
    series1.fill = am4core.color("#9acded");
    series1.fillOpacity = 0.8;
    // series1.stroke = chart.colors.getIndex(2);
    series1.tensionX = 0.8;
    series1.tooltipText = 'Max: {valueY.value}';

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "low";
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 0;
    series2.stroke = am4core.color("#9acded"); // red outline
    series2.fill = am4core.color("#9acded");
    series2.fillOpacity = 0.8;
    // series2.stroke = chart.colors.getIndex(2);
    series2.tensionX = 0.8;
    series2.tooltipText = 'Min: {valueY.value}';

    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.dateX = "date";
    series3.dataFields.valueY = "actual";
    series3.sequencedInterpolation = true;
    series3.defaultState.transitionDuration = 0;
    series3.stroke = chart.colors.getIndex(6);
    series3.tensionX = 0.8;
    series3.tooltipText = 'Actual: {valueY.value}';
    const circleBullet = series3.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.stroke = am4core.color('#fff');
    circleBullet.circle.strokeWidth = 2;
    // var series4 = chart.series.push(new am4charts.LineSeries());
    // series4.dataFields.dateX = "date";
    // series4.dataFields.valueY = "prediction";

    // // series4.tooltipText = "Actual: {actual} Predicted: {prediction}";
    // series4.sequencedInterpolation = true;
    // series4.defaultState.transitionDuration = 0;
    // series4.stroke = chart.colors.getIndex(3);
    // series4.tensionX = 0.8;
    // series4.fillOpacity = 0.8;

    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();

    this.chart = chart;
  }
  buildChart1() {

    let chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;

    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


    chart.data = this.dataProvider;
    // chart.legend = new am4charts.Legend();
    let title = chart.titles.create();
    title.text = this.titleChart;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.text = 'Duration';
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.dateFormats.setKey('hour', 'HH:mm');
    // dateAxis.periodChangeDateFormats.setKey('hour', 'MMM dd');
    dateAxis.skipEmptyPeriods = true;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    // valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.grid.template.disabled = false;
    valueAxis.title.text = 'Counts';
    valueAxis.min = 0;
    // valueAxis.max = 100;
    // valueAxis.extraMax=0.5;
    // valueAxis.title.fontSize = this.fontSize;
    valueAxis.title.fontFamily = "arial";
    valueAxis.title.fontWeight = "bolder";
    // valueAxis.renderer.labels.template.adapter.add("text", function(text, target) {
    //   return text.match(/\./) ? "" : text;
    // });
    // valueAxis.maxPrecision=0;
    // valueAxis.min=0;
    // valueAxis.strictMinMax =true;
    // chart.dateFormatter.dateFormat = "yyyy-MM-dd";
    // dateAxis.dateFormatter = new am4core.DateFormatter();
    // dateAxis.dateFormatter.dateFormat = "MM-dd";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.openValueY = 'low'; //'Opened';
    series.dataFields.valueY = 'high'; //'Closed';
    series.tooltipText = 'Max: {valueY.value}';
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.3;
    series.defaultState.transitionDuration = 0; // 1000;
    series.tensionX = 0.8;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'date';
    series2.dataFields.valueY = 'low'; //'Opened';
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 0; // 1500;
    series2.tensionX = 0.8;
    series2.tooltipText = 'Min: {valueY.value}';


    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.dateX = 'date';
    series3.dataFields.valueY = 'actual'; // 'Mid';
    series3.sequencedInterpolation = true;
    series3.defaultState.transitionDuration = 0; // 1500;
    series3.stroke = chart.colors.getIndex(6);
    series3.tensionX = 0.8;
    series3.tooltipText = 'Counts on :{dateX} - {valueY.value}';


    const circleBullet = series3.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.stroke = am4core.color('#fff');
    circleBullet.circle.strokeWidth = 1;


    chart.cursor = new am4charts.XYCursor();
    // console.log('hi::: '+JSON.stringify(this.getInternalCounts(this.dataProvider.data)));
    // dateAxis.gridIntervals.setAll(<any>this.getInternalCounts(this.dataProvider));

    chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX.marginTop = 30;
    dateAxis.renderer.labels.template.location = 0.0001;
    valueAxis.dateFormatter.dateFormat = 'MMM dd, yyyy HH:mm';
    this.chart = chart;
  }
  buildChart3() {
    const chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;

    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = this.dataProvider;
    const title = chart.titles.create();
    title.text = this.titleChart;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 45;
    dateAxis.title.text = 'Duration';
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.skipEmptyPeriods = true;
    dateAxis.tooltip.disabled = true;
    // dateAxis.dateFormats.setKey('minute', 'MMM dd, yyyy HH:mm');
    // dateAxis.periodChangeDateFormats.setKey('minute', 'MMM dd, yyyy HH:mm');

    // dateAxis.dateFormats.setKey('minute', 'HH:mm');
    // dateAxis.periodChangeDateFormats.setKey('minute', 'MMM dd');

    /**
     * Ramji added , gridInterval to be set for minutes , if 'xAxesTitle' is 'Minutes Of Hour'
     */
    // if (this.dataProvider.config['xAxesTitle'] && (this.dataProvider.config['xAxesTitle'] == 'Minutes Of Hour')) {
    //   // TODO : minutes of hour , labels and bullets
    // dateAxis.dateFormats.setKey('minute', 'MMM dd, yyyy HH:mm');
    // dateAxis.periodChangeDateFormats.setKey('minute', 'HH:mm');
    // dateAxis.gridIntervals.setAll(<any>[{ timeUnit: 'minute', count: 1 }]);
    // } 

    // else if (this.dataProvider.config['xAxesTitle'] && (this.dataProvider.config['xAxesTitle'] == 'Minutes')){
    //   dateAxis.renderer.minGridDistance = 90;
    //   // dateAxis.skipEmptyPeriods = true;
    //   dateAxis.dateFormats.setKey('minute', 'MMM dd HH:mm');
    //   dateAxis.periodChangeDateFormats.setKey('minute', 'MMM dd HH:mm');
    //   // dateAxis.gridIntervals.setAll(<any>[{ timeUnit: 'minute', count: 1 }]);

    //   // dateAxis.dateFormats.setKey('minute', 'HH:mm');
    //   // dateAxis.periodChangeDateFormats.setKey('minute', 'MMM dd');
    //   dateAxis.gridIntervals.setAll([
    //     { timeUnit: 'minute', count: 1 },
    //     { timeUnit: 'minute', count: 30 },
    //     { timeUnit: 'hour', count: 1 },
    //     { timeUnit: 'day', count: 1 },
    //     { timeUnit: 'month', count: 1 }
    //   ]);


    // } 

    // else {
    // dateAxis.dateFormats.setKey('hour', 'HH:mm');
    // dateAxis.periodChangeDateFormats.setKey('hour', 'MMM dd');
    // dateAxis.gridIntervals.setAll([
    //   { timeUnit: 'minute', count: 1 },
    //   { timeUnit: 'minute', count: 30 },
    //   { timeUnit: 'hour', count: 1 },
    //   { timeUnit: 'day', count: 1 },
    //   { timeUnit: 'month', count: 1 }
    // ]);

    // }


    // if (this.dataProvider.config['xAxisRangesInterval']) {
    //   dateAxis.gridIntervals.setAll(<any>this.dataProvider.config['xAxisRangesInterval']);
    // }
    // else {
    //   dateAxis.gridIntervals.setAll(<any>this.getInternalCounts(this.dataProvider.data));
    // }

    // Create value axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.tooltip.disabled = true;
    valueAxis.title.text = 'Counts';
    valueAxis.renderer.minGridDistance = 20;
    // if (this.dataProvider.config['minMax_valueAxis']) {
    // valueAxis.min = 0;
    // valueAxis.max = 3000;
    // }
    // valueAxis.maxPrecision=0;
    // valueAxis.min=0;
    // valueAxis.extraMax=0.5;
    // valueAxis.strictMinMax =true;
    valueAxis.dateFormatter.dateFormat = 'MMM dd, yyyy HH:mm';



    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.openValueY = 'low';
    series.dataFields.valueY = 'high';  // 'Min';
    series.tooltipText = 'Max: {valueY.value}'; // 'Min: {valueY.value}';
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.3;
    series.defaultState.transitionDuration = 0; // ranges_[i]['transitionDuration'] ? ranges_[i]['transitionDuration'] : 1000;
    series.tensionX = 0.8;



    const series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'date';
    series2.dataFields.valueY = 'low';  // 'Min';
    series2.tooltipText = 'Min: {valueY.value}'; // 'Min: {valueY.value}';
    series2.sequencedInterpolation = true;
    // series2.fillOpacity =  0.3;
    series2.defaultState.transitionDuration = 0; // ranges_[i]['transitionDuration'] ? ranges_[i]['transitionDuration'] : 1000;
    series2.tensionX = 0.8;



    const series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.dateX = 'date';
    series3.dataFields.valueY = 'actual'; // 'value'; // 'Mid';
    series3.sequencedInterpolation = true;
    series3.defaultState.transitionDuration = 0; // 1500;


    // series3.stroke = am4core.color('#006A4E');
    series3.tensionX = 0.8;
    series3.tooltipText = 'Actual : {dateX}, ' + ' : {valueY.value}'; // 'Average: {valueY.value}';
    // series3.tooltipText = this.dataProvider.config['tooltip_text']; // 'Average: {valueY.value}';
    // series3.name = this.dataProvider.config['display_name']; // 'Average';

    const circleBullet = series3.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.stroke = am4core.color('#fff');
    circleBullet.circle.strokeWidth = 2;
    circleBullet.circle.radius = 4;



    chart.cursor = new am4charts.XYCursor();

    chart.cursor.xAxis = dateAxis;
    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarX.maxWidth = 100;
    // chart.scrollbarX.marginTop = 20;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.items = [
      {
        'label': '',
        'menu': [
          {
            'label': 'Image As',
            'menu': [
              { 'type': 'png', 'label': 'PNG' },
              { 'type': 'jpg', 'label': 'JPG' }
            ]
          }, {
            'label': 'Export As',
            'menu': [
              { 'type': 'custom', 'label': 'CSV', 'options': { callback: this.downloadCSV.bind(this) } },
              { 'type': 'custom', 'label': 'XLSX', 'options': { callback: this.downloadXLSX.bind(this) } }
            ]
          }
        ]
      }
    ];
    chart.exporting.menu.items[0].icon = 'assets/download.jpg';
    chart.exporting.dataFields = this.giveCustomColumnMapping();

    chart.exporting.filePrefix = this.titleChart;

  }
  downloadCSV(event) {
    console.log('event: ' + event);
    const customheader_ = "Report Title : " + this.titleChart.split(',').join(' ') + '\n';
    const data = this.dataProvider; // data part
    const mappedHeader = this.giveCustomColumnMapping();
    const keys_ = Object.keys(mappedHeader);
    const row = Object.values(mappedHeader); // []; // this.headers; // header part
    const rows = [];
    for (let i = 0; i <= data.length - 1; i++) {
      let arr = [];
      let datsSet = data[i];
      for (let hdrs = 0; hdrs <= keys_.length - 1; hdrs++) {
        arr[hdrs] = '"' + datsSet[keys_[hdrs]] + '"';
      }
      rows.push(arr);
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += customheader_ + row + '\r\n';
    rows.forEach(function (rowArray) {
      const row_ = rowArray.join(',');
      csvContent += row_ + '\r\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = this.titleChart != '' ? this.titleChart : this.titleChart;
    link.setAttribute('download', fileName + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  downloadXLSX(event) {
    console.log('************:downloadXLSX: ' + event);
    // fileName, sheetName , mappedHeader, data  
    const mappedHeader = this.giveCustomColumnMapping();
    const fileName = this.titleChart != '' ? this.titleChart : this.titleChart;
    const sheetName = this.titleChart.length > 30 ? this.titleChart.length : this.titleChart.slice(0, 30);
    this.excelService_.generateExcel(fileName, sheetName, mappedHeader, this.dataProvider, ["Report Title : " + this.titleChart]);
  }


  giveCustomColumnMapping() {
    const mapping_ = {};
    mapping_['displaydate'] = 'Date';
    mapping_['low'] = 'Min';
    mapping_['high'] = 'Max';
    mapping_['actual'] = 'Actual Count';
    return mapping_;
  }


  getInternalCounts(data: any) {
    let date1 = data[0]['date'];
    let date2 = data[1]['date'];

    let diff_ = Math.abs(date1 - date2);
    console.log('diff : ' + diff_);
    if (diff_ >= 1000 && (diff_ < 1000 * 60 * 5)) {
      return [{ timeUnit: 'minute', count: 1 }];
    } else if (diff_ >= 1000 * 60 * 5 && (diff_ < 1000 * 60 * 15)) {
      return [{ timeUnit: 'minute', count: 5 }];
    } if (diff_ >= 1000 * 60 * 15 && (diff_ < 1000 * 60 * 30)) {
      return [{ timeUnit: 'minute', count: 15 }];
    } else if (diff_ <= 1000 * 60 * 30) {
      return [{ timeUnit: 'minute', count: 30 }];
    } else if (diff_ <= 1000 * 60 * 60) {
      return [{ timeUnit: 'hour', count: 1 }];
    } else if (diff_ < 1000 * 60 * 60 * 24) {
      return [{ timeUnit: 'hour', count: 1 }];
    } else {
      return [{ timeUnit: 'day', count: 1 }];
    }


  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
