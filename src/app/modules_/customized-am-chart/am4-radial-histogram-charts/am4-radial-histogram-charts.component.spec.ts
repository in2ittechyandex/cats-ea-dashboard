import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4RadialHistogramChartsComponent } from './am4-radial-histogram-charts.component';

describe('Am4RadialHistogramChartsComponent', () => {
  let component: Am4RadialHistogramChartsComponent;
  let fixture: ComponentFixture<Am4RadialHistogramChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4RadialHistogramChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4RadialHistogramChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
