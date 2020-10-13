import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4StackHorizontalbarChartsComponent } from './am4-stack-horizontalbar-charts.component';

describe('Am4StackHorizontalbarChartsComponent', () => {
  let component: Am4StackHorizontalbarChartsComponent;
  let fixture: ComponentFixture<Am4StackHorizontalbarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4StackHorizontalbarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4StackHorizontalbarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
