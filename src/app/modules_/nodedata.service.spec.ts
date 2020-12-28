import { TestBed } from '@angular/core/testing';

import { NodedataService } from './nodedata.service';

describe('NodedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodedataService = TestBed.get(NodedataService);
    expect(service).toBeTruthy();
  });
});
