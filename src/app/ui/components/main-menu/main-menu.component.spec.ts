import { IMock, Mock, Times } from 'typemoq';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let updateServiceMock: IMock<BaseUpdateService>;

    let component: MainMenuComponent;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        updateServiceMock = Mock.ofType<BaseUpdateService>();

        component = new MainMenuComponent(navigationServiceMock.object, updateServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define updateService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.updateService).toBeDefined();
        });
    });

    describe('applicationName', () => {
        it('should provide correct application name', () => {
            // Arrange

            // Act

            // Assert
            expect(component.applicationName).toEqual('Dopamine');
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange

            // Act
            await component.goToManageCollectionAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollectionAsync(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('should navigate to settings', async () => {
            // Arrange

            // Act
            await component.goToSettingsAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToSettingsAsync(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('should navigate to information', async () => {
            // Arrange

            // Act
            await component.goToInformationAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToInformationAsync(), Times.exactly(1));
        });
    });

    describe('downloadLatestRelease', () => {
        it('should download the latest release', async () => {
            // Arrange

            // Act
            await component.downloadLatestReleaseAsync();

            // Assert
            updateServiceMock.verify((x) => x.downloadLatestReleaseAsync(), Times.exactly(1));
        });
    });
});
