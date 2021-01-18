import assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;

    let component: MainMenuComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();

        component = new MainMenuComponent(navigationServiceMock.object);
    });

    it('should create', () => {
        // Arrange

        // Act

        // Assert
        assert.ok(component);
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', () => {
            // Arrange

            // Act
            component.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('should navigate to settings', () => {
            // Arrange

            // Act
            component.goToSettings();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToSettings(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('should navigate to information', () => {
            // Arrange

            // Act
            component.goToInformation();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToInformation(), Times.exactly(1));
        });
    });
});
