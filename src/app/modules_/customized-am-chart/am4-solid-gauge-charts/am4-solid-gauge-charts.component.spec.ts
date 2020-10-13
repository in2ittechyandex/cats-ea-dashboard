import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4SolidGaugeChartsComponent } from './am4-solid-gauge-charts.component';

describe('Am4SolidGaugeChartsComponent', () => {
  let component: Am4SolidGaugeChartsComponent;
  let fixture: ComponentFixture<Am4SolidGaugeChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4SolidGaugeChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4SolidGaugeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
