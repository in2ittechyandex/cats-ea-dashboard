import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4DonutChartComponent } from './am4-donut-chart.component';

describe('Am4DonutChartComponent', () => {
  let component: Am4DonutChartComponent;
  let fixture: ComponentFixture<Am4DonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4DonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4DonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
