import * as assert from 'assert';
import { IMock, It, Mock, Times } from 'typemoq';
import { CollectionFoldersComponent } from '../app/components/collection/collection-folders/collection-folders.component';
import { BaseSettings } from '../app/core/settings/base-settings';
import { Folder } from '../app/data/entities/folder';
import { BaseFolderService } from '../app/services/folder/base-folder.service';
import { FolderModel } from '../app/services/folder/folder-model';
import { SubfolderModel } from '../app/services/folder/subfolder-model';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';
import { SettingsStub } from './mocking/settings-stub';

describe('CollectionFoldersComponent', () => {
    describe('constructor', () => {
        it('Should set area1 size from settings', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area1Size, 30);
        });

        it('Should set area2 size from settings', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area2Size, 70);
        });

        it('Should define and instantiate the folders collection', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
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
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
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

    describe('getFoldersAsync', () => {
        it('Should get the folders', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            await collectionFoldersComponent.getFoldersAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('onInit', () => {
        it('Should get the folders', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('Should set the selected folder to the first folder if it is undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            // Act
            await collectionFoldersComponent.ngOnInit();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder1);
        });

        it('Should not set the selected folder if it is not undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder2);
        });
    });

    describe('goToManageCollection', () => {
        it('Should navigate to manage collection', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            collectionFoldersComponent.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setSelectedFolder', () => {
        it('Should set the selected folder', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            await collectionFoldersComponent.setSelectedFolderAsync(folder1);

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder1);
        });

        it('Should get subfolders for an undefined subfolder', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            collectionFoldersComponent.selectedFolder = folder;

            // Act
            await collectionFoldersComponent.setSelectedFolderAsync(folder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), undefined), Times.exactly(1));
        });
    });

    describe('getSubfoldersAsync', () => {
        it('Should not get subfolders if the selected folder is undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            collectionFoldersComponent.selectedFolder = undefined;

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(It.isAny());

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should get subfolders for the given active subfolder if the selected folder is not undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );

            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const activeSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            collectionFoldersComponent.selectedFolder = folder;

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(activeSubfolder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder, activeSubfolder), Times.exactly(1));
        });
    });

    describe('setSelectedSubfolder', () => {
        it('Should set the selected subfolder', () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object
            );
            const subfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            collectionFoldersComponent.selectedSubfolder = undefined;

            // Act
            collectionFoldersComponent.setSelectedSubfolder(subfolder);

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedSubfolder, subfolder);
        });
    });
});
