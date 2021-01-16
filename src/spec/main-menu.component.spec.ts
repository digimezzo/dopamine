import { IMock, Mock, Times } from 'typemoq';
import { MainMenuComponent } from '../app/components/main-menu/main-menu.component';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';

describe('MainMenuComponent', () => {
    describe('goToManageCollection', () => {
        it('should navigate to manage collection', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(navigationServiceMock.object);

            // Act
            mainMenuComponent.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('should navigate to settings', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(navigationServiceMock.object);

            // Act
            mainMenuComponent.goToSettings();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToSettings(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('should navigate to information', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(navigationServiceMock.object);

            // Act
            mainMenuComponent.goToInformation();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToInformation(), Times.exactly(1));
        });
    });
});
