import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSendSmsComponent } from './view-send-sms.component';

describe('ViewSendSmsComponent', () => {
  let component: ViewSendSmsComponent;
  let fixture: ComponentFixture<ViewSendSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSendSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSendSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
