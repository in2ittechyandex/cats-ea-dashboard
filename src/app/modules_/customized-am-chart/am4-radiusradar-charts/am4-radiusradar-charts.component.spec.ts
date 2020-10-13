import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4RadiusradarChartsComponent } from './am4-radiusradar-charts.component';

describe('Am4RadiusradarChartsComponent', () => {
  let component: Am4RadiusradarChartsComponent;
  let fixture: ComponentFixture<Am4RadiusradarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4RadiusradarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4RadiusradarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
