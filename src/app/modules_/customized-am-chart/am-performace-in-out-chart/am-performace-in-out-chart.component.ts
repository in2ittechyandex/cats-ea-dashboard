import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'cats-am-performace-in-out-chart',
  templateUrl: './am-performace-in-out-chart.component.html',
  styleUrls: ['./am-performace-in-out-chart.component.css']
})
export class AmPerformaceInOutChartComponent implements OnInit, AfterViewInit, OnDestroy {



  constructor(private AmCharts: AmChartsService) { }
  private chart: AmChart;


  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;
  @Input() reportSequence;
  @Input() reportId;
  @Input() theme;

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  public supportTypes: Array<String> = ['PNG', 'JPG', 'SVG', 'PDF', 'CSV', 'XLSX', 'JSON'];


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
  }

  getValueAxes() {
    return [{
      'gridThickness': 0,
      'title': this.dataProvider.config.yAxesTitle
    }];
  }

  getCategoryAxis() {
    return {
      'axisAlpha': 0,
      'labelsEnabled': false,
      'gridThickness': 0,
      'title': this.dataProvider.config.xAxesTitle
    };
  }

  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'light',
      'marginRight': 0,

      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxes(),
      'graphs': this.getGraphs(this.dataProvider.config.yAxes),
      'chartCursor': {
        'categoryBalloonEnabled': false
      },
      'categoryAxis': this.getCategoryAxis(),
      'categoryField': this.dataProvider.config.xAxes,
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
    return fields_;
  }

  getGraphs(series) {
    const arrGraph = [];
    series.forEach(seriesName => {
      const obj = {
        'id': seriesName,
        'fillAlphas': 0.4,
        'valueField': seriesName,
        'title': seriesName,
        'balloonFunction': this.balloonFunction.bind(this),
        'labelText': this.dataProvider.config['displayGraphLabel'] ? ' ' : null,
        'labelFunction': this.custLabelFunction.bind(this)
      };
      arrGraph.push(obj);
    });
    return arrGraph;
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
    return '<b>' + title + '</b><br><span style=\'font-size:14px\'>' + category + ': <b>' + value + '</b></span>';
  }

  custLabelFunction(graphDataItem, graph): string {
    const value = graphDataItem.values.value;
    const title = graph.title;
    const category = graphDataItem.category;
    return value;
  }


  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
