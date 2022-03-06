import { IMock, Mock } from 'typemoq';
import { BaseFileSystem } from '../common/io/base-file-system';
import { SubfolderModel } from '../services/folder/subfolder-model';
import { SubfolderNamePipe } from './subfolder-name.pipe';

describe('SubfolderNamePipe', () => {
    let filesystemMock: IMock<BaseFileSystem> = Mock.ofType<BaseFileSystem>();
    let subfolderNamePipe: SubfolderNamePipe;

    beforeEach(() => {
        filesystemMock = Mock.ofType<BaseFileSystem>();
        filesystemMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music/Subfolder1')).returns(() => 'Subfolder1');

        subfolderNamePipe = new SubfolderNamePipe(filesystemMock.object);
    });

    describe('transform', () => {
        it('should return empty string if subfolder is undefined', () => {
            // Arrange

            // Act
            const subfolderName: string = subfolderNamePipe.transform(undefined);

            // Assert
            expect(subfolderName).toEqual('');
        });

        it('should return empty string if subfolder path is undefined', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel(undefined, false);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            expect(subfolderName).toEqual('');
        });

        it('should return empty string if subfolder path is empty', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('', false);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            expect(subfolderName).toEqual('');
        });

        it('should return double dots .. if subfolder path is not empty and is a go to parent subfolder', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('/home/User/Music/Subfolder1', true);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            expect(subfolderName).toEqual('..');
        });

        it('should return the subfolder name of a subfolder path', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('/home/User/Music/Subfolder1', false);

            // Act
            const subfolderName: string = subfolderNamePipe.transform(subfolder);

            // Assert
            expect(subfolderName).toEqual('Subfolder1');
        });
    });
});
