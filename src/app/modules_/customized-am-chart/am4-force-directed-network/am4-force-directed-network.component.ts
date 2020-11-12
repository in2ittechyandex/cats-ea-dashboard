import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'cats-am4-force-directed-network',
  templateUrl: './am4-force-directed-network.component.html',
  styleUrls: ['./am4-force-directed-network.component.css']
})
export class Am4ForceDirectedNetworkComponent {
  private chart: am4plugins_forceDirected.ForceDirectedTree;

  // @Input('chartUniqueId') chartUniqueId;
  // @Input() chartType;
  @Input('dataProvider') dataProvider;
  // @Input() chartTitleName;
  // @Input() heightPixel;
  // @Input() widthPer;

  // @Input() reportSequence;
  // @Input() reportId;
  // @Input() theme;
  @Output() nodeClicked = new EventEmitter();
  constructor() {Am4ForceDirectedNetworkComponent.myObj=this; }
static myObj;
  ngAfterViewInit() {
    if (this.dataProvider.length > 0) {
      this.buildChart();
    }
  }

  buildChart() {
    let chart = am4core.create('ForceDirectedTreeHome1', am4plugins_forceDirected.ForceDirectedTree);
    chart.logo.hidden = true; // hide amchart4 icon
    chart.logo.disabled = true;
    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.dataFields.color = "color";

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.linkWithStrength = 0;

    let nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}";
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;

    let linkTemplate = networkSeries.links.template;
    linkTemplate.strokeWidth = 1;
    let linkHoverState = linkTemplate.states.create("hover");
    linkHoverState.properties.strokeOpacity = 1;
    linkHoverState.properties.strokeWidth = 2;

    nodeTemplate.events.on("over", function (event) {
      let dataItem = event.target.dataItem;
      dataItem.childLinks.each(function (link) {
        link.isHover = true;
      })
    })

    nodeTemplate.events.on("out", function (event) {
      let dataItem = event.target.dataItem;
      dataItem.childLinks.each(function (link) {
        link.isHover = false;
      })
    })
    nodeTemplate.events.on("hit", function (event) {
      let dataItem = event.target.dataItem;
      console.log("node click"+dataItem['name']);
      // dataItem.childLinks.each(function (link) {
      //   link.isHover = true;
      // })
      Am4ForceDirectedNetworkComponent.myObj.nodeClicked.emit(dataItem['name']);
    })
    networkSeries.data = this.dataProvider;
  }

}
