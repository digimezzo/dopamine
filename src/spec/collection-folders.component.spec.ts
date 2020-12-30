import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { CollectionFoldersComponent } from '../app/components/collection/collection-folders/collection-folders.component';
import { Logger } from '../app/core/logger';
import { BaseSettings } from '../app/core/settings/base-settings';
import { Folder } from '../app/data/entities/folder';
import { BaseFolderService } from '../app/services/folder/base-folder.service';
import { FolderModel } from '../app/services/folder/folder-model';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';
import { SettingsStub } from './mocking/settings-stub';

describe('CollectionFoldersComponent', () => {
    describe('constructor', () => {
        it('Should set area1 size from settings', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup(x => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area1Size, 30);
        });

        it('Should set area2 size from settings', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup(x => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area2Size, 70);
        });

        it('Should define and instantiate the folders collection', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup(x => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Assert
            assert.ok(collectionFoldersComponent.folders);
        });
    });

    describe('dragEnd', () => {
        it('Should save the left pane width to the settings', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.dragEnd({ sizes: [30, 70] });

            // Assert
            assert.strictEqual(settingsStub.foldersLeftPaneWithPercent, 30);
        });
    });

    describe('getFolders', () => {
        it('Should get the folders', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: Folder = new Folder('/home/User/Music');
            const folderModel: FolderModel = new FolderModel(folder);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.getFolders();

            // Assert
            folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should set the selected folder if it is undefined', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: Folder = new Folder('/home/User/Music');
            const folderModel: FolderModel = new FolderModel(folder);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.getFolders();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folderModel);
        });

        it('Should set the selected folder if it is undefined', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: Folder = new Folder('/home/User/Music');
            const folderModel1: FolderModel = new FolderModel(folder1);
            const folder2: Folder = new Folder('/home/User/Music');
            const folderModel2: FolderModel = new FolderModel(folder2);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel1, folderModel2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folderModel2;

            // Act
            collectionFoldersComponent.getFolders();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folderModel2);
        });
    });

    describe('onInit', () => {
        it('Should get the folders', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: Folder = new Folder('/home/User/Music');
            const folderModel: FolderModel = new FolderModel(folder);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should set the selected folder if it is undefined', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: Folder = new Folder('/home/User/Music');
            const folderModel: FolderModel = new FolderModel(folder);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.getFolders();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folderModel);
        });

        it('Should set the selected folder if it is undefined', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: Folder = new Folder('/home/User/Music');
            const folderModel1: FolderModel = new FolderModel(folder1);
            const folder2: Folder = new Folder('/home/User/Music');
            const folderModel2: FolderModel = new FolderModel(folder2);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel1, folderModel2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folderModel2;

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folderModel2);
        });
    });

    describe('goToManageCollection', () => {
        it('Should navigate to manage collection', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: Folder = new Folder('/home/User/Music');
            const folderModel1: FolderModel = new FolderModel(folder1);
            const folder2: Folder = new Folder('/home/User/Music');
            const folderModel2: FolderModel = new FolderModel(folder2);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel1, folderModel2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folderModel2;

            // Act
            collectionFoldersComponent.goToManageCollection();

            // Assert
            navigationServiceMock.verify(x => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setSelectedFolder', () => {
        it('Should set the selected folder', async () => {
            // Arrange
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: Folder = new Folder('/home/User/Music');
            const folderModel1: FolderModel = new FolderModel(folder1);
            const folder2: Folder = new Folder('/home/User/Music');
            const folderModel2: FolderModel = new FolderModel(folder2);
            folderServiceMock.setup(x => x.getFolders()).returns(() => [folderModel1, folderModel2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                loggerMock.object,
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folderModel2;

            // Act
            collectionFoldersComponent.setSelectedFolder(folderModel1);

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folderModel1);
        });
    });
});
