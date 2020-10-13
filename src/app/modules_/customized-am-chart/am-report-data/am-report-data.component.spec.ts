import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmReportDataComponent } from './am-report-data.component';

describe('AmReportDataComponent', () => {
  let component: AmReportDataComponent;
  let fixture: ComponentFixture<AmReportDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmReportDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmReportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
