import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AppearanceSettingsComponent } from './appearance-settings.component';

describe('AppearanceSettingsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsMock: IMock<BaseSettings>;
    let componentWithInjection: AppearanceSettingsComponent;

    let component: AppearanceSettingsComponent;
    let fixture: ComponentFixture<AppearanceSettingsComponent>;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        settingsMock = Mock.ofType<BaseSettings>();

        appearanceServiceMock.setup((x) => x.fontSizes).returns(() => []);
        translatorServiceMock.setup((x) => x.languages).returns(() => []);

        componentWithInjection = new AppearanceSettingsComponent(
            appearanceServiceMock.object,
            translatorServiceMock.object,
            settingsMock.object
        );
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AppearanceSettingsComponent],
            providers: [
                { provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object },
                { provide: BaseTranslatorService, useFactory: () => translatorServiceMock.object },
                { provide: BaseSettings, useFactory: () => settingsMock.object },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppearanceSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
