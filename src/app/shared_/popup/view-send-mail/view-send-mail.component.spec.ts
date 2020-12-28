import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSendMailComponent } from './view-send-mail.component';

describe('ViewSendMailComponent', () => {
  let component: ViewSendMailComponent;
  let fixture: ComponentFixture<ViewSendMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSendMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSendMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
