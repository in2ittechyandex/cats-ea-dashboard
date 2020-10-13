import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickCalenderComponent } from './tick-calender.component';

describe('TickCalenderComponent', () => {
  let component: TickCalenderComponent;
  let fixture: ComponentFixture<TickCalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TickCalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
