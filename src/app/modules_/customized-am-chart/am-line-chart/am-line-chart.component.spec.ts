import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmLineChartComponent } from './am-line-chart.component';

describe('AmLineChartComponent', () => {
  let component: AmLineChartComponent;
  let fixture: ComponentFixture<AmLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
