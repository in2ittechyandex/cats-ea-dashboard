import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

import * as $ from 'jquery';

@Component({
  selector: 'cats-am-heat-chart',
  templateUrl: './am-heat-chart.component.html',
  styleUrls: ['./am-heat-chart.component.css']
})
export class AmHeatChartComponent implements OnInit, AfterViewInit {

  constructor(private AmCharts: AmChartsService) { }

  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  isChartCreated = false;
  private chart: AmChart;
  public chartData3 = '';
  public chartData2 = [];
  public tempData = [];
  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];

  public buildProviderData(dataProvider_data) {
    const weeksTotal = this.getWeeksFromData(dataProvider_data.length);
    const dataPoints = [];
    for (let wNdx = 1; wNdx <= weeksTotal; wNdx++) {
      const x = 1;
      const y = 1;
      const z = wNdx;
      const strInner = {};
      strInner['x'] = x;
      strInner['y'] = y;
      strInner['z'] = z;
      const updatedProvider = this.getProviderRows(wNdx, weeksTotal, dataProvider_data);
      for (let dNdx = 0; dNdx < updatedProvider.length; dNdx++) {
        const obj_ = updatedProvider[dNdx];

        Object.keys(obj_).map(function (el) {
          if (el !== 'nextFilter' &&  el !== 'Time') {
            obj_[el] = parseInt(obj_[el]);
          }
        });

        strInner['nextFilter'] = obj_['nextFilter'];

        strInner['value' + (dNdx + 1)] = obj_['Critical'] + obj_['High'] + obj_['Modrate'] + obj_['Low'] + obj_['Request'];
        strInner['hover' + (dNdx + 1)] = 'Critical: ' + obj_['Critical'] + '\n High: ' + obj_['High'] + '\n Modrate: ' + obj_['Modrate'] + '\n Low: ' + obj_['Low'] + '\n Request: ' + obj_['Request'];

        if (obj_['Critical'] === 0 && obj_['High'] === 0 && obj_['Modrate'] === 0 && obj_['Low'] === 0 && obj_['Request'] === 0) {
          strInner['color' + (dNdx + 1)] = 'green';
        } else if (obj_['Critical'] >= obj_['High'] && obj_['Critical'] >= obj_['Modrate'] && obj_['Critical'] >= obj_['Low'] && obj_['Critical'] >= obj_['Request']) {
          strInner['color' + (dNdx + 1)] = 'red';
        } else if (obj_['High'] > obj_['Critical'] && obj_['High'] >= obj_['Modrate'] && obj_['High'] >= obj_['Low'] && obj_['High'] >= obj_['Request']) {
          strInner['color' + (dNdx + 1)] = 'orange';
        } else if (obj_['Modrate'] > obj_['Critical'] && obj_['Modrate'] > obj_['High'] && obj_['Modrate'] >= obj_['Low'] && obj_['Modrate'] >= obj_['Request']) {
          strInner['color' + (dNdx + 1)] = 'yellow';
        } else if (obj_['Low'] > obj_['Critical'] && obj_['Low'] > obj_['High'] && obj_['Low'] > obj_['Modrate'] && obj_['Low'] > obj_['Request']) {
          strInner['color' + (dNdx + 1)] = 'blue';
        } else if (obj_['Request'] > obj_['High'] && obj_['Request'] > obj_['Modrate'] && obj_['Request'] > obj_['Low']) {
          strInner['color' + (dNdx + 1)] = 'grey';
        }

      }

      dataPoints[dataPoints.length] = strInner;
    }
    return dataPoints;
  }

  ngOnInit() {
    this.isChartCreated = this.dataProvider.data.length > 0;
  }

  ngAfterViewInit() {
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    this.chart.addListener('rightClickGraphItem', this.doOperationClickOnChart.bind(this));
    this.chart.addListener('clickGraphItem', this.doOperationClickOnChart.bind(this));
  }

  doOperationClickOnChart(event) {
    // console.log('heat chart left click');
    const xCord = event.event.pageX;
    const yCord = event.event.pageY;
    const screenX = event.event.screenX;
    const screenY = event.event.screenY;
    const res = {
      screenX: screenX,
      screenY: screenY,
      clientX: xCord,
      clientY: yCord,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };
    if (event.event.which === 1) {
      // Left Click Detection
      const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      const arrayDrill: any[] = [];
      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;
      this.leftClickDetection.emit(res);
    } else if (event.event.which === 3) {
      // Right Click Detection
      const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      const arrayDrill: any[] = [];
      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;
      this.rightClickDetection.emit(res);

    }
  }

  getValueAxes() {
    return [{
      'axisAlpha': 0,
      'stackType': 'regular',
      'labelsEnabled': false,
      'gridAlpha': 0,
      'maximum': 24,
      'guides': this.getValueAxesGuides()
    }];
  }

  getValueAxesGuides() {
    const guidesValue = [];
    for (let dNdx = 0; dNdx <= 23; dNdx++) {
      const guidesInner = {};
      guidesInner['value'] = dNdx + .5;
      guidesInner['label'] = '' + dNdx;
      guidesValue.push(guidesInner);
    }
    return guidesValue;
  }

  getCategoryAxis() {
    return {
      'axisAlpha': 0,
      'gridAlpha': 0,
      'labelsEnabled': false,
      'guides': this.getCategoryAxisGuides()
    };
  }

  getCategoryAxisGuides() {
    const guidesValue = [];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let dNdx = 1; dNdx <= 7; dNdx++) {
      const guidesInner = {};
      guidesInner['category'] = dNdx;
      guidesInner['label'] = weekdays[dNdx - 1];
      guidesValue.push(guidesInner);
    }
    return guidesValue;
  }

  getGraphs() {
    const graphsPoints = [];
    for (let dNdx = 1; dNdx <= 24; dNdx++) {
      const graphsInner = {};
      graphsInner['fontSize'] = 11;
      graphsInner['fillAlphas'] = 1;
      graphsInner['lineAlpha'] = 1;
      graphsInner['lineColor'] = '#fff';
      graphsInner['lineThickness'] = 0;
      graphsInner['cornerRadiusTop'] = 0;
      graphsInner['cornerRadiusBottom'] = 0;
      graphsInner['fillColorsField'] = 'color' + dNdx;
      graphsInner['type'] = 'column';
      graphsInner['valueField'] = 'y';
      graphsInner['labelText'] = '[[value' + dNdx + ']]';
      graphsInner['balloonText'] = '[[hover' + dNdx + ']]';
      graphsInner['labelPosition'] = 'middle';
      graphsPoints.push(graphsInner);
    }
    return graphsPoints;

  }



  createChartConfig() {
    $.extend(this.tempData, this.dataProvider.data);
    this.chartData3  = JSON.stringify(this.tempData);
    // $.extend(this.chartData3, this.dataProvider.data);
    $.extend(this.chartData2, this.dataProvider.data);
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'light',
      'dataProvider': this.buildProviderData(this.chartData2),
      'graphs': this.getGraphs(),
      'balloon': {
        'textAlign': 'left',
        'fixedPosition': false
      },
      'columnWidth': 1,
      'categoryField': 'z',
      'categoryAxis': this.getCategoryAxis(),
      'rotate': true,
      'export': this.getExports(),
      'valueAxes': this.getValueAxes(),
      'legend': {
        'align': 'center',
        'data': [{
          'color': 'red',
          'title': 'Critical'
        }, {
          'color': 'orange',
          'title': 'High'
        }, {
          'color': 'yellow',
          'title': 'Moderate'
        }, {
          'color': 'blue',
          'title': 'Low'
        }, {
          'color': 'Green',
          'title': 'None'
        },
        {
          'color': 'grey',
          'title': 'Request'
        }]
      }
    };
    return data;
  }

  getExports() {
    return {
      'enabled': true,
      'exportTitles': true,
      // "backgroundColor":"#33FFC1",
      // "exportFields": this.createExportFields(),
      // "columnNames": this.giveCustomColumnMapping(),
      // "menuReviver": this.menuReviver.bind(this),

      'menu': [
        {
          'class': 'export-main',
          'label': 'Export',
          'menu': [
            {
              'label': 'Image As',
              'menu': [
                'PNG',
                'JPG'
              ]
            },
            {
              'label': 'Export As',
              'menu': [
                {
                  label: 'CSV',
                  format: 'csv',
                  click: this.myFunction.bind(this)
                },
                // "XLSX",
                // "JSON"
              ]
            }
          ]
        }
      ],

      // use this f/n to show label value on chart
      'beforeCapture': function () {
        const chart = this.setup.chart;
        // chart.backgroundColor = "#000000"
        // $(".tab-content").css("background-color", "black")
        chart.validateNow();
      },
      'afterCapture': function () {
        const chart = this.setup.chart;
        setTimeout(function () {
          // chart.graphs[0].labelText = "";
          chart.validateNow();
        }, 10);
      }
    };

  }
  menuReviver(item, li) {
    if (this.supportTypes.indexOf(item.format) > -1) {
      item.fileName = this.chartTitleName;
    }
    return li;
  }

  myFunction(this) {
    const data1 = this.chartData3;
    const data = JSON.parse(data1);
    const rows = [];
    const Length_ = data.length;
    for (let i = 0; i <= Length_ - 1; i++) {
      const day_time = data[i].Time.toString().split(' ');
      const hrs = data[i].Time.toString().substring(data[i].Time.toString().indexOf(' ') + 1).trim();
      rows.push([day_time[0], hrs, data[i].Low, data[i].Modrate, data[i].High, data[i].Critical, data[i].Request]);
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    let row = ['Day', 'Hours', 'Low', 'Modrate', 'High', 'Critical', 'Request'];
    csvContent += row + '\r\n';
    rows.forEach(function (rowArray) {
      let row = rowArray.join(',');
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'my_data.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  giveCustomColumnMapping() {
    const fields_: string[] = this.createExportFields();
    const mapping_ = {};
    fields_.forEach(elm_ => {
      mapping_[elm_] = elm_;
    });
    return mapping_;
  }

  /**
   * This f/n used to select headers to be display in exported file
   */
  createExportFields() {
    const fields_: string[] = [];
    // fields_.push(this.dataProvider.config.xAxesTitle);
    // fields_.push('Date');
    // fields_.push(this.dataProvider.config.titleField);
    fields_.push('Modrate');
    fields_.push('High');
    // for(var i=0; i<=23; i++){
    //   fields_.push(JSON.stringify(i))
    // }
    return fields_;
  }

  getWeeksFromData(data: number): number {
    const value = (data % 24) === 0 ? (data / 24) : ((parseInt('' + data / 24)) + 1);
    return value;
  }


  getProviderRows(colNdx, totCol, arr: any[]) {
    return arr.splice(0, 24);
  }

}
