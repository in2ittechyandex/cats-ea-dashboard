import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4DumbbellPlotChartsComponent } from './am4-dumbbell-plot-charts.component';

describe('Am4DumbbellPlotChartsComponent', () => {
  let component: Am4DumbbellPlotChartsComponent;
  let fixture: ComponentFixture<Am4DumbbellPlotChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4DumbbellPlotChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4DumbbellPlotChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
