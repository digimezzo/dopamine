import { IMock, Mock, Times } from 'typemoq';
import { MainMenuComponent } from '../app/components/main-menu/main-menu.component';
import { BaseFolderService } from '../app/services/folder/base-folder.service';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';

describe('MainMenuComponent', () => {
    describe('goToManageCollection', () => {
        it('Should navigate to manage collection', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                navigationServiceMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToManageCollection();

            // Assert
            navigationServiceMock.verify(x => x.navigateToManageCollection(), Times.exactly(1));
        });

        it('Should reset folder changes', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                navigationServiceMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToManageCollection();

            // Assert
            folderServiceMock.verify(x => x.resetFolderChanges(), Times.exactly(1));
        });
    });

    describe('goToSettings', () => {
        it('Should navigate to settings', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                navigationServiceMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToSettings();

            // Assert
            navigationServiceMock.verify(x => x.navigateToSettings(), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('Should navigate to information', () => {
            // Arrange
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                navigationServiceMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToInformation();

            // Assert
            navigationServiceMock.verify(x => x.navigateToInformation(), Times.exactly(1));
        });
    });
});
