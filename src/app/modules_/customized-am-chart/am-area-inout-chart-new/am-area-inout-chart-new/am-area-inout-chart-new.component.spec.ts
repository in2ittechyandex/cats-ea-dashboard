import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAreaInoutChartNewComponent } from './am-area-inout-chart-new.component';

describe('AmAreaInoutChartNewComponent', () => {
  let component: AmAreaInoutChartNewComponent;
  let fixture: ComponentFixture<AmAreaInoutChartNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmAreaInoutChartNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAreaInoutChartNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
