import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConferencingComponent } from './video-conferencing.component';

describe('VideoConferencingComponent', () => {
  let component: VideoConferencingComponent;
  let fixture: ComponentFixture<VideoConferencingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoConferencingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConferencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
