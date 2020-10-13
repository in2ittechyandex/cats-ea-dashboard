import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmHeatChartComponent } from './am-heat-chart.component';

describe('AmHeatChartComponent', () => {
  let component: AmHeatChartComponent;
  let fixture: ComponentFixture<AmHeatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmHeatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmHeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
