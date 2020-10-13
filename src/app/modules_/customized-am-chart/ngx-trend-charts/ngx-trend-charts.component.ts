import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cats-ngx-trend-charts',
  templateUrl: './ngx-trend-charts.component.html',
  styleUrls: ['./ngx-trend-charts.component.css']
})
export class NgxTrendChartsComponent implements OnInit {


  @Input() height ='35';
  @Input() data = [0,300,11,700,220,13,9,650,2,450,7,1,11];
  @Input() gradient = '#ff5b57';
  @Input() strokeWidth ='3';
  @Input() autoDrawDuration = 1000;

  constructor() { }

  ngOnInit() {
  }

}
