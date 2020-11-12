import { TestBed } from '@angular/core/testing';

import { CustomExcelService } from './custom-excel.service';

describe('CustomExcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomExcelService = TestBed.get(CustomExcelService);
    expect(service).toBeTruthy();
  });
});
