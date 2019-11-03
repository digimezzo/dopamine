import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { ElectronService } from './services/electron.service';
import { Logger } from './core/logger';
import { LoggerStub } from './core/loggerStub';
import { TranslatorService } from './services/translator/translator.service';
import { TranslatorServiceStub } from './services/translator/translatorServiceStub';
import { SettingsStub } from './core/settingsStub';
import { Settings } from './core/settings';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        ElectronService,
        { provide: Settings, useClass: SettingsStub },
        { provide: Logger, useClass: LoggerStub },
        { provide: TranslatorService, useClass: TranslatorServiceStub }
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

class TranslateServiceStub {
  setDefaultLang(lang: string): void {
  }
}
