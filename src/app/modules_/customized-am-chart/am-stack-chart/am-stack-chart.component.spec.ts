import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmStackChartComponent } from './am-stack-chart.component';

describe('AmStackChartComponent', () => {
  let component: AmStackChartComponent;
  let fixture: ComponentFixture<AmStackChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmStackChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmStackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
