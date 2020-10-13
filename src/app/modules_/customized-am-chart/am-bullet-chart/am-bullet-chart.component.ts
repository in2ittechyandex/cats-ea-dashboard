import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'cats-am-bullet-chart',
  templateUrl: './am-bullet-chart.component.html',
  styleUrls: ['./am-bullet-chart.component.css']
})
export class AmBulletChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Input() theme;



  private chart: AmChart;
  constructor(private AmCharts: AmChartsService) { }


  getvalueAxes() {
    return [
      {
        'maximum': 100,
        'stackType': 'regular',
        'gridAlpha': 0
      }
    ];
  }

  getGraphs() {
    return [
      {
        'valueField': 'full',
        'showBalloon': false,
        'type': 'column',
        'lineAlpha': 0,
        'fillAlphas': 0.8,
        'fillColors': [
          '#19d228',
          '#f6d32b',
          '#fb2316'
        ],
        'gradientOrientation': 'horizontal'
      },
      {
        'clustered': false,
        'columnWidth': 0.3,
        'fillAlphas': 1,
        'lineColor': '#000000',
        'stackable': false,
        'type': 'column',
        'valueField': 'bullet'
      },
      {
        'columnWidth': 0.5,
        'lineColor': '#000000',
        'lineThickness': 3,
        'noStepRisers': true,
        'stackable': false,
        'type': 'step',
        'valueField': 'limit'
      }
    ];
  }

  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'rotate': true,
      'theme': 'none',
      'autoMargins': false,
      'marginTop': 30,
      'marginLeft': 80,
      'marginBottom': 30,
      'marginRight': 50,
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getvalueAxes(),
      'startDuration': 1,
      'graphs': this.getGraphs(),
      'columnWidth': 1,
      'categoryField': this.dataProvider.config.categoryField,
      'categoryAxis': {
        'gridAlpha': 0,
        'position': 'left'
      }
    };
    return data;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
