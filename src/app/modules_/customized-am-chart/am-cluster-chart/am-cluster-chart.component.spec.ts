import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmClusterChartComponent } from './am-cluster-chart.component';

describe('AmClusterChartComponent', () => {
  let component: AmClusterChartComponent;
  let fixture: ComponentFixture<AmClusterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmClusterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmClusterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
