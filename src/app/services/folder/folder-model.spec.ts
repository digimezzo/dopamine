import { Folder } from '../../common/data/entities/folder';
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
        it('should create', () => {
            // Arrange, Act, Assert
            expect(folderModel).toBeDefined();
        });
    });

    describe('path', () => {
        it('should return folder path', () => {
            // Arrange, Act
            const folderPath: string = folderModel.path;

            // Assert
            expect(folderPath).toEqual(folder.path);
        });

        it('should return folderId', () => {
            // Arrange, Act
            const folderId: number = folderModel.folderId;

            // Assert
            expect(folderId).toEqual(folder.folderId);
        });

        describe('showInCollection', () => {
            it('should return true when folder showInCollection is 1', () => {
                // Arrange, Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                expect(showInCollection).toBeTruthy();
            });

            it('should return false when folder showInCollection is 0', () => {
                // Arrange
                folder.showInCollection = 0;

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                expect(showInCollection).toBeFalsy();
            });

            it('should return false when folder showInCollection is undefined', () => {
                // Arrange
                folder.showInCollection = undefined;

                // Act
                const showInCollection: boolean = folderModel.showInCollection;

                // Assert
                expect(showInCollection).toBeFalsy();
            });
        });
    });
});
