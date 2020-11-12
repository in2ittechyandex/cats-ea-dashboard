import { TestBed } from '@angular/core/testing';

import { CommonExcelServiceService } from './common-excel-service.service';

describe('CommonExcelServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonExcelServiceService = TestBed.get(CommonExcelServiceService);
    expect(service).toBeTruthy();
  });
});
