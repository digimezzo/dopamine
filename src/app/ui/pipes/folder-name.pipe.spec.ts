import { IMock, Mock } from 'typemoq';
import { FolderNamePipe } from './folder-name.pipe';
import { FileAccessBase } from '../../common/io/file-access.base';
import { FolderModel } from '../../services/folder/folder-model';
import { Folder } from '../../data/entities/folder';

describe('FolderNamePipe', () => {
    describe('transform', () => {
        it('should return empty string if folder is undefined', () => {
            // Arrange
            const fileAccessMock: IMock<FileAccessBase> = Mock.ofType<FileAccessBase>();
            fileAccessMock.setup((x) => x.getDirectoryOrFileName('/home/User/Music')).returns(() => 'Music');
            const directoryNamePipe: FolderNamePipe = new FolderNamePipe(fileAccessMock.object);

            // Act
            const folderName: string = directoryNamePipe.transform(undefined);

            // Assert
            expect(folderName).toEqual('');
        });

        it('should return empty string if folder path is empty', () => {
            // Arrange
            const fileAccessMock: IMock<FileAccessBase> = Mock.ofType<FileAccessBase>();
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
            const fileAccessMock: IMock<FileAccessBase> = Mock.ofType<FileAccessBase>();
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
