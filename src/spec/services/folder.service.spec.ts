import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { FolderRepository } from '../../app/data/entities/folder-repository';
import { FolderService } from '../../app/services/folder/folder.service';
import { Logger } from '../../app/core/logger';
import { Folder } from '../../app/data/entities/folder';
import { SnackbarServiceBase as SnackBarServiceBase } from '../../app/services/snack-bar/snack-bar-service-base';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const snackBarServiceMock = TypeMoq.Mock.ofType<SnackBarServiceBase>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolderAsync('/home/me/Music')).returns(async () => null);

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const snackBarServiceMock = TypeMoq.Mock.ofType<SnackBarServiceBase>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolderAsync('/home/me/Music')).returns(async () => new Folder('/home/me/Music'));

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolderAsync('/home/me/Music'), Times.never());
        });

        it('Should notify the user if a folder was already added', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const snackBarServiceMock = TypeMoq.Mock.ofType<SnackBarServiceBase>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            folderRepositoryMock.setup(x => x.getFolderAsync('/home/me/Music')).returns(async () => new Folder('/home/me/Music'));

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            snackBarServiceMock.verify(x => x.notifyFolderAlreadyAddedAsync(), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const snackBarServiceMock = TypeMoq.Mock.ofType<SnackBarServiceBase>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            // Act
            await folderService.getFoldersAsync();

            // Assert
            folderRepositoryMock.verify(x => x.getFoldersAsync(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should delete a folder from the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const snackBarServiceMock = TypeMoq.Mock.ofType<SnackBarServiceBase>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object,
                snackBarServiceMock.object);

            const folderToDelete: Folder = new Folder('/home/user/Music');

            // Act
            await folderService.deleteFolderAsync(folderToDelete);

            // Assert
            folderRepositoryMock.verify(x => x.deleteFolderAsync('/home/user/Music'), Times.exactly(1));
        });
    });
});
