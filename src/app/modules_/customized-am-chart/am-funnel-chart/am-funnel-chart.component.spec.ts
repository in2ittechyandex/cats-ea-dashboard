import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFunnelChartComponent } from './am-funnel-chart.component';

describe('AmFunnelChartComponent', () => {
  let component: AmFunnelChartComponent;
  let fixture: ComponentFixture<AmFunnelChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmFunnelChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
