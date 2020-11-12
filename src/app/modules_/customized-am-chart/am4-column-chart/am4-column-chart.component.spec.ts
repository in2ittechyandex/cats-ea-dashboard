import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4ColumnChartComponent } from './am4-column-chart.component';

describe('Am4ColumnChartComponent', () => {
  let component: Am4ColumnChartComponent;
  let fixture: ComponentFixture<Am4ColumnChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4ColumnChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4ColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
