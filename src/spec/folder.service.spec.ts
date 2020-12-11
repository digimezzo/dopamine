import * as assert from 'assert';
import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderModel } from '../app/services/folder/folder-model';
import { FolderServiceMocker } from './mocking/folder-service-mocker';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            await mocker.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mocker.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mocker.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mocker.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.never());
        });

        it('Should notify the user if a folder was already added', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mocker.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mocker.snackBarServiceMock.verify(x => x.folderAlreadyAddedAsync(), Times.exactly(1));
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

        it('Should delete a folderTrack from the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderToDelete: FolderModel = new FolderModel(folder);

            // Act
            mocker.folderService.deleteFolder(folderToDelete);

            // Assert
            mocker.folderTrackRepositoryMock.verify(x => x.deleteFolderTrackByFolderId(folderToDelete.folderId), Times.exactly(1));
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
});
