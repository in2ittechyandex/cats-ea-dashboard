import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';


@Component({
  selector: 'cats-stacked-column-chart',
  templateUrl: './stacked-column-chart.component.html',
  styleUrls: ['./stacked-column-chart.component.css']
})
export class StackedColumnChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: AmChart;
  @Input() chartUniqueId;
  @Input() chartType;
  @Input() dataProvider;

  @Input() chartTitleName;
  @Input() heightPixel;
  @Input() widthPer;

  constructor(private AmCharts: AmChartsService) {

  }

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }


  ngAfterViewInit() {
    this.getData2();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  getData2() {
    const chart = am4core.create(this.chartUniqueId, am4charts.XYChart);
    chart.scrollbarY = new am4core.Scrollbar();

    chart.data = this.dataProvider.data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.title.text = this.chartTitleName;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = 'Expenditure (M)';

    // Create series
    function createSeries(field, name, stacked) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = 'month';
      series.name = name;
      series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    const seriesList = this.dataProvider.config.yAxes;
    seriesList.forEach(keySeries => {
      createSeries(keySeries, keySeries, true);
    });

  }


}
