import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { FolderNamePipe } from '../app/pipes/folder-name.pipe';

describe('DirectoryNamePipe', () => {
    describe('transform', () => {
        it('Should return empty string if directoryPath is undefined', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);

            // Act
            const directoryName: string = directoryNamePipe.transform(undefined);

            // Assert
            assert.strictEqual(directoryName, '');
        });

        it('Should return empty string if directoryPath is empty', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);

            // Act
            const directoryName: string = directoryNamePipe.transform('');

            // Assert
            assert.strictEqual(directoryName, '');
        });

        it('Should return the bottom directory name of a directory path', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(filesystemMock.object);

            // Act
            const directoryName: string = directoryNamePipe.transform('/home/User/Music');

            // Assert
            assert.strictEqual(directoryName, 'Music');
        });
    });
});
