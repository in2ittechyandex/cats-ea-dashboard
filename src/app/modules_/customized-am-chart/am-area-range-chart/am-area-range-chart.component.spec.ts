import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAreaRangeChartComponent } from './am-area-range-chart.component';

describe('AmAreaRangeChartComponent', () => {
  let component: AmAreaRangeChartComponent;
  let fixture: ComponentFixture<AmAreaRangeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmAreaRangeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAreaRangeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
