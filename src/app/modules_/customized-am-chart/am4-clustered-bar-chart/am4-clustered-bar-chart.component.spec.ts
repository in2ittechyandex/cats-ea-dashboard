import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4ClusteredBarChartComponent } from './am4-clustered-bar-chart.component';

describe('Am4ClusteredBarChartComponent', () => {
  let component: Am4ClusteredBarChartComponent;
  let fixture: ComponentFixture<Am4ClusteredBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4ClusteredBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4ClusteredBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
