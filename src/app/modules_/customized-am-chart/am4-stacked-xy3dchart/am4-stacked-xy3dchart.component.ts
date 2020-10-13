import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import themeConf_ from 'src/app/config/theme-settings';
@Component({
  selector: 'cats-am4-stacked-xy3dchart',
  templateUrl: './am4-stacked-xy3dchart.component.html',
  styleUrls: ['./am4-stacked-xy3dchart.component.css']
})
export class Am4StackedXy3dchartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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
      'stackByValue': true,
      // 'axisAlpha': 0.3,
      // 'gridAlpha': 0,
      // 'title': this.dataProvider.config.yAxesTitle,
      'labelsEnabled': false,

        'gridThickness': 0,
        'axisAlpha': 0,
        'gridAlpha': 0.1,
        'tickAlpha': 0
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
        // 'balloonText': '<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>',
        'balloonFunction': this.balloonFunction.bind(this),
        'fillAlphas': 0.8,
        // "labelText": "[[value]]",
        'lineAlpha': 0.3,
        'title': seriesName,
        'type': 'column',
        // 'fillColors': (this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        // 'lineColor': (this.lineColor_.length - 1 > index) ? this.lineColor_[index] : null,
        'fillColors': this.getFillColorsCode(seriesName), // (this.fillColors_.length - 1 > index) ? this.fillColors_[index] : null,
        'lineColor': this.getFillColorsCode(seriesName),
        'valueField': seriesName
      };
      arrGraph.push(obj);


    });
    return arrGraph;
  }

  getFillColorsCode(label_) {
    let keys_ = this.dataProvider.config['colors'] ? this.dataProvider.config['colors'] : {};
    return (keys_.hasOwnProperty('' + label_) ? keys_[label_] : null);
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
         ': <b>' + this.convertCountToString(value, 'mn', 'sm') + '</b></span>';
      } else if (custFName === 'convertYAxisCount_SecoundToDays') {
        return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category +
        ': <b>' + this.convertCountToString(value, 's', 'sm') + '</b></span>';
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
        return this.convertCountToString(value, 'mn', 'sm');
      } else if (custFName === 'convertYAxisCount_SecoundToDays') {
        return this.convertCountToString(value, 's', 'sm');
      }

    }
    return value;
  }

  // convertYAxisCountToDays(value): string {
  //   return this.convertCountToString(value, 's', 'sm');
  //   if (value == '0') {
  //     return '0';
  //   }
  //   const units = {
  //     'Y': 24 * 60 * 365,
  //     'M': 24 * 60 * 30,
  //     'W': 24 * 60 * 7,
  //     'D': 24 * 60,
  //     'H': 1 * 60,
  //     'Mn': 1
  //   };
  //   const result = [];

  //   // tslint:disable-next-line: forin
  //   for (const name in units) {
  //     const p = Math.floor(value / units[name]);
  //     if (p === 1) { result.push(p + '' + name); }
  //     if (p >= 2) { result.push(p + '' + name); }
  //     value %= units[name];
  //   }

  //   let strTobeReturn = '';
  //   result.map(elm => {
  //     strTobeReturn += (strTobeReturn === '') ? elm : ',' + elm;
  //   });
  //   return strTobeReturn;
  // }


 // Ramji changes start : 

 convertCountToString(value, valueUnit, aliasType): string {
  if (value == '0') {
    return '0';
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
