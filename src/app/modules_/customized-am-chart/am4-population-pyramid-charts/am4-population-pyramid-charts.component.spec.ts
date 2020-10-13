import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4PopulationPyramidChartsComponent } from './am4-population-pyramid-charts.component';

describe('Am4PopulationPyramidChartsComponent', () => {
  let component: Am4PopulationPyramidChartsComponent;
  let fixture: ComponentFixture<Am4PopulationPyramidChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4PopulationPyramidChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4PopulationPyramidChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
