import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4MicroChartsSparklinesComponent } from './am4-micro-charts-sparklines.component';

describe('Am4MicroChartsSparklinesComponent', () => {
  let component: Am4MicroChartsSparklinesComponent;
  let fixture: ComponentFixture<Am4MicroChartsSparklinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4MicroChartsSparklinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4MicroChartsSparklinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
