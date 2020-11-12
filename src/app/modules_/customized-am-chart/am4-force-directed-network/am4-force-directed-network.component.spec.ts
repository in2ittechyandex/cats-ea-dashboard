import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Am4ForceDirectedNetworkComponent } from './am4-force-directed-network.component';

describe('Am4ForceDirectedNetworkComponent', () => {
  let component: Am4ForceDirectedNetworkComponent;
  let fixture: ComponentFixture<Am4ForceDirectedNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Am4ForceDirectedNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Am4ForceDirectedNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
