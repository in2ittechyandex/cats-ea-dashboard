import { AmAreaRangeChartComponent } from './am-area-range-chart/am-area-range-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmPieChartComponent } from './am-pie-chart/am-pie-chart.component';
import { AmBarChartComponent } from './am-bar-chart/am-bar-chart.component';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { StackedColumnChartComponent } from './stacked-column-chart/stacked-column-chart.component';
import { AmMsbarChartComponent } from './am-msbar-chart/am-msbar-chart.component';
import { AmReportDataComponent } from './am-report-data/am-report-data.component';
import { AmStackChartComponent } from './am-stack-chart/am-stack-chart.component';
import { AmLineChartComponent } from './am-line-chart/am-line-chart.component';
import { AmAreaChartComponent } from './am-area-chart/am-area-chart.component';
import { AmFunnelChartComponent } from './am-funnel-chart/am-funnel-chart.component';
import { SharedModule } from '../../shared_/shared.module';
import { AmMsbar3dChartComponent } from './am-msbar3d-chart/am-msbar3d-chart.component';
import { AmHeatChartComponent } from './am-heat-chart/am-heat-chart.component';
import { TickCalenderComponent } from './tick-calender/tick-calender.component';
import { AmGaugeMeterChartComponent } from './am-gauge-meter-chart/am-gauge-meter-chart.component';
import { AmBulletChartComponent } from './am-bullet-chart/am-bullet-chart.component';
import { NgxTrendChartsComponent } from './ngx-trend-charts/ngx-trend-charts.component';
import { TrendModule } from 'ngx-trend';
import { AmAreaInoutChartComponent } from './am-area-inout-chart/am-area-inout-chart.component';
import { AmPerformaceInOutChartComponent } from './am-performace-in-out-chart/am-performace-in-out-chart.component';
import { Am4RadialHistogramChartsComponent } from './am4-radial-histogram-charts/am4-radial-histogram-charts.component';
import { Am4BarsWithMovingBulletsComponent } from './am4-bars-with-moving-bullets/am4-bars-with-moving-bullets.component';
import { Am4RadiusradarChartsComponent } from './am4-radiusradar-charts/am4-radiusradar-charts.component';
import { Am4SolidGaugeChartsComponent } from './am4-solid-gauge-charts/am4-solid-gauge-charts.component';
import { Am4DumbbellPlotChartsComponent } from './am4-dumbbell-plot-charts/am4-dumbbell-plot-charts.component';
import { Am4PopulationPyramidChartsComponent } from './am4-population-pyramid-charts/am4-population-pyramid-charts.component';
import { Am4DivergentStackedBarsComponent } from './am4-divergent-stacked-bars/am4-divergent-stacked-bars.component';
import { Am4HorizontalbarChartsComponent } from './am4-horizontalbar-charts/am4-horizontalbar-charts.component';
import { Am4StackHorizontalbarChartsComponent } from './am4-stack-horizontalbar-charts/am4-stack-horizontalbar-charts.component';
import { Am4MicroChartsSparklinesComponent } from './am4-micro-charts-sparklines/am4-micro-charts-sparklines.component';
import { Am4RadarTimelineChartComponent } from './am4-radar-timeline-chart/am4-radar-timeline-chart.component';
import { AmAreaInoutChartNewComponent } from './am-area-inout-chart-new/am-area-inout-chart-new/am-area-inout-chart-new.component';
import { Am4ClusteredBarChartComponent } from './am4-clustered-bar-chart/am4-clustered-bar-chart.component';
import { AmTabularChartComponent } from './am-tabular-chart/am-tabular-chart.component';
import { Am4StackedXy3dchartComponent } from './am4-stacked-xy3dchart/am4-stacked-xy3dchart.component';
import { Am4DonutChartComponent } from './am4-donut-chart/am4-donut-chart.component';
import { Am4ColumnChartComponent } from './am4-column-chart/am4-column-chart.component';
import { Am4MslineChartComponent } from './am4-msline-chart/am4-msline-chart.component';
import { Am4ForceDirectedNetworkComponent } from './am4-force-directed-network/am4-force-directed-network.component';
// import { AmMapWithCurvedLinesComponent } from './am-map-with-curved-lines/am-map-with-curved-lines.component';
// import { AmAreaInoutChartNewComponent } from './am-area-inout-chart-new/am-area-inout-chart-new.component';

@NgModule({
  imports: [
    CommonModule,
    AmChartsModule,
    SharedModule,
    TrendModule
  ],
  declarations: [
    AmPieChartComponent,
    AmBarChartComponent,
    StackedColumnChartComponent,
    AmMsbarChartComponent,
    AmReportDataComponent,
    AmStackChartComponent,
    AmLineChartComponent,
    AmAreaChartComponent,
    AmFunnelChartComponent,
    AmMsbar3dChartComponent,
    AmHeatChartComponent,
    TickCalenderComponent,
    AmGaugeMeterChartComponent,
    AmBulletChartComponent,
    NgxTrendChartsComponent,
    AmAreaInoutChartComponent,
    AmPerformaceInOutChartComponent,
    Am4RadialHistogramChartsComponent,
    Am4BarsWithMovingBulletsComponent,
    Am4RadiusradarChartsComponent,
    Am4SolidGaugeChartsComponent,
    Am4DumbbellPlotChartsComponent,
    Am4PopulationPyramidChartsComponent,
    Am4DivergentStackedBarsComponent,
    Am4HorizontalbarChartsComponent,
    Am4StackHorizontalbarChartsComponent,
    Am4MicroChartsSparklinesComponent,
    Am4RadarTimelineChartComponent,
    AmAreaInoutChartNewComponent,
    Am4ClusteredBarChartComponent,
    AmTabularChartComponent,
    Am4StackedXy3dchartComponent,
    // AmMapWithCurvedLinesComponent,
    Am4DonutChartComponent,
    AmAreaRangeChartComponent,
    Am4ColumnChartComponent,
    Am4MslineChartComponent,
    Am4ForceDirectedNetworkComponent
  ],
  exports: [AmPieChartComponent,
    AmBarChartComponent,
    StackedColumnChartComponent,
    AmMsbarChartComponent,
    AmReportDataComponent,
    AmStackChartComponent,
    AmLineChartComponent,
    AmAreaChartComponent,
    AmFunnelChartComponent,
    AmMsbar3dChartComponent,
    AmHeatChartComponent,
    TickCalenderComponent,
    AmGaugeMeterChartComponent,
    AmBulletChartComponent,
    NgxTrendChartsComponent,
    AmAreaInoutChartComponent,
    AmPerformaceInOutChartComponent,
    Am4RadialHistogramChartsComponent,
    Am4BarsWithMovingBulletsComponent,
    Am4RadiusradarChartsComponent,
    Am4SolidGaugeChartsComponent,
    Am4DumbbellPlotChartsComponent,
    Am4PopulationPyramidChartsComponent,
    Am4DivergentStackedBarsComponent,
    Am4HorizontalbarChartsComponent,
    Am4StackHorizontalbarChartsComponent,
    Am4MicroChartsSparklinesComponent,
    Am4RadarTimelineChartComponent,
    AmAreaInoutChartNewComponent,
    Am4ClusteredBarChartComponent,
    AmTabularChartComponent,
    Am4StackedXy3dchartComponent,
    // AmMapWithCurvedLinesComponent,
    Am4DonutChartComponent,
    AmAreaRangeChartComponent,
    Am4ColumnChartComponent,
    Am4MslineChartComponent,
    Am4ForceDirectedNetworkComponent
  ]
})
export class CustomizedAmChartModule { }
