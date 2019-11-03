import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { AppearanceService } from '../../services/appearance/appearance.service';
import { AppearanceServiceStub } from '../../services/appearance/appearanceServiceStub';
import { TranslatorService } from '../../services/translator/translator.service';
import { TranslatorServiceStub } from '../../services/translator/translatorServiceStub';
import { Settings } from '../../core/settings';
import { SettingsStub } from '../../core/settingsStub';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoFullComponent } from '../logo-full/logo-full.component';
import { MatStepperModule, MatFormFieldModule, MatSlideToggleModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { ColorThemeSwitcherComponent } from '../color-theme-switcher/color-theme-switcher.component';
import { StepIndicatorComponent } from '../step-indicator/step-indicator.component';
import { WindowControlsComponent } from '../window-controls/window-controls.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        WelcomeComponent, ColorThemeSwitcherComponent, StepIndicatorComponent, WindowControlsComponent, LogoFullComponent
      ],
      providers: [
        { provide: AppearanceService, useClass: AppearanceServiceStub },
        { provide: TranslatorService, useClass: TranslatorServiceStub },
        { provide: Settings, useClass: SettingsStub }
      ],
      imports: [
        RouterTestingModule, MatStepperModule, MatFormFieldModule, MatSlideToggleModule, MatSelectModule, FormsModule, MatTooltipModule, BrowserAnimationsModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
