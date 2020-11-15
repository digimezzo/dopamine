import * as assert from 'assert';
import { Folder } from '../app/data/entities/folder';
import { FolderModel } from '../app/services/folder/folder-model';

describe('FolderModel', () => {
    describe('path', () => {
        it('Should return folder path', async () => {
            // Arrange
            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            folder.showInCollection = 1;

            const folderModel: FolderModel = new FolderModel(folder);

            // Act
            const folderPath: string = folderModel.path;

            // Assert
            assert.strictEqual(folderPath, folder.path);
        });

        it('Should return folderId', async () => {
            // Arrange
            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            folder.showInCollection = 1;

            const folderModel: FolderModel = new FolderModel(folder);

            // Act
            const folderId: number = folderModel.folderId;

            // Assert
            assert.strictEqual(folderId, folder.folderId);
        });

        describe('showInCollection', () => {
            it('Should return true when folder showInCollection is 1', async () => {
                // Arrange
                const folder: Folder = new Folder('/home/user/Music');
                folder.folderId = 1;
                folder.showInCollection = 1;

                const folderModel: FolderModel = new FolderModel(folder);

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, true);
            });

            it('Should return false when folder showInCollection is 0', async () => {
                // Arrange
                const folder: Folder = new Folder('/home/user/Music');
                folder.folderId = 1;
                folder.showInCollection = 0;

                const folderModel: FolderModel = new FolderModel(folder);

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, false);
            });

            it('Should return false when folder showInCollection is undefined', async () => {
                // Arrange
                const folder: Folder = new Folder('/home/user/Music');
                folder.folderId = 1;
                folder.showInCollection = undefined;

                const folderModel: FolderModel = new FolderModel(folder);

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, false);
            });
        });
    });
});
