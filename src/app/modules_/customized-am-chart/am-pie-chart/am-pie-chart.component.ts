import { AmChart } from '@amcharts/amcharts3-angular';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import themeConf_ from '../../../config/theme-settings';


@Component({
  selector: 'cats-am-pie-chart',
  templateUrl: './am-pie-chart.component.html',
  styleUrls: ['./am-pie-chart.component.css']
})
export class AmPieChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  constructor(private AmCharts: AmChartsService) {
    this.themeConf_ = themeConf_;
  }

  private chart: AmChart;
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
  @Input() accessType = '';

  themeConf_;
  public fillColors_: Array<string> = [];
  public lineColor_: Array<string> = [];
  /**
   * This f/n used to rename downloaded file
   * @param item
   * @param li
   */
  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['theme'] && !changes['theme']['firstChange']) {
      this.reloadChart();
    }
  }

  reloadChart() {
    this.chart.colors = this.getFillColors(),
      this.chart.validateData();
  }

  makeChartConfig() {
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, {
      'hideCredits': true,
      'type': this.chartType,
      'theme': 'none',
      // "theme": this.theme ? this.theme : 'none',
      'dataProvider': this.dataProvider.data,
      'valueField': this.dataProvider.config.valueField,
      'titleField': this.dataProvider.config.titleField,
      'labelText': this.dataProvider.config.labelText,
      'allLabels': [],
      'titles': [
        {
          'text': this.chartTitleName,
          'size': 12
        }
      ],
      'colors': this.getFillColors(),
      'export': this.getExports(),
      'balloonText': this.balloonFunction()
    });
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


  // Export start
  getExports() {
    if (this.accessType === 'chatbot') {
      return {};
    } else {
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
          // chart.graphs[0].labelText = "[[value]]";
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


  }
  /**
   * This f/n used to select headers to be display in exported file
   */
  createExportFields() {
    const fields_: string[] = [];
    fields_.push(this.dataProvider.config.titleField);
    fields_.push(this.dataProvider.config.valueField);
    // fields_ = fields_.concat(this.dataProvider.config.yAxes);
    return fields_;
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
  // Export end

  ngAfterViewInit() {
    this.makeChartConfig();
    this.AmCharts.addListener(this.chart, 'clickSlice', this.doOperationClickOnChartSlide.bind(this));

    // initialize step array
    this.chart.drillLevels = [{
      'title': this.chartTitleName,
      'data': this.dataProvider
    }];
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  ngOnInit() { }

  doOperationClickOnChartSlide(event) {
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
    if (event.event.which == 1) {

      const arrayDrill: any[] = [];
      const key = this.dataProvider.config.titleField;
      // let value = event.dataItem.dataContext[key];
      const value = event.dataItem.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];

      if (key && value) {
        arrayDrill[0] = { key: value, filterName: filterName_ };
      }
      res['clickedData'] = arrayDrill;
      this.leftClickDetection.emit(res);

    } else if (event.event.which === 3) {
      // Right Click Detect
      const arrayDrill: any[] = [];
      const key = this.dataProvider.config.titleField;
      const value = event.dataItem.dataContext['nextFilter'];
      const filterName_ = this.dataProvider.config['filterName'];

      if (key && value) {
        arrayDrill[0] = { key: value, filterName: filterName_ };
      }
      res['clickedData'] = arrayDrill;

      this.rightClickDetection.emit(res);
    }



  }

    /**
     * this f/n used to manage custom hover f/nality on bar
     * @param graphDataItem graph bar items
     * @param graph graph object
     */
  balloonFunction(): string {
    if (this.dataProvider.config['graphBalloonFn']) {
      const custFName = this.dataProvider.config['graphBalloonFn'];
      if (custFName === 'hourwisetrends') {
        return '[[title]] Hour: [[value]]';
      } else if (custFName === 'hopeswisetrends') {
        return '[[title]] Hopes: [[value]] Tickets';
      }
    }
    return '[[title]] : [[percents]]% ([[value]])';
  }

  custLabelFunction(): string {
    if (this.dataProvider.config['graphLabelFn']) {
      const custFName = this.dataProvider.config['graphLabelFn'];
      if (custFName === 'hourwisetrends') {
        return '[[title]] Hour: [[value]]';
      } else if (custFName === 'hopeswisetrends') {
        return '[[title]] Hopes: [[value]] Tickets';
      }
    }
    return this.dataProvider.config['labelText'];
  }


}
