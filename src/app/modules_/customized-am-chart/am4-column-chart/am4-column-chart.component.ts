import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { CustomExcelService } from '../custom-excel.service';

@Component({
  selector: 'cats-am4-column-chart',
  templateUrl: './am4-column-chart.component.html',
  styleUrls: ['./am4-column-chart.component.css']
})
export class Am4ColumnChartComponent implements OnInit, AfterViewInit, OnDestroy {

  private chart: am4charts.XYChart;
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() titleChart="";
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();
  fontSize=12;
  constructor(private excelService_: CustomExcelService) { }

  ngOnInit() {
    if(this.dataProvider.length>0){
      for(var i=0;i<this.dataProvider.length;i++){
        this.dataProvider[i].label=this.getDate(this.dataProvider[i].label);
      }
    }
  }

  ngAfterViewInit() {
    // if (this.dataProvider.data.length > 0) {
      this.buildChart();
    // }
  }

  buildChart() {

    var chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;
// Add data
chart.data = this.dataProvider;
let title = chart.titles.create();
    title.text = this.titleChart.length < 100 ? this.titleChart : this.titleChart.slice(0, 96)+"...";
    title.fontSize = this.fontSize;
    // title.fontFamily="Arial";
    title.fontWeight="bolder";
    title.tooltipText = this.titleChart;
    // title.marginBottom = 5;
    // title.marginTop = 0;
// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
//dateAxis.dataFields.category = "category";
dateAxis.renderer.baseGrid.disabled = true;
// valueAxis.renderer.grid.template.disabled = true;
dateAxis.title.text = "Time";
dateAxis.title.fontSize = this.fontSize;
    // categoryAxis.title.fontFamily="arial";
    dateAxis.title.fontWeight="bolder";
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.baseGrid.disabled = true;
valueAxis.renderer.grid.template.disabled = true;
valueAxis.dateFormatter.dateFormat = 'MMM dd, yyyy HH:mm';
valueAxis.title.text = "Event Count";
valueAxis.title.fontSize = this.fontSize;
valueAxis.title.fontWeight="bolder";
// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "label";
series.columns.template.tooltipText = "Events on date :{dateX} is [bold]{valueY}[/]";
series.tooltip.autoTextColor = false;
series.tooltip.label.fill = am4core.color("#FFFFFF");
series.name = "Events Count";

// Create scrollbars
// chart.scrollbarX = new am4core.Scrollbar();
// chart.scrollbarY = new am4core.Scrollbar();


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
 
  chart.exporting.filePrefix = this.getFileName();//this.titleChart;

}
downloadCSV(event) {
console.log('event: ' + event);
const customheader_ = "Report Title : "+this.titleChart.split(',').join(' ') + '\n';
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
const fileName = this.getFileName();//this.titleChart != '' ? this.titleChart : this.titleChart;
link.setAttribute('download', fileName + '.csv');
document.body.appendChild(link); // Required for FF
link.click();
}
getFileName(){
var str=this.titleChart.length < 30 ? this.titleChart : this.titleChart.slice(0, 28);
var str1=str.split(',').join(' ');
var str2=str1.split('.').join(' ');
var str3=str2.split(':').join(' ');
return str3;
}
downloadXLSX(event) {
console.log('************:downloadXLSX: ' + event);
// fileName, sheetName , mappedHeader, data  
const mappedHeader = this.giveCustomColumnMapping();
const fileName = this.getFileName();// this.titleChart != '' ? this.titleChart : this.titleChart;
const sheetName = this.getFileName();
this.excelService_.generateExcel(fileName, sheetName, mappedHeader, this.dataProvider, ["Report Title : "+this.titleChart]);
}


giveCustomColumnMapping() {
const mapping_ = {};
mapping_['label'] = 'Date';
mapping_['value'] = 'Event Count';
return mapping_;
}
  
       

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  getDate(str){
    return new Date(str);
  }
}
