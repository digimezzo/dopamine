const { FileAccessMock } = require('../mocks/file-access-mock');
const { LoggerMock } = require('../mocks/logger-mock');
const { DirectoryWalkResult } = require('./directory-walk-result');
const { Folder } = require('../data/entities/folder');
const { DirectoryWalkerMock } = require('../mocks/directory-walker-mock');
const { FolderRepositoryMock } = require('../mocks/folder-repository-mock');
const { IndexablePathFetcher } = require('./indexable-path-fetcher');

describe('IndexablePathFetcher', () => {
    let folderRepositoryMock;
    let directoryWalkerMock;
    let fileAccessMock;
    let loggerMock;

    beforeEach(() => {
        folderRepositoryMock = new FolderRepositoryMock();
        directoryWalkerMock = new DirectoryWalkerMock();
        fileAccessMock = new FileAccessMock();
        loggerMock = new LoggerMock();

        const folder1 = new Folder('/home/user/Folder1');
        folder1.folderId = 1;
        folder1.showInCollection = 1;

        const folder2 = new Folder('/home/user/Folder2');
        folder2.folderId = 2;
        folder2.showInCollection = 1;

        folderRepositoryMock.getFoldersReturnValues = [folder1, folder2];

        const filePaths1 = [
            '/home/user/Folder1/Track 1.mp3',
            '/home/user/Folder1/Track 2.mp3',
            '/home/user/Folder1/Image 1.png',
            '/home/user/Folder1/Image 2',
        ];

        const errors1 = [];

        const directoryWalkResult1 = new DirectoryWalkResult(filePaths1, errors1);

        const filePaths2 = [
            '/home/user/Folder2/Track 1.mp3',
            '/home/user/Folder2/Track 2.mp3',
            '/home/user/Folder2/Image 1.png',
            '/home/user/Folder2/Image 2',
        ];

        const errors2 = [];

        const directoryWalkResult2 = new DirectoryWalkResult(filePaths2, errors2);

        directoryWalkerMock.getFilesInDirectoryAsyncReturnValues = {
            '/home/user/Folder1': directoryWalkResult1,
            '/home/user/Folder2': directoryWalkResult2,
        };

        fileAccessMock.getFileExtensionReturnValues = {
            '/home/user/Folder1/Track 1.mp3': '.mp3',
            '/home/user/Folder1/Track 2.mp3': '.mp3',
            '/home/user/Folder1/Image 1.png': '.png',
            '/home/user/Folder1/Image 2': '',
            '/home/user/Folder2/Track 1.mp3': '.mp3',
            '/home/user/Folder2/Track 2.mp3': '.mp3',
            '/home/user/Folder2/Image 1.png': '.png',
            '/home/user/Folder2/Image 2': '',
        };

        fileAccessMock.pathExistsReturnValues = {
            '/home/user/Folder1': true,
            '/home/user/Folder2': true,
        };

        fileAccessMock.getDateModifiedInTicksReturnValues = {
            '/home/user/Folder1/Track 1.mp3': 100,
            '/home/user/Folder1/Track 2.mp3': 100,
            '/home/user/Folder1/Image 1.png': 100,
            '/home/user/Folder1/Image 2': 100,
            '/home/user/Folder2/Track 1.mp3': 100,
            '/home/user/Folder2/Track 2.mp3': 100,
            '/home/user/Folder2/Image 1.png': 100,
            '/home/user/Folder2/Image 2': 100,
        };
    });

    function createSut() {
        return new IndexablePathFetcher(folderRepositoryMock, directoryWalkerMock, fileAccessMock, loggerMock);
    }

    describe('getIndexablePathsForAllFoldersAsync', () => {
        it('should collect supported audio files for all folders', async () => {
            // Arrange
            const sut = createSut();

            // Act
            const indexablePaths = await sut.getIndexablePathsForAllFoldersAsync();

            // Assert
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Folder1/Track 1.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Folder1/Track 2.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Folder2/Track 1.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Folder2/Track 2.mp3')).toBeTruthy();
        });

        it('should not collect unsupported audio files for all folders', async () => {
            // Arrange
            const sut = createSut();

            // Act
            const indexablePaths = await sut.getIndexablePathsForAllFoldersAsync();

            // Assert
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Folder1/Image 1.png')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Folder1/Image 2')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Folder2/Image 1.png')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Folder2/Image 2')).toBeTruthy();
        });
    });
});
