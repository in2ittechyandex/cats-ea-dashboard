import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmMsbar3dChartComponent } from './am-msbar3d-chart.component';

describe('AmMsbar3dChartComponent', () => {
  let component: AmMsbar3dChartComponent;
  let fixture: ComponentFixture<AmMsbar3dChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmMsbar3dChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmMsbar3dChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
