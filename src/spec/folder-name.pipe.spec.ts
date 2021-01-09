import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { Folder } from '../app/data/entities/folder';
import { FolderNamePipe } from '../app/pipes/folder-name.pipe';
import { FolderModel } from '../app/services/folder/folder-model';

describe('FolderNamePipe', () => {
    describe('transform', () => {
        it('Should return empty string if folder is undefined', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup((x) => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);

            // Act
            const folderName: string = directoryNamePipe.transform(undefined);

            // Assert
            assert.strictEqual(folderName, '');
        });

        it('Should return empty string if folder path is undefined', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup((x) => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);
            const folder: FolderModel = new FolderModel(new Folder(undefined));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            assert.strictEqual(folderName, '');
        });

        it('Should return empty string if folder path is empty', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup((x) => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);
            const folder: FolderModel = new FolderModel(new Folder(''));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            assert.strictEqual(folderName, '');
        });

        it('Should return the folder name of a folder path', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup((x) => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            assert.strictEqual(folderName, 'Music');
        });
    });
});
