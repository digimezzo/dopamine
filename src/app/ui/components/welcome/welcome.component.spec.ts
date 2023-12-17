import { IMock, Mock, Times } from 'typemoq';
import { WelcomeComponent } from './welcome.component';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { WelcomeServiceBase } from '../../../services/welcome/welcome.service.base';

describe('WelcomeComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let welcomeServiceMock: IMock<WelcomeServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;

    let component: WelcomeComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        welcomeServiceMock = Mock.ofType<WelcomeServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();

        component = new WelcomeComponent(appearanceServiceMock.object, welcomeServiceMock.object, navigationServiceMock.object);
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
    });

    describe('finish', () => {
        it('should navigate to loading component', async () => {
            // Arrange

            // Act
            await component.finishAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoadingAsync(), Times.once());
        });
    });
});
