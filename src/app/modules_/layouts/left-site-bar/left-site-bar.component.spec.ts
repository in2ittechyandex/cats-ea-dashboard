import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSiteBarComponent } from './left-site-bar.component';

describe('LeftSiteBarComponent', () => {
  let component: LeftSiteBarComponent;
  let fixture: ComponentFixture<LeftSiteBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSiteBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSiteBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
