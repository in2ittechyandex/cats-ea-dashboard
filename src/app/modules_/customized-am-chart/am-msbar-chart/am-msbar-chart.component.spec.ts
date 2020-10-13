import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmMsbarChartComponent } from './am-msbar-chart.component';

describe('AmMsbarChartComponent', () => {
  let component: AmMsbarChartComponent;
  let fixture: ComponentFixture<AmMsbarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmMsbarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmMsbarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
