import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmGaugeMeterChartComponent } from './am-gauge-meter-chart.component';

describe('AmGaugeMeterChartComponent', () => {
  let component: AmGaugeMeterChartComponent;
  let fixture: ComponentFixture<AmGaugeMeterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmGaugeMeterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmGaugeMeterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
