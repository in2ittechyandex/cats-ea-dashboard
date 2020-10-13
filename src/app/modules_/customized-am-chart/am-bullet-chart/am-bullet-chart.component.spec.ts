import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmBulletChartComponent } from './am-bullet-chart.component';

describe('AmBulletChartComponent', () => {
  let component: AmBulletChartComponent;
  let fixture: ComponentFixture<AmBulletChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmBulletChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmBulletChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
