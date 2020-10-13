import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import themeConf_ from 'src/app/config/theme-settings';

@Component({
  selector: 'cats-am-msbar3d-chart',
  templateUrl: './am-msbar3d-chart.component.html',
  styleUrls: ['./am-msbar3d-chart.component.css']
})
export class AmMsbar3dChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  private chart: AmChart;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  public fillColors_: Array<string> = [];
  public lineColor_: Array<string> = [];
  /**
   * This f/n used to rename downloaded file
   * @param item
   * @param li
   */
  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];

  getLegends() {
    return {
      'horizontalGap': 0,
      'maxColumns': 6,
      'position': 'bottom',
      'useGraphSettings': true,
      'markerSize': 10
    };
  }


  getValueAxes() {
    return [{
      'stackType': '3d',
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

  getGraphs(series) {
    const arrGraph = [];
    series.forEach((seriesName, index) => {
      const obj = {
        'balloonText': '<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>',
        'fillAlphas': 0.8,
        // "labelText": "[[value]]",
        'lineAlpha': 0.3,
        'title': seriesName,
        'type': 'column',
        // 'fillColors': (this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        // 'lineColor': (this.lineColor_.length - 1 > index) ? this.lineColor_[index] : null,
        'fillColors': this.getFillColorsCode(seriesName), //(this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        'lineColor': this.getFillColorsCode(seriesName),
        'valueField': seriesName
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
      'legend': this.getLegends(),
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.yAxes),
      'categoryField': this.dataProvider.config.xAxes,
      'categoryAxis': this.getCategoryAxis(),

      'depth3D': 50,
      'angle': 20,

      'export': this.getExports(),
      'titles': [
        {
          'text': this.chartTitleName,
          'size': 12
        }],
        'chartScrollbar': {
          'updateOnReleaseOnly': true,
          'oppositeAxis': false,
        },
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
    let fields_: string[] = [];
    fields_.push(this.dataProvider.config.xAxes);
    fields_ = fields_.concat(this.dataProvider.config.yAxes);
    return fields_;
  }

  getFillColorsCode(label_) {
    let keys_ = this.dataProvider.config['colors'] ? this.dataProvider.config['colors'] : {};
    return (keys_.hasOwnProperty('' + label_) ? keys_[label_] : null);
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

}
