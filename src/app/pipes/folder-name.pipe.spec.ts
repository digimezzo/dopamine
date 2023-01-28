import { IMock, Mock } from 'typemoq';
import { Folder } from '../common/data/entities/folder';
import { BaseFileAccess } from '../common/io/base-file-access';
import { FolderModel } from '../services/folder/folder-model';
import { FolderNamePipe } from './folder-name.pipe';

describe('FolderNamePipe', () => {
    describe('transform', () => {
        it('should return empty string if folder is undefined', () => {
            // Arrange
            const fileAccessMock: IMock<BaseFileAccess> = Mock.ofType<BaseFileAccess>();
            fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(fileAccessMock.object);

            // Act
            const folderName: string = directoryNamePipe.transform(undefined);

            // Assert
            expect(folderName).toEqual('');
        });

        it('should return empty string if folder path is undefined', () => {
            // Arrange
            const fileAccessMock: IMock<BaseFileAccess> = Mock.ofType<BaseFileAccess>();
            fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(fileAccessMock.object);
            const folder: FolderModel = new FolderModel(new Folder(undefined));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            expect(folderName).toEqual('');
        });

        it('should return empty string if folder path is empty', () => {
            // Arrange
            const fileAccessMock: IMock<BaseFileAccess> = Mock.ofType<BaseFileAccess>();
            fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(fileAccessMock.object);
            const folder: FolderModel = new FolderModel(new Folder(''));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            expect(folderName).toEqual('');
        });

        it('should return the folder name of a folder path', () => {
            // Arrange
            const fileAccessMock: IMock<BaseFileAccess> = Mock.ofType<BaseFileAccess>();
            fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(fileAccessMock.object);
            const folder: FolderModel = new FolderModel(new Folder('/home/User/Music'));

            // Act
            const folderName: string = directoryNamePipe.transform(folder);

            // Assert
            expect(folderName).toEqual('Music');
        });
    });
});
