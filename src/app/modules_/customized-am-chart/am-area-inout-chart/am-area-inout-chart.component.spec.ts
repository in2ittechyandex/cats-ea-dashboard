import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAreaInoutChartComponent } from './am-area-inout-chart.component';

describe('AmAreaInoutChartComponent', () => {
  let component: AmAreaInoutChartComponent;
  let fixture: ComponentFixture<AmAreaInoutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmAreaInoutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAreaInoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
