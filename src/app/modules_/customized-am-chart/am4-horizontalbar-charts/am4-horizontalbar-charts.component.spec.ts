import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4HorizontalbarChartsComponent } from './am4-horizontalbar-charts.component';

describe('Am4HorizontalbarChartsComponent', () => {
  let component: Am4HorizontalbarChartsComponent;
  let fixture: ComponentFixture<Am4HorizontalbarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4HorizontalbarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4HorizontalbarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
