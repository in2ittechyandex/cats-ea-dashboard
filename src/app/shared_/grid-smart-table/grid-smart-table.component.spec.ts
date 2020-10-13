import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSmartTableComponent } from './grid-smart-table.component';

describe('GridSmartTableComponent', () => {
  let component: GridSmartTableComponent;
  let fixture: ComponentFixture<GridSmartTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSmartTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
