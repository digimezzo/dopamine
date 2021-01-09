import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from '../app/app.component';
import { Logger } from '../app/core/logger';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';
import { BaseTranslatorService } from '../app/services/translator/base-translator.service';

describe('AppComponent', () => {
    describe('constructor', () => {
        it('Should apply theme', async () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            // Act
            const appComponent: AppComponent = new AppComponent(
                navigationServiceMock.object,
                appearanceServiceMock.object,
                translatorServiceMock.object,
                loggerMock.object
            );

            // Assert
            appearanceServiceMock.verify((x) => x.applyTheme(), Times.exactly(1));
        });

        it('Should apply font size', async () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            // Act
            const appComponent: AppComponent = new AppComponent(
                navigationServiceMock.object,
                appearanceServiceMock.object,
                translatorServiceMock.object,
                loggerMock.object
            );

            // Assert
            appearanceServiceMock.verify((x) => x.applyFontSize(), Times.exactly(1));
        });

        it('Should apply language', async () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            // Act
            const appComponent: AppComponent = new AppComponent(
                navigationServiceMock.object,
                appearanceServiceMock.object,
                translatorServiceMock.object,
                loggerMock.object
            );

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguage(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('Should navigate to loading', async () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const appComponent: AppComponent = new AppComponent(
                navigationServiceMock.object,
                appearanceServiceMock.object,
                translatorServiceMock.object,
                loggerMock.object
            );

            // Act
            appComponent.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.exactly(1));
        });
    });
});
