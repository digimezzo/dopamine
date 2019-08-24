import { TestBed } from '@angular/core/testing';

import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslatorService = TestBed.get(TranslatorService);
    expect(service).toBeTruthy();
  });
});
