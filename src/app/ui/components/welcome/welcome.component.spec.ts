import { IMock, Mock, Times } from 'typemoq';
import { WelcomeComponent } from './welcome.component';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';

describe('WelcomeComponent', () => {
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let translatorService: IMock<TranslatorServiceBase>;
    let appearanceService: IMock<AppearanceServiceBase>;
    let settings: IMock<SettingsBase>;

    let component: WelcomeComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        translatorService = Mock.ofType<TranslatorServiceBase>();
        appearanceService = Mock.ofType<AppearanceServiceBase>();
        settings = Mock.ofType<SettingsBase>();

        component = new WelcomeComponent(navigationServiceMock.object, translatorService.object, appearanceService.object, settings.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should start at page 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.currentPage).toEqual(0);
        });

        it('should have 7 pages', () => {
            // Arrange

            // Act

            // Assert
            expect(component.totalPages).toEqual(7);
        });

        it('Cannot go back', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canGoBack).toBeFalsy();
        });

        it('Can go forward', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canGoForward).toBeTruthy();
        });

        it('Cannot finish', () => {
            // Arrange

            // Act

            // Assert
            expect(component.canFinish).toBeFalsy();
        });

        it('should provide correct donate url', () => {
            // Arrange

            // Act

            // Assert
            expect(component.donateUrl).toEqual('https://digimezzo.github.io/site/donate');
        });
    });

    describe('finish', () => {
        it('should navigate to loading component', async () => {
            // Arrange

            // Act
            await component.finishAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoadingAsync(), Times.exactly(1));
        });
    });
});
