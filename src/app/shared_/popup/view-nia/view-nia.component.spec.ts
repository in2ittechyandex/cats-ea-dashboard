import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNiaComponent } from './view-nia.component';

describe('ViewNiaComponent', () => {
  let component: ViewNiaComponent;
  let fixture: ComponentFixture<ViewNiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
