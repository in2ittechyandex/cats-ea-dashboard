import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'cats-am-area-inout-chart-new',
  templateUrl: './am-area-inout-chart-new.component.html',
  styleUrls: ['./am-area-inout-chart-new.component.css']
})
export class AmAreaInoutChartNewComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @Input() dataProvider;
  @Input() size = 'sm';

  constructor(private AmCharts: AmChartsService) { }


  ngOnInit() {
    // this.isChartCreated = this.generateChartData().length > 0;
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart('' + this.chartUniqueId, this.createChartConfig());
    }, 500);
  }

  ngAfterViewInit() {

  }

  inoutname() {
    let a;
    if (this.type === 'single') {
      a = '<div style=\'margin:5px; font-size:19px;\'>' + this.singlename + ':<b>[[value]]</b></div>';
    } else {
      a = '<div style=\'margin:5px; font-size:19px;\'>In:<b>[[value]]</b></div>';
    }
    return a;
  }

  singleDouble() {
    const a = [];
    const sList = this.dataProvider.config.yAxes;
    sList.forEach((element, index) => {
      const series_ = {
        'id': 'g' + (index + 1),
        'fillAlphas': 0.4,
        'valueField': element,
      };
      if (this.size == 'md') {
        series_['lineAlpha'] = 0.5,
          series_['title'] = element,
          // 'balloonText': "<div style=\'margin:5px; font-size:9px;\'>"+element+"<b>[[value]]</b></div>"
          series_['balloonText'] = "<b>[[title]]</b><br><span style=\'font-size:14px\'>[[category]]: <b>[[value]]</b></span>";//"<div style=\'margin:5px; font-size:9px;\'>" + element + "<b>[[value]]</b></div>";
      }

      a.push(series_);
    });
    return a;

  }

  getValueAxis() {
    if (this.size == 'sm') {
      return [{
        'gridThickness': 0,
        'labelsEnabled': false,
        'axisAlpha': 0,
        'gridAlpha': 0.1,
        'tickAlpha': 0
      }];
    } else if (this.size == 'md') {
      return [{
        'gridThickness': 0,
        'labelsEnabled': true,
        'axisAlpha': 0.7,
        'gridAlpha': 0.1,
        'tickAlpha': 0,
      }];
    }
  }

  getCategoryAxis() {
    if (this.size == 'sm') {
      return {
        'axisAlpha': 0,
        'labelsEnabled': false,
        'gridThickness': 0,
        'startOnAxis': true,
        'gridColor': '#ffffff',
        'labelOffset': 0
        , 'tickLength': 0
      };
    } else if (this.size == 'md') {
      return {
        'axisAlpha': 0.3,
        'gridThickness': 0,
        'labelsEnabled': false,
        'startOnAxis': false,
        'axisColor': '#DADADA',
        'gridAlpha': 0.1,
        'labelRotation': 10,
        'title': this.dataProvider.config.xAxesTitle,
        'fontSize': 12,
      };
    }
  }

  getLegends() {
    if (this.size == 'sm') {
      return { 'enabled': false };
    } else if (this.size == 'md') {
      return {
        'horizontalGap': 0,
        'maxColumns': 2,
        'position': 'bottom',
        'useGraphSettings': false,
        'markerSize': 9,
        'align': 'right',
        'fontSize': 10,
        'markerLabelGap': 10,
        'valueFunction': function (graphDataItem, valueText) {
          return '';
        }
      };
    }
  }

  getChartCursor() {
    if (this.size == 'sm') {
      return {
        'enabled': false
      };
    } else if (this.size == 'md') {
      return {
        'categoryBalloonEnabled': true,
        'categoryBalloonAlpha': 0.9,
        'enabled': true
      }
    }
  }

  getScrollBar() {
    if (this.size == 'sm') {
      return {
        'enabled': false
      };
    } else if (this.size == 'md') {
      return {
        'updateOnReleaseOnly': true,
        'oppositeAxis': false,
        'offset':10,
        'enabled': true,
        'scrollbarHeight':10
      }
    }
  }

  createChartConfig() {
    const data = {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'light',
      'marginRight': 0,
      'dataProvider': this.dataProvider.data,
      'valueAxes': this.getValueAxis(),
      'graphs': this.singleDouble(),
      'legend': this.getLegends(),
      'chartCursor': this.getChartCursor(),
      'categoryAxis': this.getCategoryAxis(),
      'categoryField': this.dataProvider.config.titleField,
      // 'chartScrollbar': {
      //   'updateOnReleaseOnly': true,
      //   'oppositeAxis': false,
      // },
      // 'chartScrollbar':this.getScrollBar()
    };
    return data;
  }


  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
