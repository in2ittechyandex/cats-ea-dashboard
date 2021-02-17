import { TestBed } from '@angular/core/testing';

import { VideoConferencingService } from './video-conferencing.service';

describe('VideoConferencingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoConferencingService = TestBed.get(VideoConferencingService);
    expect(service).toBeTruthy();
  });
});
