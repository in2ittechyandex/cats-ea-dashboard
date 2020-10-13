import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmPieChartComponent } from './am-pie-chart.component';

describe('AmPieChartComponent', () => {
  let component: AmPieChartComponent;
  let fixture: ComponentFixture<AmPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
