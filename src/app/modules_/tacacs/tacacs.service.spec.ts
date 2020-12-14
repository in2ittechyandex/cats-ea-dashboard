import { TestBed } from '@angular/core/testing';

import { TacacsService } from './tacacs.service';

describe('TacacsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TacacsService = TestBed.get(TacacsService);
    expect(service).toBeTruthy();
  });
});
