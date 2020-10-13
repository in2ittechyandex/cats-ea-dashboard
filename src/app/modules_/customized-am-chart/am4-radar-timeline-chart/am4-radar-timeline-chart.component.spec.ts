import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4RadarTimelineChartComponent } from './am4-radar-timeline-chart.component';

describe('Am4RadarTimelineChartComponent', () => {
  let component: Am4RadarTimelineChartComponent;
  let fixture: ComponentFixture<Am4RadarTimelineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4RadarTimelineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4RadarTimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
