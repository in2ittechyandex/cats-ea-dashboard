import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerViewComponent } from './engineer-view.component';

describe('EngineerViewComponent', () => {
  let component: EngineerViewComponent;
  let fixture: ComponentFixture<EngineerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
