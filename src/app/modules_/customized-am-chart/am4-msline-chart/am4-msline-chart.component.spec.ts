import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4MslineChartComponent } from './am4-msline-chart.component';

describe('Am4MslineChartComponent', () => {
  let component: Am4MslineChartComponent;
  let fixture: ComponentFixture<Am4MslineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4MslineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4MslineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
