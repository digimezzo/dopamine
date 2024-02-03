const { FileAccessMock } = require('../mocks/file-access-mock');
const { DirectoryWalker } = require('./directory-walker');

describe('DirectoryWalker', () => {
    describe('getFilesInDirectoryAsync', () => {
        it('should collect all files in the directory and subdirectories', async () => {
            // Arrange
            const fileAccessMock = new FileAccessMock();

            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Artist 1.png'],
                '/home/user/Music/Images': ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png'],
                '/home/user/Music/Artist 1/Album 1': [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ],
                '/home/user/Music/Artist 1/Album 2': [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ],
            };

            fileAccessMock.getDirectoriesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Artist 1', '/home/user/Music/Images'],
                '/home/user/Music/Images': [],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2'],
                '/home/user/Music/Artist 1/Album 1': [],
                '/home/user/Music/Artist 1/Album 2': [],
            };

            const directoryWalker = new DirectoryWalker(fileAccessMock);

            // Act
            const directoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

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
            const fileAccessMock = new FileAccessMock();

            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Artist 1.png'],
                '/home/user/Music/Images': ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png'],
                '/home/user/Music/Artist 1/Album 1': [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ],
                '/home/user/Music/Artist 1/Album 2': [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ],
            };

            fileAccessMock.getDirectoriesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Artist 1', '/home/user/Music/Images'],
                '/home/user/Music/Images': [],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2'],
                '/home/user/Music/Artist 1/Album 1': [],
                '/home/user/Music/Artist 1/Album 2': [],
            };

            const directoryWalker = new DirectoryWalker(fileAccessMock);

            // Act
            const directoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Images')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 1')).toBeTruthy();
            expect(!directoryWalkResult.filePaths.includes('/home/user/Music/Artist 1/Album 2')).toBeTruthy();
        });

        it('should not collect errors if non occurred', async () => {
            // Arrange
            const fileAccessMock = new FileAccessMock();

            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Artist 1.png'],
                '/home/user/Music/Images': ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png'],
                '/home/user/Music/Artist 1/Album 1': [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ],
                '/home/user/Music/Artist 1/Album 2': [
                    '/home/user/Music/Artist 1/Album 2/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 2/Track 3.mp3',
                ],
            };

            fileAccessMock.getDirectoriesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Artist 1', '/home/user/Music/Images'],
                '/home/user/Music/Images': [],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2'],
                '/home/user/Music/Artist 1/Album 1': [],
                '/home/user/Music/Artist 1/Album 2': [],
            };

            const directoryWalker = new DirectoryWalker(fileAccessMock);

            // Act
            const directoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(directoryWalkResult.errors.length).toEqual(0);
        });

        it('should collect errors if any occurred', async () => {
            // Arrange
            const fileAccessMock = new FileAccessMock();

            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Artist 1.png'],
                '/home/user/Music/Images': ['/home/user/Music/Images/Artist image 1.png', '/home/user/Music/Images/Artist image 2.png'],
                '/home/user/Music/Artist 1/Album 1': [
                    '/home/user/Music/Artist 1/Album 1/Track 1.mp3',
                    '/home/user/Music/Artist 1/Album 1/Track 2.mp3',
                    '/home/user/Music/Artist 1/Album 1/Album 1.jpg',
                ],
                '/home/user/Music/Artist 1/Album 2': 'throw',
            };

            fileAccessMock.getDirectoriesInDirectoryAsyncReturnValues = {
                '/home/user/Music': ['/home/user/Music/Artist 1', '/home/user/Music/Images'],
                '/home/user/Music/Images': [],
                '/home/user/Music/Artist 1': ['/home/user/Music/Artist 1/Album 1', '/home/user/Music/Artist 1/Album 2'],
                '/home/user/Music/Artist 1/Album 1': [],
                '/home/user/Music/Artist 1/Album 2': [],
            };

            const directoryWalker = new DirectoryWalker(fileAccessMock);

            // Act
            const directoryWalkResult = await directoryWalker.getFilesInDirectoryAsync('/home/user/Music');

            // Assert
            expect(directoryWalkResult.errors.length).toBeGreaterThan(0);
        });
    });
});
