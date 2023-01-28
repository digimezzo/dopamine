import { IMock, It, Mock } from 'typemoq';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { FileAccess } from '../../common/io/file-access';
import { DirectoryWalkResult } from './directory-walk-result';
import { DirectoryWalker } from './directory-walker';

describe('DirectoryWalker', () => {
    describe('getFilesInDirectoryAsync', () => {
        it('should collect all files in the directory and subdirectories', async () => {
            // Arrange
            const fileAccessMock: IMock<BaseFileAccess> = Mock.ofType<BaseFileAccess>();

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileAccessMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Track 1.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Track 2.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Artist 1.png')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Images/Artist image 1.png')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Images/Artist image 2.png')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Track 1.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Track 2.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Album 1.jpg')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 1.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 2.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 3.mp3')).toBeTruthy();
        });

        it('should not collect any directories in the directory and subdirectories', async () => {
            // Arrange
            const fileAccessMock: IMock<FileAccess> = Mock.ofType<FileAccess>();

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileAccessMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Images')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2')).toBeTruthy();
        });

        it('should not collect errors if non occurred', async () => {
            // Arrange
            const fileAccessMock: IMock<FileAccess> = Mock.ofType<FileAccess>();

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileAccessMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(directoryWalkResult.errors.length).toEqual(0);
        });

        it('should collect errors if any occurred', async () => {
            // Arrange
            const fileAccessMock: IMock<FileAccess> = Mock.ofType<FileAccess>();

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1', true, It.isAny()))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1', true, It.isAny()))
                .returns(async () => []);

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .throws(new Error('An error occurred'));

            fileAccessMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2', true, It.isAny()))
                .returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileAccessMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(directoryWalkResult.errors.length).toBeGreaterThan(0);
        });
    });
});
