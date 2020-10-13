import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'cats-am-gauge-meter-chart',
  templateUrl: './am-gauge-meter-chart.component.html',
  styleUrls: ['./am-gauge-meter-chart.component.css']
})
export class AmGaugeMeterChartComponent implements OnInit, OnDestroy {

  @Input() chartUniqueId ;
  @Input() chartType;
  @Input() dataProvider;
  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  @Input() reportSequence;
  @Input() reportId;

  @Input() theme;

  isloaded = false;

  private chart: AmChart;
  constructor(private AmCharts: AmChartsService) { }

  @Output() rightClickDetection = new EventEmitter();
  @Output() leftClickDetection = new EventEmitter();

  createChartConfig() {
   const data = {
    'hideCredits': true,
    'type': 'gauge',
    'theme': 'none',
    'axes': [{
      'axisThickness': 0,
      'axisAlpha': 0.2,
      'tickAlpha': 0,
      'labelsEnabled': true,
      'labelFrequency': 1,
      'labelOffset': 2,
      'showFirstLabel': true,
      'showLastLabel': true,
      'bands': [{
        'color': '#84b761',
        'endValue': 30,
        'startValue': 0,
        'innerRadius': '95%',
      }, {
        'color': '#fdd400',
        'endValue': 60,
        'startValue': 30,
        'innerRadius': '95%',
      }, {
        'color': '#cc4748',
        'endValue': 100,
        'innerRadius': '95%',
        'startValue': 60
      }],
      'bottomText': this.chartTitleName,
      'bottomTextYOffset': 20,
      'endValue': 100
    }],
    'arrows': [{
      'value': this.dataProvider
    }],
    'export': {
      'enabled': false
    }
  };
    return data;
  }

  ngOnInit() {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    }, 300);

   }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  createLabel(value) {
    return value / 100.0;
  }



}
