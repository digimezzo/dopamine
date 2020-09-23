import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderServiceMock } from './mocking/folder-service-mock';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            mock.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => null);

            // Act
            await mock.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mock.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            mock.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mock.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mock.folderRepositoryMock.verify(x => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.never());
        });

        it('Should notify the user if a folder was already added', async () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            mock.folderRepositoryMock.setup(x => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await mock.folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            mock.snackBarServiceMock.verify(x => x.notifyFolderAlreadyAddedAsync(), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            // Act
            mock.folderService.getFolders();

            // Assert
            mock.folderRepositoryMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should delete a folder from the database', () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');
            folderToDelete.folderId = 1;

            // Act
            mock.folderService.deleteFolder(folderToDelete);

            // Assert
            mock.folderRepositoryMock.verify(x => x.deleteFolder(folderToDelete.folderId), Times.exactly(1));
        });

        it('Should delete a folderTrack from the database', () => {
            // Arrange
            const mock: FolderServiceMock = new FolderServiceMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');
            folderToDelete.folderId = 1;

            // Act
            mock.folderService.deleteFolder(folderToDelete);

            // Assert
            mock.folderTrackRepositoryMock.verify(x => x.deleteFolderTrackByFolderId(folderToDelete.folderId), Times.exactly(1));
        });
    });
});
