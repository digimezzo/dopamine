import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { FileValidator } from '../../common/file-validator';
import { BaseApplication } from '../../common/io/base-application';
import { Logger } from '../../common/logger';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseFileService } from './base-file.service';
import { FileService } from './file.service';

describe('FileService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let trackModelFactoryMock: IMock<TrackModelFactory>;
    let fileValidatorMock: IMock<FileValidator>;
    let applicationMock: IMock<BaseApplication>;
    let loggerMock: IMock<Logger>;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let argumentsReceivedMock: Subject<string[]>;
    let argumentsReceivedMock$: Observable<string[]>;

    const flushPromises = () => new Promise(process.nextTick);

    function createService(): BaseFileService {
        return new FileService(
            playbackServiceMock.object,
            trackModelFactoryMock.object,
            applicationMock.object,
            fileValidatorMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        trackModelFactoryMock = Mock.ofType<TrackModelFactory>();
        fileValidatorMock = Mock.ofType<FileValidator>();
        applicationMock = Mock.ofType<BaseApplication>();
        loggerMock = Mock.ofType<Logger>();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        fileValidatorMock.setup((x) => x.isPlayableAudioFile('file 1.mp3')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('file 1.png')).returns(() => false);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('file 2.ogg')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('file 2.mkv')).returns(() => false);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('file 3.bmp')).returns(() => false);

        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('file 1.mp3'))
            .returns(async () => new TrackModel(new Track('file 1.mp3'), dateTimeMock.object, translatorServiceMock.object));

        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('file 2.ogg'))
            .returns(async () => new TrackModel(new Track('file 2.ogg'), dateTimeMock.object, translatorServiceMock.object));

        argumentsReceivedMock = new Subject();
        argumentsReceivedMock$ = argumentsReceivedMock.asObservable();

        applicationMock.setup((x) => x.argumentsReceived$).returns(() => argumentsReceivedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseFileService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should enqueue all playable tracks found as parameters and play the first track when arguments are received', async () => {
            // Arrange
            const service: BaseFileService = createService();

            // Act
            argumentsReceivedMock.next(['file 1.mp3', 'file 2.ogg', 'file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracks(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 && trackModels[0].path === 'file 1.mp3' && trackModels[1].path === 'file 2.ogg'
                    )),
                Times.once()
            );
        });

        it('should not enqueue and play anything if parameters are undefined when arguments are received', async () => {
            // Arrange
            const service: BaseFileService = createService();

            // Act
            argumentsReceivedMock.next(undefined);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });

        it('should not enqueue and play anything if parameters are empty when arguments are received', async () => {
            // Arrange
            const service: BaseFileService = createService();

            // Act
            argumentsReceivedMock.next([]);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });

        it('should not enqueue and play anything if there are no playable tracks found as parameters when arguments are received', async () => {
            // Arrange
            const service: BaseFileService = createService();

            // Act
            argumentsReceivedMock.next(['file 1.png', 'file 2.mkv', 'file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });
    });

    describe('hasPlayableFilesAsParameters', () => {
        it('should return true if there is at least 1 playable file as parameter', () => {
            // Arrange
            applicationMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.ogg', 'file 3.bmp']);
            const service: BaseFileService = createService();

            // Act
            const hasPlayableFilesAsParameters: boolean = service.hasPlayableFilesAsParameters();

            // Assert
            expect(hasPlayableFilesAsParameters).toBeTruthy();
        });

        it('should return false if there are no playable files as parameters', () => {
            applicationMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.mkv', 'file 3.bmp']);

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
            applicationMock.setup((x) => x.getParameters()).returns(() => ['file 1.mp3', 'file 2.ogg', 'file 3.bmp']);
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
                        )
                    ),
                Times.once()
            );
        });

        it('should not enqueue and play anything if parameters are undefined', async () => {
            // Arrange
            applicationMock.setup((x) => x.getParameters()).returns(() => undefined);
            const service: BaseFileService = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });

        it('should not enqueue and play anything if parameters are empty', async () => {
            // Arrange
            applicationMock.setup((x) => x.getParameters()).returns(() => []);
            const service: BaseFileService = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });

        it('should not enqueue and play anything if there are no playable tracks found as parameters', async () => {
            // Arrange
            applicationMock.setup((x) => x.getParameters()).returns(() => ['file 1.png', 'file 2.mkv', 'file 3.bmp']);
            const service: BaseFileService = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(It.isAny()), Times.never());
        });
    });
});
