import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmTabularChartComponent } from './am-tabular-chart.component';

describe('AmTabularChartComponent', () => {
  let component: AmTabularChartComponent;
  let fixture: ComponentFixture<AmTabularChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmTabularChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmTabularChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
