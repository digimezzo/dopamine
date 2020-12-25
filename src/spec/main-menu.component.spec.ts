import { Router } from '@angular/router';
import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { MainMenuComponent } from '../app/components/main-menu/main-menu.component';
import { BaseFolderService } from '../app/services/folder/base-folder.service';

describe('MainMenuComponent', () => {
    describe('constructor', () => {
        it('Should set router', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();

            // Act
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                routerMock.object,
                folderServiceMock.object);

            // Assert
            assert.ok(mainMenuComponent.router != undefined);
        });
    });

    describe('goToManageCollection', () => {
        it('Should navigate to settings', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                routerMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToManageCollection();

            // Assert
            routerMock.verify(x => x.navigate(['/managecollection']), Times.exactly(1));
        });

        it('Should reset folder changes', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                routerMock.object,
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
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                routerMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToSettings();

            // Assert
            routerMock.verify(x => x.navigate(['/settings']), Times.exactly(1));
        });
    });

    describe('goToInformation', () => {
        it('Should navigate to information', () => {
            // Arrange
            const routerMock: IMock<Router> = Mock.ofType<Router>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const mainMenuComponent: MainMenuComponent = new MainMenuComponent(
                routerMock.object,
                folderServiceMock.object);

            // Act
            mainMenuComponent.goToInformation();

            // Assert
            routerMock.verify(x => x.navigate(['/information']), Times.exactly(1));
        });
    });
});
