import { TestBed } from '@angular/core/testing';

import { AppearanceService } from './appearance.service';
import { Settings } from '../../core/settings';
import { SettingsStub } from '../../core/settingsStub';
import { Logger } from '../../core/logger';
import { LoggerStub } from '../../core/loggerStub';

describe('AppearanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Settings, useClass: SettingsStub },
      { provide: Logger, useClass: LoggerStub }
    ]
  }));

  it('should be created', () => {
    const service: AppearanceService = TestBed.get(AppearanceService);
    expect(service).toBeTruthy();
  });
});
