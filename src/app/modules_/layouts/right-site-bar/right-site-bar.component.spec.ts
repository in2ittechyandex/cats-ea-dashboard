import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSiteBarComponent } from './right-site-bar.component';

describe('RightSiteBarComponent', () => {
  let component: RightSiteBarComponent;
  let fixture: ComponentFixture<RightSiteBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSiteBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSiteBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
