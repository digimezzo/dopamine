import { IMock, It, Mock, Times } from 'typemoq';
import { Hacks } from '../../../core/hacks';
import { BaseSettings } from '../../../core/settings/base-settings';
import { SettingsStub } from '../../../core/settings/settings-stub';
import { Folder } from '../../../data/entities/folder';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';
import { BaseTrackService } from '../../../services/track/base-track.service';
import { CollectionFoldersComponent } from './collection-folders.component';

describe('CollectionFoldersComponent', () => {
    let settingsMock: BaseSettings;
    let folderServiceMock: IMock<BaseFolderService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let trackServiceMock: IMock<BaseTrackService>;
    let hacksMock: IMock<Hacks>;

    let component: CollectionFoldersComponent;

    beforeEach(() => {
        settingsMock = new SettingsStub();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        trackServiceMock = Mock.ofType<BaseTrackService>();
        hacksMock = Mock.ofType<Hacks>();

        settingsMock.foldersLeftPaneWithPercent = 30;

        component = new CollectionFoldersComponent(
            settingsMock,
            folderServiceMock.object,
            navigationServiceMock.object,
            trackServiceMock.object,
            hacksMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should set area1 size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.area1Size).toEqual(30);
        });

        it('should set area2 size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.area2Size).toEqual(70);
        });

        it('should define folders', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.folders).toBeDefined();
        });

        it('should define subfolders', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.subfolders).toBeDefined();
        });

        it('should define subfolderBreadCrumbs', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.subfolderBreadCrumbs).toBeDefined();
        });

        it('should define tracks', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.tracks).toBeDefined();
        });
    });

    describe('dragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange
            settingsMock.foldersLeftPaneWithPercent = 45;

            // Act
            component.dragEnd({ sizes: [30, 70] });

            // Assert
            expect(settingsMock.foldersLeftPaneWithPercent).toEqual(30);
        });
    });

    describe('getFoldersAsync', () => {
        it('should get the folders', async () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);

            // Act
            await component.getFoldersAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('onInit', () => {
        it('should get the folders', async () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder]);

            // Act
            component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should set the selected folder to the first folder if it is undefined', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedFolder).toEqual(folder1);
        });

        it('should not set the selected folder if it is not undefined', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            component.selectedFolder = folder2;

            // Act
            component.ngOnInit();

            // Assert
            expect(component.selectedFolder).toEqual(folder2);
        });
    });

    describe('goToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            component.selectedFolder = folder2;

            // Act
            component.goToManageCollection();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToManageCollection(), Times.exactly(1));
        });
    });

    describe('setSelectedFolder', () => {
        it('should set the selected folder', async () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/home/User/Music'));
            const folder2: FolderModel = new FolderModel(new Folder('/home/User/Downloads'));
            folderServiceMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            component.selectedFolder = folder2;

            // Act
            await component.setSelectedFolderAsync(folder1);

            // Assert
            expect(component.selectedFolder).toEqual(folder1);
        });

        it('should get subfolders for an undefined subfolder', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = folder;

            // Act
            await component.setSelectedFolderAsync(folder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), undefined), Times.exactly(1));
        });
    });

    describe('getSubfoldersAsync', () => {
        it('should not get subfolders if the selected folder is undefined', async () => {
            // Arrange
            component.selectedFolder = undefined;

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should get subfolders for the given selected subfolder if the selected folder is not undefined', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const selectedSubfolder: SubfolderModel = new SubfolderModel('/home/user/Music/Subfolder1', false);
            component.selectedFolder = folder;

            // Act
            await component.getSubfoldersAsync(selectedSubfolder);

            // Assert
            folderServiceMock.verify((x) => x.getSubfoldersAsync(folder, selectedSubfolder), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are no subfolders', async () => {
            // Arrange
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the selected folder if there are subfolders but none is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, selectedFolder.path), Times.exactly(1));
        });

        it('should get breadcrumbs for the first go to parent subfolder if there are subfolders and at least one is go to parent', async () => {
            // Arrange
            const subfolder1: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            const subfolder2: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder2', true);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => [subfolder1, subfolder2]);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            // Act
            await component.getSubfoldersAsync(undefined);

            // Assert
            folderServiceMock.verify((x) => x.getSubfolderBreadCrumbsAsync(selectedFolder, subfolder2.path), Times.exactly(1));
        });

        it('should get tracks for the given subfolder', async () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('/home/user/Music/subfolder1', false);
            folderServiceMock.setup((x) => x.getSubfoldersAsync(It.isAny(), It.isAny())).returns(async () => []);

            const selectedFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            component.selectedFolder = selectedFolder;
            component.subfolders = [];

            // Act
            await component.getSubfoldersAsync(subfolder);

            // Assert
            trackServiceMock.verify((x) => x.getTracksInSubfolderAsync(subfolder), Times.exactly(1));
        });
    });
});
