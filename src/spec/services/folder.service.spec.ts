import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { FolderRepository } from '../../app/data/entities/folder-repository';
import { FolderService } from '../../app/services/folder/folder.service';
import { Logger } from '../../app/core/logger';
import { Folder } from '../../app/data/entities/folder';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a new folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object);

            folderRepositoryMock.setup(x => x.getFolderAsync('/home/me/Music')).returns(async () => null);

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const loggerMock = TypeMoq.Mock.ofType<Logger>();
            const folderService: FolderService = new FolderService(
                folderRepositoryMock.object,
                loggerMock.object);

            folderRepositoryMock.setup(x => x.getFolderAsync('/home/me/Music')).returns(async () => new Folder('/home/me/Music'));

            // Act
            await folderService.addNewFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolderAsync('/home/me/Music'), Times.never());
        });
    });
});
