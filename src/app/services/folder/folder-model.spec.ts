import * as assert from 'assert';
import { Folder } from '../../data/entities/folder';
import { FolderModel } from './folder-model';

describe('FolderModel', () => {
    describe('path', () => {
        it('should return folder path', async () => {
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

        it('should return folderId', async () => {
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
            it('should return true when folder showInCollection is 1', async () => {
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

            it('should return false when folder showInCollection is 0', async () => {
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

            it('should return false when folder showInCollection is undefined', async () => {
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
