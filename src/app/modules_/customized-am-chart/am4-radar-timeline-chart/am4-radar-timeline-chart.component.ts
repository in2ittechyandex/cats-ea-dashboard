import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);


@Component({
    selector: 'cats-am4-radar-timeline-chart',
    templateUrl: './am4-radar-timeline-chart.component.html',
    styleUrls: ['./am4-radar-timeline-chart.component.css']
})
export class Am4RadarTimelineChartComponent implements OnInit,AfterViewInit {
    private chart: am4charts.RadarChart

    @Input() chartUniqueId;
    @Input() chartType;
    @Input() dataProvider;
    @Input() chartTitleName;
    @Input() heightPixel;
    @Input() widthPer;

    @Input() reportSequence;
    @Input() reportId;
    @Input() theme;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.dataProvider.data.length > 0) {
            this.buildChart();
        }
    }

    buildChart() {

        var dataAss = this.dataProvider.data;//[{ "agroup": "ASD_0", "assignee": [{ "name": "ASD_0Test0", "open": 0, "close": 0 }, { "name": "ASD_0Test1", "open": 1, "close": 3 }, { "name": "ASD_0Test2", "open": 2, "close": 6 }, { "name": "ASD_0Test3", "open": 3, "close": 9 }, { "name": "ASD_0Test4", "open": 4, "close": 12 }] }, { "agroup": "ASD_1", "assignee": [{ "name": "ASD_1Test0", "open": 2, "close": 1 }, { "name": "ASD_1Test1", "open": 3, "close": 4 }, { "name": "ASD_1Test2", "open": 4, "close": 7 }, { "name": "ASD_1Test3", "open": 5, "close": 10 }, { "name": "ASD_1Test4", "open": 6, "close": 13 }] }, { "agroup": "ASD_2", "assignee": [{ "name": "ASD_2Test0", "open": 4, "close": 2 }, { "name": "ASD_2Test1", "open": 5, "close": 5 }, { "name": "ASD_2Test2", "open": 6, "close": 8 }, { "name": "ASD_2Test3", "open": 7, "close": 11 }, { "name": "ASD_2Test4", "open": 8, "close": 14 }] }, { "agroup": "ASD_3", "assignee": [{ "name": "ASD_3Test0", "open": 6, "close": 3 }, { "name": "ASD_3Test1", "open": 7, "close": 6 }, { "name": "ASD_3Test2", "open": 8, "close": 9 }, { "name": "ASD_3Test3", "open": 9, "close": 12 }, { "name": "ASD_3Test4", "open": 10, "close": 15 }] }, { "agroup": "ASD_4", "assignee": [{ "name": "ASD_4Test0", "open": 8, "close": 4 }, { "name": "ASD_4Test1", "open": 9, "close": 7 }, { "name": "ASD_4Test2", "open": 10, "close": 10 }, { "name": "ASD_4Test3", "open": 11, "close": 13 }, { "name": "ASD_4Test4", "open": 12, "close": 16 }] }];
        let colorSet = new am4core.ColorSet();

        let chart = am4core.create(this.chartUniqueId, am4charts.RadarChart);

        chart.logo.hidden = true; // hide amchart4 icon 
        
        chart.numberFormatter.numberFormat = "#";
        chart.hiddenState.properties.opacity = 0;

        chart.startAngle = 270 - 180;
        chart.endAngle = 270 + 180;

        chart.padding(5, 15, 5, 10)
        chart.radius = am4core.percent(45);
        chart.innerRadius = am4core.percent(20);

        // year label goes in the middle
        let yearLabel = chart.radarContainer.createChild(am4core.Label);
        yearLabel.horizontalCenter = "middle";
        yearLabel.verticalCenter = "middle";
        yearLabel.fill = am4core.color("#673AB7");
        yearLabel.fontSize = 20;
        yearLabel.text = String('');

        // zoomout button
        let zoomOutButton = chart.zoomOutButton;
        zoomOutButton.dx = 0;
        zoomOutButton.dy = 0;
        zoomOutButton.marginBottom = 15;
        zoomOutButton.parent = chart.rightAxesContainer;

        // scrollbar
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.rightAxesContainer;
        chart.scrollbarX.orientation = "vertical";
        chart.scrollbarX.align = "center";
        chart.scrollbarX.exportable = false;

        // vertical orientation for zoom out button and scrollbar to be positioned properly
        chart.rightAxesContainer.layout = "vertical";
        chart.rightAxesContainer.padding(40, 10, 40, 10);

        // category axis
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis<any>());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "name";

        let categoryAxisRenderer = categoryAxis.renderer;
        let categoryAxisLabel = categoryAxisRenderer.labels.template;
        categoryAxisLabel.location = 0.5;
        categoryAxisLabel.radius = 28;
        categoryAxisLabel.relativeRotation = 90;

        categoryAxisRenderer.fontSize = 11;
        categoryAxisRenderer.minGridDistance = 10;
        categoryAxisRenderer.grid.template.radius = -25;
        categoryAxisRenderer.grid.template.strokeOpacity = 0.05;
        categoryAxisRenderer.grid.template.interactionsEnabled = true;

        categoryAxisRenderer.ticks.template.disabled = true;
        categoryAxisRenderer.axisFills.template.disabled = true;
        categoryAxisRenderer.line.disabled = true;

        categoryAxisRenderer.tooltipLocation = 0.5;
        categoryAxis.tooltip.defaultState.properties.opacity = 0;

        // value axis
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis<any>());
        //   valueAxis.min = -3;
        //   valueAxis.max = 6;
        //   valueAxis.strictMinMax = true;
        valueAxis.tooltip.defaultState.properties.opacity = 0;
        valueAxis.tooltip.animationDuration = 0;
        valueAxis.cursorTooltipEnabled = true;
        valueAxis.zIndex = 10;

        let valueAxisRenderer = valueAxis.renderer;
        valueAxisRenderer.axisFills.template.disabled = true;
        valueAxisRenderer.ticks.template.disabled = true;
        valueAxisRenderer.minGridDistance = 20;
        valueAxisRenderer.grid.template.strokeOpacity = 0.05;
        valueAxis.renderer.labels.template.fillOpacity = 0; // hide label counts : 14-10-2019

        // series open tickets
        var series = chart.series.push(new am4charts.RadarColumnSeries());
        series.showOnInit = false; // hide animation onload
        series.columns.template.width = am4core.percent(90);
        series.columns.template.strokeOpacity = 0;
        series.dataFields.valueY = "close";
        series.dataFields.categoryX = "name";
        series.tooltipText = "Assignee: {categoryX}, close :{valueY.value}";
        series.columns.template.fill = am4core.color("#673AB7");

        // series close tickets
        var series1 = chart.series.push(new am4charts.RadarColumnSeries());
        series1.showOnInit = false; // hide animation onload
        series1.columns.template.width = am4core.percent(90);
        series1.columns.template.strokeOpacity = 0;
        series1.dataFields.valueY = "open";
        series1.dataFields.categoryX = "name";
        series1.name = "open";
        series1.columns.template.tooltipText = "{name}: Open {valueY.value}";
        series1.columns.template.fill = am4core.color("#F44336");

        // cursor
        let cursor = new am4charts.RadarCursor();
        chart.cursor = cursor;
        cursor.behavior = "zoomX";

        cursor.xAxis = categoryAxis;
        cursor.innerRadius = am4core.percent(40);
        cursor.lineY.disabled = true;

        // cursor.lineX.fillOpacity = 1; // 0.2;  // 14-10-2019

        cursor.lineX.fill = am4core.color("#000000");
        cursor.lineX.strokeOpacity = 0;
        cursor.fullWidthLineX = true;

        //   // year slider
        //   let yearSliderContainer = chart.createChild(am4core.Container);
        //   yearSliderContainer.layout = "vertical";
        //   yearSliderContainer.padding(0, 38, 0, 38);
        //   yearSliderContainer.width = am4core.percent(100);

        //   let yearSlider = yearSliderContainer.createChild(am4core.Slider);
        //   yearSlider.events.on("rangechanged", function () {
        //       updateRadarData(startYear + Math.round(yearSlider.start * (endYear - startYear)));
        //   })
        //   yearSlider.orientation = "horizontal";
        //   yearSlider.start = 0.5;
        //   yearSlider.exportable = false;

        chart.data = generateRadarData2();

        function generateRadarData2() {
            var data2 = [];
            var length = dataAss.length;
            for (var i = 0; i < length; i++) {
                let lengInt = dataAss[i].assignee.length;
                for (var j = 0; j < lengInt; j++) {
                    data2[data2.length] = dataAss[i].assignee[j];
                }
                createRange2(dataAss[i].agroup, dataAss[i].assignee, i);
            }

            //   alert(JSON.stringify(data2));
            return data2;
        }

        //   function updateRadarData(year) {
        //       if (currentYear != year) {
        //           currentYear = year;
        //           yearLabel.text = String(currentYear);
        //           series.dataFields.valueY = "value" + currentYear;
        //           chart.invalidateRawData();
        //       }
        //   }


        function createRange2(asgName, assigneeList, index) {

            let axisRange: any = categoryAxis.axisRanges.create();
            axisRange.axisFill.interactionsEnabled = true;
            axisRange.text = asgName;
            let first = assigneeList[0]['name'];
            let last = assigneeList[assigneeList.length - 1]['name'];
            axisRange.category = first;
            axisRange.endCategory = last;

            // every 3rd color for a bigger contrast
            axisRange.axisFill.fill = colorSet.getIndex(index * 3);
            axisRange.grid.disabled = true;
            axisRange.label.interactionsEnabled = false;
            axisRange.label.bent = true;

            let axisFill = axisRange.axisFill;
            axisFill.innerRadius = -0.001; // almost the same as 100%, we set it in pixels as later we animate this property to some pixel value
            axisFill.radius = -20; // negative radius means it is calculated from max radius
            axisFill.disabled = false; // as regular fills are disabled, we need to enable this one
            axisFill.fillOpacity = 1;
            axisFill.togglable = true;

            axisFill.showSystemTooltip = true;
            axisFill.readerTitle = "click to zoom";
            axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;

            axisFill.events.on("hit", function (event) {
                let dataItem = event.target.dataItem;
                if (!event.target.isActive) {
                    categoryAxis.zoom({ start: 0, end: 1 });
                }
                else {
                    categoryAxis.zoomToCategories(dataItem.category, dataItem.endCategory);
                }
            })

            // hover state
            let hoverState = axisFill.states.create("hover");
            hoverState.properties.innerRadius = -10;
            hoverState.properties.radius = -25;

            let axisLabel = axisRange.label;
            axisLabel.location = 0.5;
            axisLabel.fill = am4core.color("#ffffff");
            axisLabel.radius = 3;
            axisLabel.relativeRotation = 0;
        }


        //   let slider = yearSliderContainer.createChild(am4core.Slider);
        //   slider.start = 1;
        //   slider.exportable = false;
        //   slider.events.on("rangechanged", function () {
        //       let start = slider.start;

        //       chart.startAngle = 270 - start * 179 - 1;
        //       chart.endAngle = 270 + start * 179 + 1;

        //       valueAxis.renderer.axisAngle = chart.startAngle;
        //   })
    }

    ngOnDestroy() {
        // this.zone.runOutsideAngular(() => {
        if (this.chart) {
            this.chart.dispose();
        }
        // });
    }

}
