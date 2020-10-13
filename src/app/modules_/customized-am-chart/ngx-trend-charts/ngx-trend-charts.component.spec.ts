import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTrendChartsComponent } from './ngx-trend-charts.component';

describe('NgxTrendChartsComponent', () => {
  let component: NgxTrendChartsComponent;
  let fixture: ComponentFixture<NgxTrendChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTrendChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTrendChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
