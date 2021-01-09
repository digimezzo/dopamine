import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { AppearanceSettingsComponent } from '../app/components/settings/appearance-settings/appearance-settings.component';
import { BaseSettings } from '../app/core/settings/base-settings';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../app/services/translator/base-translator.service';

describe('AppearanceSettingsComponent', () => {
    describe('constructor', () => {
        it('Should set appearanceService', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();

            // Act
            const appearanceSettingsComponent: AppearanceSettingsComponent = new AppearanceSettingsComponent(
                appearanceServiceMock.object,
                translatorServiceMock.object,
                settingsMock.object
            );

            // Assert
            assert.ok(appearanceSettingsComponent.appearanceService != undefined);
        });

        it('Should set translatorService', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();

            // Act
            const appearanceSettingsComponent: AppearanceSettingsComponent = new AppearanceSettingsComponent(
                appearanceServiceMock.object,
                translatorServiceMock.object,
                settingsMock.object
            );

            // Assert
            assert.ok(appearanceSettingsComponent.translatorService != undefined);
        });

        it('Should set settings', () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();

            // Act
            const appearanceSettingsComponent: AppearanceSettingsComponent = new AppearanceSettingsComponent(
                appearanceServiceMock.object,
                translatorServiceMock.object,
                settingsMock.object
            );

            // Assert
            assert.ok(appearanceSettingsComponent.settings != undefined);
        });
    });
});
