import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmPerformaceInOutChartComponent } from './am-performace-in-out-chart.component';

describe('AmPerformaceInOutChartComponent', () => {
  let component: AmPerformaceInOutChartComponent;
  let fixture: ComponentFixture<AmPerformaceInOutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmPerformaceInOutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmPerformaceInOutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
