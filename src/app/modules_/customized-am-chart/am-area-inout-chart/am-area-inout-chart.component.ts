import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'cats-am-area-inout-chart',
  templateUrl: './am-area-inout-chart.component.html',
  styleUrls: ['./am-area-inout-chart.component.css']
})
export class AmAreaInoutChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: AmChart;
  isChartCreated = false;
  // chartUniqueId:string = 'chartdiv';

  @Input() type: string;
  @Input() chartUniqueId;
  @Input() heightPixel;
  @Input() widthPer;
  @Input() range1;
  @Input() range2;
  @Input() singlename;


  generateChartData() {
    const chartData = [];
    let firstValue = 0;

    let bar;
    let foo;
    for (let i = 0; i < 200; i++) {
      bar = Math.floor(Math.random() * Math.floor(this.range1));
      foo = Math.floor(Math.random() * Math.floor(this.range2));
      if (this.type === 'single') {
        chartData.push({
          numx: firstValue,
          bar: bar
        });
      } else {
        chartData.push({
          numx: firstValue,
          bar: bar,
          foo: -foo
        });
      }
      firstValue++;
    }
    return chartData;
  }

  constructor(private AmCharts: AmChartsService) { }


  ngOnInit() {
    this.isChartCreated = this.generateChartData().length > 0;
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    }, 500);
  }

  ngAfterViewInit() {

  }

  inoutname() {
    let a;
    if (this.type === 'single') {
      a = '<div style=\'margin:5px; font-size:19px;\'>'+ this.singlename +':<b>[[value]]</b></div>';
    } else {
      a = '<div style=\'margin:5px; font-size:19px;\'>In:<b>[[value]]</b></div>';
    }
    return a;
  }

  singleDouble() {
    const a = [];
    const g1 = {
      'id': 'g1',
      'fillAlphas': 0.4,
      'valueField': 'bar',
      'balloonText': this.inoutname()
    };
    const g2 = {
      'id': 'g2',
      'fillAlphas': 0.4,
      'valueField': 'foo',
      'balloonText': '<div style=\'margin:5px; font-size:19px;\'>Out:<b>[[value]]</b></div>'
    };
    if (this.type === 'single') {
      a.push(g1);
    } else {
      a.push(g1, g2);
    }
    return a;

  }

  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'light',
      'marginRight': 0,

      'dataProvider': this.generateChartData(),
      'valueAxes': [{
        'gridThickness': 0
      }],
      'graphs': this.singleDouble(),
      'chartCursor': {
        'categoryBalloonEnabled': false
      },

      'categoryAxis': {
        'axisAlpha': 0,
        'labelsEnabled': false,
        'gridThickness': 0
      }
    };
    return data;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
