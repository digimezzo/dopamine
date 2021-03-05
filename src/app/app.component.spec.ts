import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from './app.component';
import { Logger } from './core/logger';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';

describe('AppComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let loggerMock: IMock<Logger>;
    let app: AppComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        loggerMock = Mock.ofType<Logger>();

        app = new AppComponent(navigationServiceMock.object, appearanceServiceMock.object, translatorServiceMock.object, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(app).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should apply theme', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyTheme(), Times.exactly(1));
        });

        it('should apply font size', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyFontSize(), Times.exactly(1));
        });

        it('should apply language', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguageAsync(), Times.exactly(1));
        });
        it('should navigate to loading', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.exactly(1));
        });
    });
});
