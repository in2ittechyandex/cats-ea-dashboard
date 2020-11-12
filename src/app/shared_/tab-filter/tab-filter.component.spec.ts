import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFilterComponent } from './tab-filter.component';

describe('TabFilterComponent', () => {
  let component: TabFilterComponent;
  let fixture: ComponentFixture<TabFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
