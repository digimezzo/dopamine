import * as assert from 'assert';
import { IMock, It, Mock, Times } from 'typemoq';
import { CollectionFoldersComponent } from '../app/components/collection/collection-folders/collection-folders.component';
import { Hacks } from '../app/core/hacks';
import { BaseSettings } from '../app/core/settings/base-settings';
import { Folder } from '../app/data/entities/folder';
import { BaseFolderService } from '../app/services/folder/base-folder.service';
import { FolderModel } from '../app/services/folder/folder-model';
import { SubfolderModel } from '../app/services/folder/subfolder-model';
import { BaseNavigationService } from '../app/services/navigation/base-navigation.service';
import { SettingsStub } from './mocking/settings-stub';

describe('CollectionFoldersComponent', () => {
    describe('constructor', () => {
        it('should set area1 size from settings', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area1Size, 30);
        });

        it('should set area2 size from settings', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Assert
            assert.strictEqual(collectionFoldersComponent.area2Size, 70);
        });

        it('should define and instantiate the folders collection', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Assert
            assert.ok(collectionFoldersComponent.folders);
        });

        it('should define and instantiate the subfolders collection', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Assert
            assert.ok(collectionFoldersComponent.subfolders);
        });

        it('should define and instantiate the subfolderBreadCrumbs collection', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsMock.setup((x) => x.foldersLeftPaneWithPercent).returns(() => 30);

            // Act
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsMock.object,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Assert
            assert.ok(collectionFoldersComponent.subfolderBreadCrumbs);
        });
    });

    describe('dragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Act
            collectionFoldersComponent.dragEnd({ sizes: [30, 70] });

            // Assert
            assert.strictEqual(settingsStub.foldersLeftPaneWithPercent, 30);
        });
    });

    describe('getFoldersAsync', () => {
        it('should get the folders', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Act
            await collectionFoldersComponent.getFoldersAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('onInit', () => {
        it('should get the folders', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should set the selected folder to the first folder if it is undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            // Act
            await collectionFoldersComponent.ngOnInit();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder1);
        });

        it('should not set the selected folder if it is not undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            collectionFoldersComponent.ngOnInit();

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder2);
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            collectionFoldersComponent.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setSelectedFolder', () => {
        it('should set the selected folder', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            settingsStub.foldersLeftPaneWithPercent = 45;
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );
            collectionFoldersComponent.selectedFolder = folder2;

            // Act
            await collectionFoldersComponent.setSelectedFolderAsync(folder1);

            // Assert
            assert.strictEqual(collectionFoldersComponent.selectedFolder, folder1);
        });

        it('should get subfolders for an undefined subfolder', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            collectionFoldersComponent.selectedFolder = folder;

            // Act
            await collectionFoldersComponent.setSelectedFolderAsync(folder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), undefined), Times.exactly(1));
        });
    });

    describe('getSubfoldersAsync', () => {
        it('should not get subfolders if the selected folder is undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );
            collectionFoldersComponent.selectedFolder = undefined;

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get subfolders for the given selected subfolder if the selected folder is not undefined', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const selectedSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            collectionFoldersComponent.selectedFolder = folder;

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(selectedSubfolder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder, selectedSubfolder), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are no subfolders', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            collectionFoldersComponent.selectedFolder = selectedFolder;
            collectionFoldersComponent.subfolders = [];

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            collectionFoldersComponent.selectedFolder = selectedFolder;
            collectionFoldersComponent.subfolders = [];

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const settingsStub: SettingsStub = new SettingsStub(false, false, false);
            const folderServiceMock: IMock<BaseFolderService> = Mock.ofType<BaseFolderService>();
            const navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
            const hacksMock: IMock<Hacks> = Mock.ofType<Hacks>();
            const collectionFoldersComponent: CollectionFoldersComponent = new CollectionFoldersComponent(
                settingsStub,
                folderServiceMock.object,
                navigationServiceMock.object,
                hacksMock.object
            );

            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            collectionFoldersComponent.selectedFolder = selectedFolder;
            collectionFoldersComponent.subfolders = [];

            // Act
            await collectionFoldersComponent.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, subfolder2.path), Times.exactly(1));
        });
    });
});
