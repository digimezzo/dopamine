import { TestBed } from '@angular/core/testing';

import { AppearanceService } from './appearance.service';

describe('AppearanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppearanceService = TestBed.get(AppearanceService);
    expect(service).toBeTruthy();
  });
});
