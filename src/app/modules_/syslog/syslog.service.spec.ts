import { TestBed } from '@angular/core/testing';

import { SyslogService } from './syslog.service';

describe('SyslogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyslogService = TestBed.get(SyslogService);
    expect(service).toBeTruthy();
  });
});
