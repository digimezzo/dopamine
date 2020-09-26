import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderServiceMocker } from './mocking/folder-service-mocker';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            mocker.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => null);

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
            mocker.snackBarServiceMock.verify(x => x.notifyFolderAlreadyAddedAsync(), Times.exactly(1));
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
    });

    describe('deleteFolderAsync', () => {
        it('Should delete a folder from the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folderToDelete: Folder = new Folder('/home/user/Music');
            folderToDelete.folderId = 1;

            // Act
            mocker.folderService.deleteFolder(folderToDelete);

            // Assert
            mocker.folderRepositoryMock.verify(x => x.deleteFolder(folderToDelete.folderId), Times.exactly(1));
        });

        it('Should delete a folderTrack from the database', () => {
            // Arrange
            const mocker: FolderServiceMocker = new FolderServiceMocker();

            const folderToDelete: Folder = new Folder('/home/user/Music');
            folderToDelete.folderId = 1;

            // Act
            mocker.folderService.deleteFolder(folderToDelete);

            // Assert
            mocker.folderTrackRepositoryMock.verify(x => x.deleteFolderTrackByFolderId(folderToDelete.folderId), Times.exactly(1));
        });
    });
});
