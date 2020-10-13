import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import themeConf_ from '../../../config/theme-settings';

@Component({
  selector: 'cats-am-line-chart',
  templateUrl: './am-line-chart.component.html',
  styleUrls: ['./am-line-chart.component.css']
})
export class AmLineChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  @Input() listenEventsAll = false;
  @Input() theme;

  themeConf_;
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
    return {
      'equalWidths': false,
      'periodValueText': 'total: [[value.sum]]',
      'position': 'bottom',
      'valueAlign': 'left',
      'valueWidth': 100
    };
  }


  getValueAxes() {
    return [{
      'gridAlpha': 0.05,
      'position': 'left',
      'title': this.dataProvider.config.yAxesTitle,
      'showLastLabel': true,
      'showFirstLabel': true
    }];
  }

  getCategoryAxis() {
    return {
      'startOnAxis': true,
      'axisColor': '#DADADA',
      'gridAlpha': 0.04,
      'title': this.dataProvider.config.xAxesTitle,
      'labelRotation': 15
    };
  }

  /**
   *
   * @param series array of bar data u want to create .
   */
  getGraphs(series) {
    const arrGraph = [];
    series.forEach((seriesName, index) => {
      const obj = {
        'balloonText': '<span style=\'font-size:14px; color:#000000;\'><b>[[value]]</b></span>',
        'lineThickness': 2,
        'title': seriesName,
        'valueField': seriesName,
        'index': (series.indexOf(seriesName) + 1),
        'bullet': 'bubble',
      };
      arrGraph.push(obj);


    });
    return arrGraph;
  }


  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'none',
      // "theme": this.theme ? this.theme : 'none',
      'legend': this.getLegends(),
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.yAxes),
      'plotAreaBorderAlpha': 0,
      'chartCursor': {
        'cursorAlpha': 0
      },
      'categoryField': this.dataProvider.config.xAxes,
      'categoryAxis': this.getCategoryAxis(),

      'chartScrollbar': {
        'updateOnReleaseOnly': true,
        'oppositeAxis': false,
      },
      'export': this.getExports(),
      'colors': this.getFillColors(),
      'titles': [
        {
          'text': this.chartTitleName,
          'size': 12
        }]

      // 'sequencedAnimation':true,
      // 'startDuration':3,
      // 'startEffect':'bounce',

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


  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['theme'] && !changes['theme']['firstChange']) {
      this.reloadChart();
    }
  }

  reloadChart() {
    this.chart.colors = this.getFillColors(),
      this.chart.validateData();
  }

  ngAfterViewInit() {
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    this.chart.addListener('rightClickGraphItem', this.doOperationClickOnChart.bind(this));
    this.chart.addListener('clickGraphItem', this.doOperationClickOnChart.bind(this));

  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }


  doOperationClickOnChart2(event) {
    // console.log('line----------------------------------');
    const xCord = event.event.pageX;
    const yCord = event.event.pageY;
    const screenX = event.event.screenX;
    const screenY = event.event.screenY;
    const res = {
      clientX: xCord,
      clientY: yCord,
      screenX: screenX,
      screenY: screenY,
      reportId: this.reportId,
      reportSequence: this.reportSequence
    };

    const keyLabel_ = event.item.category;
    const valueLabel_ = event.item.values.value;
    const allValues = event.item.dataContext;
    const categoryField = this.dataProvider.config.xAxes;

    if (event.event.which === 1) {
      // left click detect
      if (this.listenEventsAll) {
        res['clickedData'] = {
          'label': keyLabel_,
          'value': valueLabel_,
          'dataContext': allValues,
          'categoryField': categoryField
        };
        this.leftClickDetection.emit(res);
      }

    } else if (event.event.which === 3) {
      // right click detect
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



}
