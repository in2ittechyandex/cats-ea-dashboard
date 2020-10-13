import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4StackedXy3dchartComponent } from './am4-stacked-xy3dchart.component';

describe('Am4StackedXy3dchartComponent', () => {
  let component: Am4StackedXy3dchartComponent;
  let fixture: ComponentFixture<Am4StackedXy3dchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4StackedXy3dchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4StackedXy3dchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
