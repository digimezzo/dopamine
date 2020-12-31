import * as assert from 'assert';
import { Subscription } from 'rxjs';
import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderModel } from '../app/services/folder/folder-model';
import { SubfolderModel } from '../app/services/folder/subfolder-model';
import { FolderServiceMocker } from './mocking/folder-service-mocker';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            await mocker.folderService.addFolderAsync('/home/me/Music');

            // Assert
            mocker.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mocker.folderService.addFolderAsync('/home/me/Music');

            // Assert
            mocker.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.never());
        });

        it('Should notify the user if a folder was already added', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mocker.folderService.addFolderAsync('/home/me/Music');

            // Assert
            mocker.snackBarServiceMock.verify(x => x.folderAlreadyAddedAsync(), Times.exactly(1));
        });

        it('Should notify that folders have changed when a folder is added', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = mocker.folderService.foldersChanged$.subscribe(() => { foldersHaveChanged = true; });
            await mocker.folderService.addFolderAsync('/home/me/Music');
            subscription.unsubscribe();

            // Assert
            assert.strictEqual(foldersHaveChanged, true);
        });

        it('Should not notify that folders have changed when a folder is not added', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = mocker.folderService.foldersChanged$.subscribe(() => { foldersHaveChanged = true; });
            await mocker.folderService.addFolderAsync('/home/me/Music');
            subscription.unsubscribe();

            // Assert
            assert.strictEqual(foldersHaveChanged, false);
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            // Act
            mocker.folderService.getFolders();

            // Assert
            mocker.folderRepositoryMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should return an empty collection when database folders are undefined', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            mocker.folderRepositoryMock.setup(x => x.getFolders()).returns(() => undefined);

            // Act
            const folders: FolderModel[] = mocker.folderService.getFolders();

            // Assert
            assert.strictEqual(folders.length, 0);
        });

        it('Should return an empty collection when database folders are empty', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            mocker.folderRepositoryMock.setup(x => x.getFolders()).returns(() => []);

            // Act
            const folders: FolderModel[] = mocker.folderService.getFolders();

            // Assert
            assert.strictEqual(folders.length, 0);
        });

        it('Should return a collection of folderModels for each folder found in the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const databaseFolder1: Folder = new Folder('One');
            databaseFolder1.folderId = 1;
            const databaseFolder2: Folder = new Folder('Two');
            databaseFolder2.folderId = 2;
            mocker.folderRepositoryMock.setup(x => x.getFolders()).returns(() => [databaseFolder1, databaseFolder2]);

            // Act
            const folders: FolderModel[] = mocker.folderService.getFolders();

            // Assert
            assert.strictEqual(folders.length, 2);
            assert.strictEqual(folders[0].folderId, 1);
            assert.strictEqual(folders[0].path, 'One');
            assert.strictEqual(folders[1].folderId, 2);
            assert.strictEqual(folders[1].path, 'Two');
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should delete a folder from the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderToDelete: FolderModel = new FolderModel(folder);

            // Act
            mocker.folderService.deleteFolder(folderToDelete);

            // Assert
            mocker.folderRepositoryMock.verify(x => x.deleteFolder(folderToDelete.folderId), Times.exactly(1));
        });

        it('Should notify that folders have changed when deleting a folder', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderToDelete: FolderModel = new FolderModel(folder);

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = mocker.folderService.foldersChanged$.subscribe(() => { foldersHaveChanged = true; });
            mocker.folderService.deleteFolder(folderToDelete);
            subscription.unsubscribe();

            // Assert
            assert.strictEqual(foldersHaveChanged, true);
        });
    });

    describe('setFolderVisibility', () => {
        it('Should set folder visibility in the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderModel: FolderModel = new FolderModel(folder);
            folderModel.showInCollection = true;

            // Act
            mocker.folderService.setFolderVisibility(folderModel);

            // Assert
            mocker.folderRepositoryMock.verify(x => x.setFolderShowInCollection(1, 1), Times.exactly(1));
        });
    });

    describe('setAllFoldersVisible', () => {
        it('Should set visibility of all folders in the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            // Act
            mocker.folderService.setAllFoldersVisible();

            // Assert
            mocker.folderRepositoryMock.verify(x => x.setAllFoldersShowInCollection(1), Times.exactly(1));
        });
    });

    describe('getSubfolders', () => {
        it('Should return no subfolders, given no root folder.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(undefined, undefined);

            // Assert
            assert.strictEqual(subfolders.length, 0);
        });

        it('Should return no subfolders, given a root folder but no subfolder, and the root folder path does not exist.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            mocker.fileSystemMock.setup(x => x.pathExists(rootFolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            assert.strictEqual(subfolders.length, 0);
        });

        it('Should return the subfolders of the root folder, given a root folder but no subfolder, and the root folder path exists.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const rootFolderDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            mocker.fileSystemMock.setup(x => x.pathExists(rootFolderPath)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.getDirectoriesInDirectoryAsync(rootFolderPath)).returns(async () => rootFolderDirectories);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            assert.strictEqual(subfolders.length, 3);
            assert.strictEqual(subfolders[0].path, 'Root child 1');
            assert.strictEqual(subfolders[1].path, 'Root child 2');
            assert.strictEqual(subfolders[2].path, 'Root child 3');
        });

        it('Should return no subfolders, given a root folder and a subfolder, and the subfolder path does not exist.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            mocker.fileSystemMock.setup(x => x.pathExists(subfolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 0);
        });

        it('Should return subfolders of the subfolder, given a root folder and a subfolder which is the root folder.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            mocker.fileSystemMock.setup(x => x.pathExists(subfolderPath)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 3);
            assert.strictEqual(subfolders[0].path, 'Root child 1');
            assert.strictEqual(subfolders[1].path, 'Root child 2');
            assert.strictEqual(subfolders[2].path, 'Root child 3');
        });

        it('Should return a go to parent subfolder and subfolders of the sub folder, given a root folder and a subfolder which is not the root folder.', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            mocker.fileSystemMock.setup(x => x.pathExists(subfolderPath)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 4);
            assert.strictEqual(subfolders[0].path, '/home/user/Music/Sub1');
            assert.strictEqual(subfolders[0].isGoToParent, true);
            assert.strictEqual(subfolders[1].path, 'Root child 1');
            assert.strictEqual(subfolders[2].path, 'Root child 2');
            assert.strictEqual(subfolders[3].path, 'Root child 3');
        });

        it('Should return the subfolders of the parent folder, given a go to parent subfolder', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1/Sub2';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, true);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            mocker.fileSystemMock.setup(x => x.pathExists(subfolderPath)).returns(() => true);
            mocker.fileSystemMock.setup(x => x.getDirectoryPath(subfolderPath)).returns(() => '/home/user/Music/Sub1');
            mocker.fileSystemMock.setup(x => x.getDirectoriesInDirectoryAsync('/home/user/Music/Sub1')).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await mocker.folderService.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 4);
            assert.strictEqual(subfolders[0].path, '/home/user/Music/Sub1');
            assert.strictEqual(subfolders[0].isGoToParent, true);
            assert.strictEqual(subfolders[1].path, 'Root child 1');
            assert.strictEqual(subfolders[2].path, 'Root child 2');
            assert.strictEqual(subfolders[3].path, 'Root child 3');
        });
    });
});
