import { IMock, Mock } from 'typemoq';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseFileService } from './base-file.service';
import { FileService } from './file.service';

describe('FolderService', () => {
    let fileSystemMock: IMock<FileSystem>;
    let remoteProxyMock: IMock<BaseRemoteProxy>;
    let loggerMock: IMock<Logger>;

    function createService(): BaseFileService {
        return new FileService(fileSystemMock.object, remoteProxyMock.object, loggerMock.object);
    }

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();
        loggerMock = Mock.ofType<Logger>();

        fileSystemMock.setup((x) => x.getFileExtension('file 1.png')).returns(() => '.png');
        fileSystemMock.setup((x) => x.getFileExtension('file 2.ogg')).returns(() => '.ogg');
        fileSystemMock.setup((x) => x.getFileExtension('file 2.mkv')).returns(() => '.mkv');
        fileSystemMock.setup((x) => x.getFileExtension('file 3.bmp')).returns(() => '.bmp');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseFileService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('hasPlayableFilesAsParameters', () => {
        it('should return true if there is at least 1 playable file as parameter', () => {
            // Arrange
            remoteProxyMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.ogg', 'file 3.bmp']);
            const service: BaseFileService = createService();

            // Act
            const hasPlayableFilesAsParameters: boolean = service.hasPlayableFilesAsParameters();

            // Assert
            expect(hasPlayableFilesAsParameters).toBeTruthy();
        });

        it('should return false if there are no playable files as parameters', () => {
            remoteProxyMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.mkv', 'file 3.bmp']);

            // Arrange
            const service: BaseFileService = createService();

            // Act
            const hasPlayableFilesAsParameters: boolean = service.hasPlayableFilesAsParameters();

            // Assert
            expect(hasPlayableFilesAsParameters).toBeFalsy();
        });
    });
});
