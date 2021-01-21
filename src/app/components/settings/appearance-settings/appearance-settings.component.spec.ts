import { IMock, Mock } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AppearanceSettingsComponent } from './appearance-settings.component';

describe('AppearanceSettingsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsMock: IMock<BaseSettings>;

    let component: AppearanceSettingsComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        settingsMock = Mock.ofType<BaseSettings>();

        component = new AppearanceSettingsComponent(appearanceServiceMock.object, translatorServiceMock.object, settingsMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeTruthy();
        });

        it('should set appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeTruthy();
        });

        it('should set translatorService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.translatorService).toBeTruthy();
        });

        it('should set settings', () => {
            // Arrange

            // Act

            // Assert
            expect(component.settings).toBeTruthy();
        });
    });
});
