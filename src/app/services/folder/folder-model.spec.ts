import * as assert from 'assert';
import { Folder } from '../../data/entities/folder';
import { FolderModel } from './folder-model';

describe('FolderModel', () => {
    let folder: Folder;
    let folderModel: FolderModel;

    beforeEach(() => {
        folder = new Folder('/home/user/Music');
        folder.folderId = 1;
        folder.showInCollection = 1;

        folderModel = new FolderModel(folder);
    });

    describe('constructor', () => {
        it('should create', async () => {
            // Arrange

            // Act
            const folderPath: string = folderModel.path;

            // Assert
            assert.ok(folderModel);
        });
    });

    describe('path', () => {
        it('should return folder path', async () => {
            // Arrange

            // Act
            const folderPath: string = folderModel.path;

            // Assert
            assert.strictEqual(folderPath, folder.path);
        });

        it('should return folderId', async () => {
            // Arrange

            // Act
            const folderId: number = folderModel.folderId;

            // Assert
            assert.strictEqual(folderId, folder.folderId);
        });

        describe('showInCollection', () => {
            it('should return true when folder showInCollection is 1', async () => {
                // Arrange

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, true);
            });

            it('should return false when folder showInCollection is 0', async () => {
                // Arrange
                folder.showInCollection = 0;

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, false);
            });

            it('should return false when folder showInCollection is undefined', async () => {
                // Arrange
                folder.showInCollection = undefined;

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                assert.strictEqual(showInCollection, false);
            });
        });
    });
});
