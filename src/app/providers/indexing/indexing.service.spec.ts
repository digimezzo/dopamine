import { TestBed } from '@angular/core/testing';

import { IndexingService } from './indexing.service';

describe('IndexingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexingService = TestBed.get(IndexingService);
    expect(service).toBeTruthy();
  });
});
