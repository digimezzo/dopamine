import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { DirectoryWalkResult } from '../app/services/indexing/directory-walk-result';
import { DirectoryWalker } from '../app/services/indexing/directory-walker';

describe('DirectoryWalker', () => {
    describe('getFilesInDirectoryAsync', () => {
        it('Should collect all files in the directory and subdirectories', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images'))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2')).returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileSystemMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Track 1.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Track 2.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Artist 1.png'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Images/Artist image 1.png'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Images/Artist image 2.png'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Track 1.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Track 2.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1/Album 1.jpg'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 1.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 2.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2/Track 3.mp3'));
        });

        it('Should not collect any directories in the directory and subdirectories', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images'))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2')).returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileSystemMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            assert.ok(!directoryWalkResult.filePaths.includes('/home/user/Music'));
            assert.ok(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1'));
            assert.ok(!directoryWalkResult.filePaths.includes('/home/user/Music/Images'));
            assert.ok(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1'));
            assert.ok(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2'));
        });

        it('Should not collect errors if non occurred', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images'))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2')).returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileSystemMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            assert.strictEqual(directoryWalkResult.errors.length, 0);
        });

        it('Should collect errors if any occurred', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music'))
                .returns(async () => ['/home/user/Music/Artist 1', '/home/user/Music/Images']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Artist 1.png']);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Images')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Images'))
                .returns(async () => ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png']);

            fileSystemMock
                .setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1'))
                .returns(async () => ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2']);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 1'))
                .returns(async () => [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ]);

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 1')).returns(async () => []);

            fileSystemMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Artist 1/Album 2'))
                .throws(new Error('An error occurred'));

            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Artist 1/Album 2')).returns(async () => []);

            const directoryWalker: DirectoryWalker = new DirectoryWalker(fileSystemMock.object);

            // Act
            const directoryWalkResult: DirectoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            assert.ok(directoryWalkResult.errors.length > 0);
        });
    });
});
