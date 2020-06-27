import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times } from 'typemoq';
import { FolderServiceBase } from '../../app/services/folder/folder-service-base';
import { FolderRepository } from '../../app/data/entities/folder-repository';
import { FolderService } from '../../app/services/folder/folder.service';

describe('FolderService', () => {
    describe('addFolderAsync', () => {
        it('Should add a folder with the selected path to the database', async () => {
            // Arrange
            const folderRepositoryMock = TypeMoq.Mock.ofType<FolderRepository>();
            const folderService: FolderService = new FolderService(folderRepositoryMock.object);

            // Act
            await folderService.addFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(x => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
       });
    });
});
