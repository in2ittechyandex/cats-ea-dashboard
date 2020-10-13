import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAreaChartComponent } from './am-area-chart.component';

describe('AmAreaChartComponent', () => {
  let component: AmAreaChartComponent;
  let fixture: ComponentFixture<AmAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
