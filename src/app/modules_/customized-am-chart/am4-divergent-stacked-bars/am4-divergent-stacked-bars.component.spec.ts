import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4DivergentStackedBarsComponent } from './am4-divergent-stacked-bars.component';

describe('Am4DivergentStackedBarsComponent', () => {
  let component: Am4DivergentStackedBarsComponent;
  let fixture: ComponentFixture<Am4DivergentStackedBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4DivergentStackedBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4DivergentStackedBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
