import { IMock, It, Mock } from 'typemoq';
import { Folder } from '../../common/data/entities/folder';
import { BaseFolderRepository } from '../../common/data/repositories/base-folder-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { DirectoryWalkResult } from './directory-walk-result';
import { DirectoryWalker } from './directory-walker';
import { IndexablePath } from './indexable-path';
import { IndexablePathFetcher } from './indexable-path-fetcher';

describe('IndexablePathFetcher', () => {
    let fileAccessMock: IMock<BaseFileAccess>;
    let directoryWalkerMock: IMock<DirectoryWalker>;
    let folderRepositoryMock: IMock<BaseFolderRepository>;
    let loggerMock: IMock<Logger>;
    let indexablePathFetcher: IndexablePathFetcher;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        directoryWalkerMock = Mock.ofType<DirectoryWalker>();
        folderRepositoryMock = Mock.ofType<BaseFolderRepository>();
        loggerMock = Mock.ofType<Logger>();
        indexablePathFetcher = new IndexablePathFetcher(
            fileAccessMock.object,
            directoryWalkerMock.object,
            loggerMock.object,
            folderRepositoryMock.object
        );

        const folder1: Folder = new Folder('/home/user/Music');
        folder1.folderId = 1;
        folder1.showInCollection = 1;

        const folder2: Folder = new Folder('/home/user/Downloads');
        folder2.folderId = 2;
        folder2.showInCollection = 1;

        folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

        const filePaths1: string[] = [
            '/home/user/Music/Track 1.mp3',
            '/home/user/Music/Track 2.mp3',
            '/home/user/Music/Image 1.png',
            '/home/user/Music/Image 2',
        ];

        const errors1: Error[] = [];

        const directoryWalkResult1: DirectoryWalkResult = new DirectoryWalkResult(filePaths1, errors1);

        const filePaths2: string[] = [
            '/home/user/Downloads/Track 1.mp3',
            '/home/user/Downloads/Track 2.mp3',
            '/home/user/Downloads/Image 1.png',
            '/home/user/Downloads/Image 2',
        ];

        const errors2: Error[] = [];

        const directoryWalkResult2: DirectoryWalkResult = new DirectoryWalkResult(filePaths2, errors2);

        directoryWalkerMock.setup((x) => x.getFilesInDirectoryAsync(folder1.path)).returns(async () => directoryWalkResult1);
        directoryWalkerMock.setup((x) => x.getFilesInDirectoryAsync(folder2.path)).returns(async () => directoryWalkResult2);

        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Track 2.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Image 1.png')).returns(() => '.png');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Image 2')).returns(() => '');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Downloads/Track 1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Downloads/Track 2.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Downloads/Image 1.png')).returns(() => '.png');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Downloads/Image 2')).returns(() => '');
        fileAccessMock.setup((x) => x.pathExists('/home/user/Music')).returns(() => true);
        fileAccessMock.setup((x) => x.pathExists('/home/user/Downloads')).returns(() => true);
        fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync(It.isAny())).returns(async () => 100);
    });

    describe('getIndexablePathsForAllFoldersAsync', () => {
        it('should collect supported audio files for all folders', async () => {
            // Arrange

            // Act
            const indexablePaths: IndexablePath[] = await indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Music/Track 1.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Music/Track 2.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Downloads/Track 1.mp3')).toBeTruthy();
            expect(indexablePaths.map((x) => x.path).includes('/home/user/Downloads/Track 2.mp3')).toBeTruthy();
        });

        it('should not collect unsupported audio files for all folders', async () => {
            // Arrange

            // Act
            const indexablePaths: IndexablePath[] = await indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Music/Image 1.png')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Music/Image 2')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Downloads/Image 1.png')).toBeTruthy();
            expect(!indexablePaths.map((x) => x.path).includes('/home/user/Downloads/Image 2')).toBeTruthy();
        });
    });
});
