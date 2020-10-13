import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmBarChartComponent } from './am-bar-chart.component';

describe('AmBarChartComponent', () => {
  let component: AmBarChartComponent;
  let fixture: ComponentFixture<AmBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
