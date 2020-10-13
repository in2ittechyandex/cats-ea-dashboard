import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import themeConf_ from '../../../config/theme-settings';

@Component({
  selector: 'cats-am-msbar-chart',
  templateUrl: './am-msbar-chart.component.html',
  styleUrls: ['./am-msbar-chart.component.css']
})
export class AmMsbarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  @Input() theme;
  themeConf_;


  public fillColors_: Array<string> = [];
  public lineColor_: Array<string> = [];

  private chart: AmChart;

  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];


  getLegends() {
    return {
      'horizontalGap': 0,
      'maxColumns': 6,
      'position': 'bottom',
      'useGraphSettings': false,
      'markerSize': 10,
      // 'labelText':'Test' ,
      //  'labelText': ' ',
      //  'valueFunction': this.custLabelFunctionLegends.bind(this),
    };
  }


  custLabelFunctionLegends(graphItem, text): string {
    const title = graphItem.title;
    return title;
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

  getGraphs(series) {
    const arrGraph = [];
    series.forEach((seriesName, index) => {
      const obj = {
        // 'balloonText': '<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>',
        'balloonFunction': this.balloonFunction.bind(this),
        // "labelText": this.getLabelText.bind(this),
        // "labelText": "[[value]]",
        'labelText': this.dataProvider.config['displayGraphLabel'] ? ' ' : null,
        'labelFunction': this.custLabelFunction.bind(this),
        'title': seriesName,
        'type': 'column',
        // 'fillColors': (this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        // 'lineColor': (this.lineColor_.length - 1 > index) ? this.lineColor_[index] : null,
        'fillColors': this.getFillColorsCode(seriesName), //(this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        'lineColor': this.getFillColorsCode(seriesName),
        'fillAlphas': 1,
        'lineAlpha': 0.3,
        // 'color': (this.themeChartColor.length-1>index)?this.themeChartColor[index]: '#000000',
        'valueField': seriesName,
        'labelPosition': 'top',
        'labelRotation': 270,
        'fontSize': 9
      };
      arrGraph.push(obj);
    });
    return arrGraph;
  }
  // "labelText": "[[value]]",


  getFillColorsCode(label_) {
    let keys_ = this.dataProvider.config['colors'] ? this.dataProvider.config['colors'] : {};
    return (keys_.hasOwnProperty('' + label_) ? keys_[label_] : null);
  }

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



  /**
   * USED FOR ANIMATION
   *  'sequencedAnimation': true,
   * 'startDuration': 1,
   * 'startEffect': 'bounce',
   */



  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'none',
      'legend': (this.dataProvider.config.yAxes.length > 3) ? null : this.getLegends(),
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.yAxes),
      'categoryField': this.dataProvider.config.xAxes,
      'categoryAxis': this.getCategoryAxis(),

      // "chartCursor": {
      //   "categoryBalloonEnabled": false
      // },
      'titles': [
          {
            'text': this.chartTitleName,
            'size': 12
          }
        ],
      'chartScrollbar': {
        'updateOnReleaseOnly': true,
        'oppositeAxis': false,
      },

      'export': this.getExports()
    };

    return data;
  }

  getExports() {
    return {
      'enabled': true,
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

  // "exportFields": [
  //         "IP CONFIG TASK",
  //         "MWCONFIG RADIO CONFIG TASK",
  //         "SDH/TXN CONFIG TASK",
  //         "VOICE CONFIG TASK",
  //         "GRAND TOTAL"
  //       ],
  //       "columnNames": {
  //         "IP CONFIG TASK": "IP CONFIG TASK Data",
  //         "MWCONFIG RADIO CONFIG TASK": "MWCONFIG RADIO CONFIG TASK Data",
  //         "SDH/TXN CONFIG TASK": "SDH/TXN CONFIG TASK Data",
  //         "VOICE CONFIG TASK": "VOICE CONFIG TASK Data",
  //         "GRAND TOTAL": "GRAND TOTAL Data"
  //       },


  /**
   * This f/n used to rename downloaded file
   * @param item
   * @param li
   */
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
    let fields_: string[] = [];
    fields_.push(this.dataProvider.config.xAxes);
    fields_ = fields_.concat(this.dataProvider.config.yAxes);
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
    this.chart.graphs = this.getGraphs(this.dataProvider.config.yAxes),
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

      arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
      res['clickedData'] = arrayDrill;

      this.leftClickDetection.emit(res);
    } else if (event.event.which === 3) {
      // Right Click Detect
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

      arrayDrill[0] = { key: dataContextNextFilter_ + '#' + keyofLabel_, filterName: filterName_ };
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
      if (custFName === 'convertYAxisCountToDays') {
        return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category +
         ': <b>' + this.convertYAxisCountToDays(value) + '</b></span>';
      }
    }
    return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category +
     ': <b>' + value + '</b></span>';
  }

  custLabelFunction(graphDataItem, graph): string {
    const value = graphDataItem.values.value;
    if (this.dataProvider.config['graphLabelFn']) {
      const custFName = this.dataProvider.config['graphLabelFn'];
      if (custFName === 'convertYAxisCountToDays') {
        return this.convertYAxisCountToDays(value);
      }
    }
    return value;
  }

  convertYAxisCountToDays(value): string {
    const units = {
      'Y': 24 * 60 * 365,
      'M': 24 * 60 * 30,
      'W': 24 * 60 * 7,
      'D': 24 * 60,
      'H': 1 * 60,
      'Mn': 1
    };
    const result = [];

    // tslint:disable-next-line: forin
    for (const name in units) {
      const p = Math.floor(value / units[name]);
      if (p === 1) { result.push(p + '' + name); }
      if (p >= 2) { result.push(p + '' + name); }
      value %= units[name];
    }

    let strTobeReturn = '';
    result.map(elm => {
      strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
    });
    return strTobeReturn;
  }

}
