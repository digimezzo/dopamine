import { TestBed } from '@angular/core/testing';

import { TranslatorService } from './translator.service';
import { Settings } from '../../core/settings';
import { SettingsStub } from '../../core/settingsStub';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('TranslatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TranslatorService,
      { provide: Settings, useClass: SettingsStub }
    ],
    imports: [
      TranslateModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: TranslatorService = TestBed.get(TranslatorService);
    expect(service).toBeTruthy();
  });
});
