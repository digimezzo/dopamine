import { IMock, It, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { Folder } from '../../app/data/entities/folder';
import { BaseFolderRepository } from '../../app/data/repositories/base-folder-repository';
import { DirectoryWalkResult } from '../../app/services/indexing/directory-walk-result';
import { DirectoryWalker } from '../../app/services/indexing/directory-walker';
import { IndexablePathFetcher } from '../../app/services/indexing/indexable-path-fetcher';

export class IndexablePathFetcherMocker {
    constructor() {
        this.indexablePathFetcher = new IndexablePathFetcher(
            this.fileSystemMock.object,
            this.directoryWalkerMock.object,
            this.loggerMock.object,
            this.folderRepositoryMock.object
        );

        this.setup();
    }

    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public directoryWalkerMock: IMock<DirectoryWalker> = Mock.ofType<DirectoryWalker>();
    public folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public indexablePathFetcher: IndexablePathFetcher;

    public setup(): void {
        const folder1: Folder = new Folder('/home/user/Music');
        folder1.folderId = 1;
        folder1.showInCollection = 1;

        const folder2: Folder = new Folder('/home/user/Downloads');
        folder2.folderId = 2;
        folder2.showInCollection = 1;

        this.folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

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

        this.directoryWalkerMock.setup((x) => x.getFilesInDirectoryAsync(folder1.path)).returns(async () => directoryWalkResult1);
        this.directoryWalkerMock.setup((x) => x.getFilesInDirectoryAsync(folder2.path)).returns(async () => directoryWalkResult2);

        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Track 2.mp3')).returns(() => '.mp3');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Image 1.png')).returns(() => '.png');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Image 2')).returns(() => '');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Downloads/Track 1.mp3')).returns(() => '.mp3');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Downloads/Track 2.mp3')).returns(() => '.mp3');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Downloads/Image 1.png')).returns(() => '.png');
        this.fileSystemMock.setup((x) => x.getFileExtension('/home/user/Downloads/Image 2')).returns(() => '');
        this.fileSystemMock.setup((x) => x.pathExists('/home/user/Music')).returns(() => true);
        this.fileSystemMock.setup((x) => x.pathExists('/home/user/Downloads')).returns(() => true);
        this.fileSystemMock.setup((x) => x.getDateModifiedInTicksAsync(It.isAny())).returns(async () => 100);
    }
}
