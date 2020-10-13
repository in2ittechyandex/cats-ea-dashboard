import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import themeConf_ from 'src/app/config/theme-settings';
// import themeConf_ from '../../../config/theme-settings';

@Component({
  selector: 'cats-am-area-chart',
  templateUrl: './am-area-chart.component.html',
  styleUrls: ['./am-area-chart.component.css']
})
export class AmAreaChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  private chart: AmChart;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  @Input() theme;

  themeConf_;
  public fillColors_: Array<string> = [];
  public lineColor_: Array<string> = [];
  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];

  ngOnInit() {
  }

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


  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  ngAfterViewInit() {
    this.fillColors_ = this.getFillColors();
    this.lineColor_ = this.getLineColors();
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    this.chart.fontSize = 7;
    this.chart.addListener('clickGraph', this.doOperationClickOnChart.bind(this));
    //#region :leftClickDetection
    //#region :rightClickDetection
    this.chart.addListener('rightClickGraphItem', this.doOperationClickOnChart.bind(this));
    //#region :rightClickDetection
    this.chart.addListener('clickGraphItem', this.doOperationClickOnChart.bind(this));
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


  getLegends() {
    return {
      // 'align': 'center',
      // 'equalWidths': false,
      // // "periodValueText": "total: [[value.sum]]",
      // 'valueAlign': 'left',
      // // "valueText": "[[value]] ([[percents]]%)",
      // 'valueWidth': 100

      // "markerSize": 7,
      // "contentAlign": "right",
      // 'align': 'right'


      'horizontalGap': 0,
      'maxColumns': 2,
      'position': 'right',
      'useGraphSettings': false,
      'markerSize': 7,
      'align': 'right',
      'fontSize': 10,
      'valueFunction': function(graphDataItem, valueText) {
        return '';
      }

      // "enabled": false
    };
  }

  /**
   *   set stack type if we want to create multistack the "stackType" should we "normal" otherwise "none"
   */
  getValueAxes() {
    return [{
      'stackType': 'regular',
      'gridAlpha': 0.01,
      'position': 'left',
      'title': this.dataProvider.config.yAxesTitle,

      'axisAlpha': 0.01,

      'minimum': 0,
      'maximum': 100,
      'fontSize': 9

    }];
  }

  getCategoryAxis() {
    return {
      'startOnAxis': true,
      'axisColor': '#DADADA',
      'gridAlpha': 0.07,
      'labelRotation': 10,
      'title': this.dataProvider.config.xAxesTitle,
      'fontSize': 9,
    };
  }

  /**
   *
   * @param series array of bar data u want to create .
   */
  getGraphs(series: any[]) {
    const arrGraph = [];
    series.forEach((seriesName, index) => {
      const obj = {
        'fillAlphas': 0.5,
        'lineAlpha': 0.5,
        'title': seriesName,
        'valueField': seriesName,
        'index': 2,
        'fillColors': (this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        'lineColor': (this.lineColor_.length - 1 > index) ? this.lineColor_[index] : null,
        'balloonText': '<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>'
      };
      arrGraph.push(obj);
    });
    return arrGraph;
  }

  /**
   * It will Created Chart Based on Your Data.
   */
  createChartConfig() {
    return {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'none',
      // "theme": this.theme ? this.theme : 'none',
      'legend': this.getLegends(),
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.yAxes),
      'plotAreaBorderAlpha': 0,
      'startDuration': 0,
      'marginLeft': 0,
      'marginBottom': 0,
      'chartCursor': {
        'cursorAlpha': 0,
        'zoomable': false
      },
      'categoryField': this.dataProvider.config.xAxes,
      'categoryAxis': this.getCategoryAxis(),
      'export': this.getExports(),
      'fontSize': 9
    };
  }
  getExports() {
    return {
      'enabled': false,
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
    fields_.push(this.dataProvider.config.xAxesTitle);
    fields_.push(this.dataProvider.config.valueField);
    // fields_ = fields_.concat(this.dataProvider.config.titleField);
    return fields_;
  }

  /**
   * This f/n will trigered where user makes  click on Charts Slide.
   * @param event having  Click Event Information
   */
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
      // this.leftClickDetection.emit(res);
    } else if (event.event.which === 3) {
      // Right Click Detect
      // this.rightClickDetection.emit(res);
    }
  }


}
