import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { BaseFolderRepository } from '../app/data/repositories/base-folder-repository';
import { FileSystem } from '../app/core/io/file-system';
import { Logger } from '../app/core/logger';
import { IndexablePathFetcher } from '../app/services/indexing/indexable-path-fetcher';
import { IndexablePath } from '../app/services/indexing/indexable-path';
import { Folder } from '../app/data/entities/folder';
import { DirectoryWalker } from '../app/services/indexing/directory-walker';
import { DirectoryWalkResult } from '../app/services/indexing/directory-walk-result';

describe('IndexablePathFetcher', () => {
    describe('getIndexablePathsForAllFoldersAsync', () => {
        it('Should collect supported audio files for all folders', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const directoryWalkerMock: IMock<DirectoryWalker> = Mock.ofType<DirectoryWalker>();
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const indexablePathFetcher: IndexablePathFetcher = new IndexablePathFetcher(
                fileSystemMock.object,
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

            folderRepositoryMock.setup(x => x.getFolders()).returns(() => [folder1, folder2]);

            const filePaths1: string[] = [
                '/home/user/Music/Track 1.mp3',
                '/home/user/Music/Track 2.mp3',
                '/home/user/Music/Image 1.png',
                '/home/user/Music/Image 2'
            ];

            const errors1: Error[] = [];

            const directoryWalkResult1: DirectoryWalkResult = new DirectoryWalkResult(filePaths1, errors1);

            const filePaths2: string[] = [
                '/home/user/Downloads/Track 1.mp3',
                '/home/user/Downloads/Track 2.mp3',
                '/home/user/Downloads/Image 1.png',
                '/home/user/Downloads/Image 2'
            ];

            const errors2: Error[] = [];

            const directoryWalkResult2: DirectoryWalkResult = new DirectoryWalkResult(filePaths2, errors2);

            directoryWalkerMock.setup(x => x.getFilesInDirectoryAsync(folder1.path)).returns(async () => directoryWalkResult1);
            directoryWalkerMock.setup(x => x.getFilesInDirectoryAsync(folder2.path)).returns(async () => directoryWalkResult2);

            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Track 2.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Image 1.png')).returns(() => '.png');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Image 2')).returns(() => '');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Track 1.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Track 2.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Image 1.png')).returns(() => '.png');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Image 2')).returns(() => '');
            fileSystemMock.setup(x => x.pathExists('/home/user/Music')).returns(() => true);
            fileSystemMock.setup(x => x.pathExists('/home/user/Downloads')).returns(() => true);
            fileSystemMock.setup(x => x.getDateModifiedAsync(It.isAny())).returns(async () => new Date());

            // Act
            const indexablePaths: IndexablePath[] = await indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Music/Track 1.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Music/Track 2.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Downloads/Track 1.mp3'));
            assert.ok(indexablePaths.map(x => x.path).includes('/home/user/Downloads/Track 2.mp3'));
        });

        it('Should not collect unsupported audio files for all folders', async () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const directoryWalkerMock: IMock<DirectoryWalker> = Mock.ofType<DirectoryWalker>();
            const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
            const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

            const indexablePathFetcher: IndexablePathFetcher = new IndexablePathFetcher(
                fileSystemMock.object,
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

            folderRepositoryMock.setup(x => x.getFolders()).returns(() => [folder1, folder2]);

            const filePaths1: string[] = [
                '/home/user/Music/Track 1.mp3',
                '/home/user/Music/Track 2.mp3',
                '/home/user/Music/Image 1.png',
                '/home/user/Music/Image 2'
            ];

            const errors1: Error[] = [];

            const directoryWalkResult1: DirectoryWalkResult = new DirectoryWalkResult(filePaths1, errors1);

            const filePaths2: string[] = [
                '/home/user/Downloads/Track 1.mp3',
                '/home/user/Downloads/Track 2.mp3',
                '/home/user/Downloads/Image 1.png',
                '/home/user/Downloads/Image 2'
            ];

            const errors2: Error[] = [];

            const directoryWalkResult2: DirectoryWalkResult = new DirectoryWalkResult(filePaths2, errors2);

            directoryWalkerMock.setup(x => x.getFilesInDirectoryAsync(folder1.path)).returns(async () => directoryWalkResult1);
            directoryWalkerMock.setup(x => x.getFilesInDirectoryAsync(folder2.path)).returns(async () => directoryWalkResult2);

            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Track 2.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Image 1.png')).returns(() => '.png');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Image 2')).returns(() => '');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Track 1.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Track 2.mp3')).returns(() => '.mp3');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Image 1.png')).returns(() => '.png');
            fileSystemMock.setup(x => x.getFileExtension('/home/user/Downloads/Image 2')).returns(() => '');
            fileSystemMock.setup(x => x.pathExists('/home/user/Music')).returns(() => true);
            fileSystemMock.setup(x => x.pathExists('/home/user/Downloads')).returns(() => true);
            fileSystemMock.setup(x => x.getDateModifiedAsync(It.isAny())).returns(async () => new Date());

            // Act
            const indexablePaths: IndexablePath[] = await indexablePathFetcher.getIndexablePathsForAllFoldersAsync();

            // Assert
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Music/Image 1.png'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Music/Image 2'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Downloads/Image 1.png'));
            assert.ok(!indexablePaths.map(x => x.path).includes('/home/user/Downloads/Image 2'));
        });
    });
});
