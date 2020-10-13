import { TestBed, async, inject } from '@angular/core/testing';

import { CustomPermissionGuard } from './custom-permission.guard';

describe('CustomPermissionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomPermissionGuard]
    });
  });

  it('should ...', inject([CustomPermissionGuard], (guard: CustomPermissionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
