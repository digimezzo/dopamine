import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { TrackFiller } from '../indexing/track-filler';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseFileService } from './base-file.service';
import { FileService } from './file.service';

describe('FolderService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let trackFillerMock: IMock<TrackFiller>;
    let fileSystemMock: IMock<FileSystem>;
    let remoteProxyMock: IMock<BaseRemoteProxy>;
    let loggerMock: IMock<Logger>;

    function createService(): BaseFileService {
        return new FileService(
            playbackServiceMock.object,
            translatorServiceMock.object,
            trackFillerMock.object,
            fileSystemMock.object,
            remoteProxyMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        trackFillerMock = Mock.ofType<TrackFiller>();
        fileSystemMock = Mock.ofType<FileSystem>();
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();

        loggerMock = Mock.ofType<Logger>();

        fileSystemMock.setup((x) => x.getFileExtension('file 1.mp3')).returns(() => '.mp3');
        fileSystemMock.setup((x) => x.getFileExtension('file 1.png')).returns(() => '.png');
        fileSystemMock.setup((x) => x.getFileExtension('file 2.ogg')).returns(() => '.ogg');
        fileSystemMock.setup((x) => x.getFileExtension('file 2.mkv')).returns(() => '.mkv');
        fileSystemMock.setup((x) => x.getFileExtension('file 3.bmp')).returns(() => '.bmp');

        trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(It.isAny())).returns(async () => new Track('dummypath'));
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

    describe('enqueueParameterFilesAsync', () => {
        it('should enqueue all playable tracks found as parameters and play the first track', async () => {
            // Arrange
            remoteProxyMock.setup((x) => x.getParameters()).returns(() => ['file 1.mp3', 'file 2.ogg', 'file 3.bmp']);
            const service: BaseFileService = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracks(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 && trackModels[0].path === 'file 1.mp3' && trackModels[1].path === 'file 2.ogg'
                        ),
                        It.is<TrackModel>((trackModel: TrackModel) => trackModel.path === 'file 1.mp3')
                    ),
                Times.once()
            );
        });

        it('should not enqueue and play anything if there are no playable tracks found as parameters', async () => {
            // Arrange
            remoteProxyMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.mkv', 'file 3.bmp']);
            const service: BaseFileService = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny(), It.isAny()), Times.never());
        });
    });
});
