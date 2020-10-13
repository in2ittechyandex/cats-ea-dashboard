import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4BarsWithMovingBulletsComponent } from './am4-bars-with-moving-bullets.component';

describe('Am4BarsWithMovingBulletsComponent', () => {
  let component: Am4BarsWithMovingBulletsComponent;
  let fixture: ComponentFixture<Am4BarsWithMovingBulletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4BarsWithMovingBulletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4BarsWithMovingBulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
