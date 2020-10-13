import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import themeConf_ from '../../../config/theme-settings';

@Component({
  selector: 'cats-am-bar-chart',
  templateUrl: './am-bar-chart.component.html',
  styleUrls: ['./am-bar-chart.component.css']
})
export class AmBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  constructor(private AmCharts: AmChartsService) {
    this.themeConf_ = themeConf_;
  }
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Input() theme;
  themeConf_;

  @Input() accessType = '';

  public fillColors_: Array<string> = [];
  public lineColor_: Array<string> = [];

  private chart: AmChart;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];

  getFillColors() {
    const themeColosCss_ = this.themeConf_['themeChartMapping'][this.themeConf_['selectedTheme']];
    const fillColors_ = themeColosCss_['default']['fillColors'];
    return fillColors_;
  }

  getLineColors() {
    const themeColosCss_ = this.themeConf_['themeChartMapping'][this.themeConf_['selectedTheme']];
    const lineColor_ = themeColosCss_['default']['lineColor'];
    return lineColor_;
  }

  getLegends() {
    // return {
    //   "horizontalGap": 10,
    //   "maxColumns": 1,
    //   "position": "right",
    //   "useGraphSettings": true,
    //   "markerSize": 10
    // };
    return {
      'horizontalGap': 0,
      'maxColumns': 6,
      'position': 'bottom',
      'useGraphSettings': true,
      'markerSize': 10,
      'align': 'center'
    };
  }


  getValueAxes() {
    return [{
      'stackType': 'none',
      'axisAlpha': 0.3,
      'gridAlpha': 0,
      'title': this.dataProvider.config.yAxesTitle
    }];
  }

  getCategoryAxis() {
    return {
      'gridPosition': 'start',
      'axisAlpha': 0,
      'gridAlpha': 0,
      'position': 'left',
      'labelRotation': 15,
      'title': this.dataProvider.config.xAxesTitle
    };
  }


  getGraphs(titleField, valueField) {
    // let arrGraph = [];
    // series.forEach(seriesName => {
    //   let obj = {
    //     "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
    //     "fillAlphas": 0.8,
    //     "labelText": "[[value]]",
    //     "lineAlpha": 0.3,
    //     "title": seriesName,
    //     "type": "column",
    //     "color": "#000000",
    //     "valueField": seriesName
    //   }
    //   arrGraph.push(obj);
    // });
    // "<b>[[" + titleField + "]]</b><br><span style='font-size:14px'>[[category]]: <b>[[" + valueField + "]]</b></span>"


    const arrGraph = [];
    const obj = {
      // "balloonText": "<b><span style='font-size:14px'>[[category]]:[[" + valueField + "]]</span></b>",
      'balloonFunction': this.balloonFunction.bind(this),

      'labelText': this.dataProvider.config['displayGraphLabel'] ? ' ' : null,
      'labelFunction': this.custLabelFunction.bind(this),

      'fillAlphas': 1,
      'lineAlpha': 0.3,
      'title': titleField,
      'type': 'column',
      // "color": "#000000",

      'fillColors': this.fillColors_[0],
      'lineColor':  this.lineColor_[0],

      'valueField': valueField,
      'forceGap': true,
    };
    arrGraph.push(obj);
    return arrGraph;
  }


  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'none',
      // "theme": this.theme ? this.theme : 'none',
      // "legend": this.getLegends(),
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.titleField, this.dataProvider.config.valueField),
      'categoryField': this.dataProvider.config.titleField,
      'categoryAxis': this.getCategoryAxis(),
      'export': this.getExports(),
      'titles': [
        {
          'text': this.chartTitleName,
          'size': 12
        }
      ],

      // 'sequencedAnimation':false,
      // 'startDuration':1,
      // 'startEffect':'easeInSine',

      'chartScrollbar': {
        'updateOnReleaseOnly': true,
        'oppositeAxis': false,
      },

      // "backgroundImage" : "http://www.amcharts.com/lib/images/bg.jpg"

    };
    return data;
  }

  getExports() {
    if (this.accessType == 'chatbot') {
      return {};
    } else {
      return {
        'enabled': true,
        // "divId": this.chartUniqueId+'-export',
        // "class":"testRamji",
        'exportTitles': true,
        'exportFields': this.createExportFields(),
        'columnNames': this.giveCustomColumnMapping(),
        'menuReviver': this.menuReviver.bind(this),

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
                  'CSV',
                  'XLSX',
                  'JSON'
                ]
              }
            ]
          }
        ],


        // use this f/n to show label value on chart
        'beforeCapture': function () {
          const chart = this.setup.chart;
          chart.graphs.forEach(element => {
            element['labelText'] = '[[value]]';
          });
          // chart.graphs[0].labelText = "[[value]]";
          chart.validateNow();
        },
        'afterCapture': function () {
          const chart = this.setup.chart;
          setTimeout(function () {
            // chart.graphs[0].labelText = "";
            chart.graphs.forEach(element => {
              element['labelText'] = '';
            });

            chart.validateNow();
          }, 10);
        }
      };
    }


  }
  menuReviver(item, li) {
    if (this.supportTypes.indexOf(item.format) > -1) {
      item.fileName = this.chartTitleName;
    }
    return li;
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
    fields_.push(this.dataProvider.config.titleField);
    fields_.push(this.dataProvider.config.valueField);
    // fields_ = fields_.concat(this.dataProvider.config.titleField);
    return fields_;
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['theme'] && !changes['theme']['firstChange']) {
        this.reloadChart();
    }
  }

  reloadChart() {
    this.fillColors_ = this.getFillColors();
    this.lineColor_ = this.getLineColors();
    this.chart.graphs = this.getGraphs(this.dataProvider.config.titleField, this.dataProvider.config.valueField),
    this.chart.validateData();
  }


  ngAfterViewInit() {
    this.fillColors_ = this.getFillColors();
    this.lineColor_ = this.getLineColors();
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    this.chart.addListener('rightClickGraphItem', this.doOperationClickOnChart.bind(this));
    this.chart.addListener('clickGraphItem', this.doOperationClickOnChart.bind(this));
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  doOperationClickOnChart(event) {
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
      const label_ = event.item.category;
      const dataContext_ = event.item.dataContext;
      const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      const valueCount_ = event.item.values.value;
      let keyofLabel_ = '';
      Object.keys(dataContext_).forEach(element => {
        // tslint:disable-next-line: triple-equals
        if (dataContext_[element] == valueCount_) {
          keyofLabel_ = element;
        }
      });

      const arrayDrill: any[] = [];
      const key = this.dataProvider.config.xAxesTitle;
      const value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.leftClickDetection.emit(res);
    } else if (event.event.which === 3) {

      const label_ = event.item.category;
      const dataContext_ = event.item.dataContext;
      const dataContextNextFilter_ = event.item.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];
      const valueCount_ = event.item.values.value;
      let keyofLabel_ = '';
      Object.keys(dataContext_).forEach(element => {
        // tslint:disable-next-line: triple-equals
        if (dataContext_[element] == valueCount_) {
          keyofLabel_ = element;
        }
      });

      const arrayDrill: any[] = [];
      const key = this.dataProvider.config.xAxesTitle;
      const value = label_;

      arrayDrill[0] = { key: dataContextNextFilter_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;
      this.rightClickDetection.emit(res);
    }
  }


   /**
   * this f/n used to manage custom hover f/nality on bar
   * @param graphDataItem graph bar items
   * @param graph graph object
   */
  balloonFunction(graphDataItem, graph): string {
    const value = graphDataItem.values.value;
    const title = graph.title;
    const category = graphDataItem.category;
    if (this.dataProvider.config['graphBalloonFn']) {
      const custFName = this.dataProvider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return '<span style=\'font-size:14px\'>' +
         this.ordinal_suffix_of(category) +
          ' Hour : <b>' + value + (value > 1 ? ' Tickets' : ' Ticket') +
           '</b></span>';
      }
      if (custFName === 'hopeswisetrends') {
        return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' +
        category + ' Hopes : <b>' + value + ' Tickets </b></span>';
      }
      if (custFName === 'convertYAxisCount_SecoundToDays') {
        return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category +
     ': <b>' + this.convertCountToString(value, 's', 'sm') + '</b></span>';
      }
    }
    return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category +
     ': <b>' + value + '</b></span>';
  }

  custLabelFunction(graphDataItem, graph): string {
    const value = graphDataItem.values.value;
    const title = graph.title;
    const category = graphDataItem.category;
    if (this.dataProvider.config['graphLabelFn']) {
      const custFName = this.dataProvider.config['graphLabelFn'];
      if (custFName === 'hourwisetrends') {
        return value;
      }
      if (custFName === 'convertYAxisCount_SecoundToDays') {
        return this.convertCountToString(value, 's', 'sm');
      }
    }
    return value;
  }

   ordinal_suffix_of(i) {
    const j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + 'st';
    }
    if (j === 2 && k !== 12) {
        return i + 'nd';
    }
    if (j === 3 && k !== 13) {
        return i + 'rd';
    }
    return i + 'th';
}

convertCountToString(value, valueUnit, aliasType): string {
  if (value == '0') {
    return '0';
  }

  if (isNaN(value)) {
    return value;
  }

  const units = {};
  const conv_ = this.validateValue(value, valueUnit);
  value = conv_.value;
  valueUnit = conv_.valueUnit;
  if (valueUnit == 'mn') {
    units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365;
    units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30;
    units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7;
    units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60;
    units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60;
    units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1;
  } else if (valueUnit == 'h') {
    units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 365;
    units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 30;
    units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 7;
    units[aliasType == 'sm' ? 'D' : 'Day'] = 24;
    units[aliasType == 'sm' ? 'H' : 'Hours'] = 1;
  } else if (valueUnit == 's') {
    units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60;
    units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60;
    units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60;
    units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60;
    units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60;
    units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60;
    units[aliasType == 'sm' ? 'Sec' : 'Seconds'] = 1;
  } else if (valueUnit == 'ms') {
    units[aliasType == 'sm' ? 'Y' : 'Year'] = 24 * 60 * 365 * 60 * 1000;
    units[aliasType == 'sm' ? 'M' : 'Month'] = 24 * 60 * 30 * 60 * 1000;
    units[aliasType == 'sm' ? 'W' : 'Week'] = 24 * 60 * 7 * 60 * 1000;
    units[aliasType == 'sm' ? 'D' : 'Day'] = 24 * 60 * 60 * 1000;
    units[aliasType == 'sm' ? 'H' : 'Hours'] = 1 * 60 * 60 * 1000;
    units[aliasType == 'sm' ? 'Mn' : 'Minutes'] = 1 * 60 * 1000;
    units[aliasType == 'sm' ? 's' : 'Seconds'] = 1 * 1000;
    units[aliasType == 'sm' ? 'ms' : 'Milli Seconds'] = 1;
  }
  const result = [];

  // tslint:disable-next-line: forin
  for (const name in units) {
    const p = Math.floor(value / units[name]);
    if (p === 1) { result.push(p + ' ' + name); }
    if (p >= 2) { result.push(p + ' ' + name); }
    value %= units[name];
  }

  let strTobeReturn = '';
  result.map(elm => {
    strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
  });
  return strTobeReturn;
}


validateValue(value, valueUnit) {
  if (valueUnit == 'h') {
    if (value > 0 && value < 1) {
      valueUnit = 'ms';
      value = (value * 60 * 60 * 1000);
      return { 'value': value, 'valueUnit': valueUnit };
    } else {
      valueUnit = 'mn';
      value = (value * 60 );
      return { 'value': value, 'valueUnit': valueUnit };
    }
  } else if (valueUnit == 'mn') {
    if (value > 0 && value < 1) {
      valueUnit = 'ms';
      value = (value * 60 * 1000);
      return { 'value': value, 'valueUnit': valueUnit };
    }
  } else if (valueUnit == 's') {
    if (value > 0 && value < 1) {
      valueUnit = 'ms';
      value = (value * 1000);
      return { 'value': value, 'valueUnit': valueUnit };
    }
  }
  return { 'value': value, 'valueUnit': valueUnit };
}

}
