import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsComponent } from './tacacs.component';

describe('TacacsComponent', () => {
  let component: TacacsComponent;
  let fixture: ComponentFixture<TacacsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TacacsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
