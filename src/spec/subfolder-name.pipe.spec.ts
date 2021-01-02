import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { SubfolderNamePipe } from '../app/pipes/subfolder-name.pipe';
import { SubfolderModel } from '../app/services/folder/subfolder-model';

describe('SubfolderNamePipe', () => {
    describe('transform', () => {
        it('Should return empty string if subfolder is undefined', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');
            const subfolderNamePipe: SubfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(undefined);

            // Assert
            assert.strictEqual(subfolderName, '');
        });

        it('Should return empty string if subfolder path is undefined', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');
            const subfolderNamePipe: SubfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);
            const subfolder: SubfolderModel = new SubfolderModel(undefined, false);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            assert.strictEqual(subfolderName, '');
        });

        it('Should return empty string if subfolder path is empty', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');
            const subfolderNamePipe: SubfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);
            const subfolder: SubfolderModel = new SubfolderModel('', false);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            assert.strictEqual(subfolderName, '');
        });

        it('Should return double dots .. if subfolder path is not empty and is a go to parent subfolder', () => {
            // Arrange
            const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            filesystemMock.setup(x => x.getDirectoryName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');
            const subfolderNamePipe: SubfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);
            const subfolder: SubfolderModel = new SubfolderModel('/home/User/Music/Subfolder1', true);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            assert.strictEqual(subfolderName, '..');
        });

        it('Should return the subfolder name of a subfolder path', () => {
           // Arrange
           const filesystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
           filesystemMock.setup(x => x.getDirectoryName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');
           const subfolderNamePipe: SubfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);
           const subfolder: SubfolderModel = new SubfolderModel('/home/User/Music/Subfolder1', false);

           // Act
           const subfolderName: string = subfolderNamePipe.transform(subfolder);

           // Assert
           assert.strictEqual(subfolderName, 'Subfolder1');
        });
    });
});
