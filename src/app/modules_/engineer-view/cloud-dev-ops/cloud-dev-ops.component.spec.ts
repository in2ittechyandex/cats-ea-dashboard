import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudDevOpsComponent } from './cloud-dev-ops.component';

describe('CloudDevOpsComponent', () => {
  let component: CloudDevOpsComponent;
  let fixture: ComponentFixture<CloudDevOpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudDevOpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudDevOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
