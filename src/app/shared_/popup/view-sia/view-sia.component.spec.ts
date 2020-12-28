import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSiaComponent } from './view-sia.component';

describe('ViewSiaComponent', () => {
  let component: ViewSiaComponent;
  let fixture: ComponentFixture<ViewSiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
