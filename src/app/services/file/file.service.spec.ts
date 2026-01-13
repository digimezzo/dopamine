import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { FileService } from './file.service';
import { PlaybackService } from '../playback/playback.service';
import { EventListenerServiceBase } from '../event-listener/event-listener.service.base';
import { FileValidator } from '../../common/validation/file-validator';
import { ApplicationBase } from '../../common/io/application.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { FileServiceBase } from './file.service.base';
import { Track } from '../../data/entities/track';
import { SettingsMock } from '../../testing/settings-mock';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { FileAccessBase } from '../../common/io/file-access.base';

describe('FileService', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let eventListenerServiceMock: IMock<EventListenerServiceBase>;
    let trackModelFactoryMock: IMock<TrackModelFactory>;
    let fileValidatorMock: IMock<FileValidator>;
    let fileAccessMock: IMock<FileAccessBase>;
    let ipcProxyMock: IMock<IpcProxyBase>;
    let applicationMock: IMock<ApplicationBase>;
    let loggerMock: IMock<Logger>;
    let settingsMock: any;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let argumentsReceivedMock: Subject<string[]>;
    let argumentsReceivedMock$: Observable<string[]>;

    let filesDroppedMock: Subject<string[]>;
    let filesDroppedMock$: Observable<string[]>;

    const flushPromises = () => new Promise(process.nextTick);

    function createService(): FileServiceBase {
        return new FileService(
            playbackServiceMock.object,
            eventListenerServiceMock.object,
            trackModelFactoryMock.object,
            applicationMock.object,
            fileValidatorMock.object,
            fileAccessMock.object,
            ipcProxyMock.object,
            settingsMock,
            loggerMock.object,
        );
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        eventListenerServiceMock = Mock.ofType<EventListenerServiceBase>();
        trackModelFactoryMock = Mock.ofType<TrackModelFactory>();
        fileValidatorMock = Mock.ofType<FileValidator>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        ipcProxyMock = Mock.ofType<IpcProxyBase>();
        applicationMock = Mock.ofType<ApplicationBase>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = new SettingsMock();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 1.mp3')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 3.mp3')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 4.mp3')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 1.png')).returns(() => false);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 2.ogg')).returns(() => true);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 2.mkv')).returns(() => false);
        fileValidatorMock.setup((x) => x.isPlayableAudioFile('/my/directory/file 3.bmp')).returns(() => false);

        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('/my/directory/file 1.mp3', ''))
            .returns(() =>
                Promise.resolve(
                    new TrackModel(new Track('/my/directory/file 1.mp3'), dateTimeMock.object, translatorServiceMock.object, settingsMock),
                ),
            );

        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('/my/directory/file 2.ogg', ''))
            .returns(() =>
                Promise.resolve(
                    new TrackModel(new Track('/my/directory/file 2.ogg'), dateTimeMock.object, translatorServiceMock.object, settingsMock),
                ),
            );

        argumentsReceivedMock = new Subject();
        argumentsReceivedMock$ = argumentsReceivedMock.asObservable();

        filesDroppedMock = new Subject();
        filesDroppedMock$ = filesDroppedMock.asObservable();

        eventListenerServiceMock.setup((x) => x.argumentsReceived$).returns(() => argumentsReceivedMock$);
        eventListenerServiceMock.setup((x) => x.filesDropped$).returns(() => filesDroppedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: FileServiceBase = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should enqueue all playable tracks that are found as parameters in directory order when given unordered and same number of files than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 3.bmp', '/my/directory/file 2.ogg']);

            createService();

            // Act
            argumentsReceivedMock.next(['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are found as parameters in directory order when given ordered and same number of files than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);

            createService();

            // Act
            argumentsReceivedMock.next(['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are found as parameters in directory order when given unordered and less files than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            createService();

            // Act
            argumentsReceivedMock.next(['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are found as parameters in directory order when given ordered and less tracks than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            createService();

            // Act
            argumentsReceivedMock.next(['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should not enqueue anything if parameters are undefined when arguments are received', async () => {
            // Arrange
            createService();

            // Act
            argumentsReceivedMock.next(undefined);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(It.isAny()), Times.never());
        });

        it('should not enqueue anything if parameters are empty when arguments are received', async () => {
            // Arrange
            createService();

            // Act
            argumentsReceivedMock.next([]);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(It.isAny()), Times.never());
        });

        it('should not enqueue anything if there are no playable tracks found as parameters when arguments are received', async () => {
            // Arrange
            createService();

            // Act
            argumentsReceivedMock.next(['/my/directory/file 1.png', '/my/directory/file 2.mkv', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(It.isAny()), Times.never());
        });

        it('should enqueue all playable tracks that are dropped in directory order when given unordered and same number of tracks than in directory', async () => {
            // Arrange

            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 3.bmp', '/my/directory/file 2.ogg']);

            createService();

            // Act
            filesDroppedMock.next(['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are dropped in directory order when given ordered and same number of tracks than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 3.bmp', '/my/directory/file 2.ogg']);

            createService();

            // Act
            filesDroppedMock.next(['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are dropped in directory order when given unordered and less tracks than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            createService();

            // Act
            filesDroppedMock.next(['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks that are dropped in directory order when given ordered and less tracks than in directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            createService();

            // Act
            filesDroppedMock.next(['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            await flushPromises();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });
    });

    describe('hasPlayableFilesAsParameters', () => {
        it('should return true if there is at least 1 playable file as parameter', () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 1.png', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);
            const service: FileServiceBase = createService();

            // Act
            const hasPlayableFilesAsParameters: boolean = service.hasPlayableFilesAsParameters();

            // Assert
            expect(hasPlayableFilesAsParameters).toBeTruthy();
        });

        it('should return false if there are no playable files as parameters', () => {
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 1.png', '/my/directory/file 2.mkv', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);

            // Arrange
            const service: FileServiceBase = createService();

            // Act
            const hasPlayableFilesAsParameters: boolean = service.hasPlayableFilesAsParameters();

            // Assert
            expect(hasPlayableFilesAsParameters).toBeFalsy();
        });
    });

    describe('enqueueParameterFilesAsync', () => {
        it('should enqueue all playable tracks found as parameters in directory order when given unordered and same number of tracks than in directory', async () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);

            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 3.bmp', '/my/directory/file 2.ogg']);

            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks found as parameters in directory order when given ordered and same number of tracks than in directory', async () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);

            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 3.bmp', '/my/directory/file 2.ogg']);

            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks found as parameters in directory order when given unordered and less tracks than in directory', async () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 2.ogg', '/my/directory/file 1.mp3', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);

            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 2.ogg')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should enqueue all playable tracks found as parameters in directory order when given ordered and less tracks than in directory', async () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 1.mp3', '/my/directory/file 2.ogg', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);

            fileAccessMock.setup((x) => x.getDirectoryPath('/my/directory/file 1.mp3')).returns(() => '/my/directory');
            fileAccessMock
                .setup((x) => x.getFilesInDirectory('/my/directory'))
                .returns(() => [
                    '/my/directory/file 3.bmp',
                    '/my/directory/file 1.mp3',
                    '/my/directory/file 3.mp3',
                    '/my/directory/file 2.ogg',
                    '/my/directory/file 4.mp3',
                ]);

            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify(
                (x) =>
                    x.enqueueAndPlayTracksAsync(
                        It.is<TrackModel[]>(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 2 &&
                                trackModels[0].path === '/my/directory/file 1.mp3' &&
                                trackModels[1].path === '/my/directory/file 2.ogg',
                        ),
                    ),
                Times.once(),
            );
        });

        it('should not enqueue anything if parameters are empty', async () => {
            // Arrange
            applicationMock.setup((x) => x.getParameters()).returns(() => []);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);
            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(It.isAny()), Times.never());
        });

        it('should not enqueue anything if there are no playable tracks found as parameters', async () => {
            // Arrange
            applicationMock
                .setup((x) => x.getParameters())
                .returns(() => ['/my/directory/file 1.png', '/my/directory/file 2.mkv', '/my/directory/file 3.bmp']);
            applicationMock.setup((x) => x.getGlobal('fileQueue')).returns(() => []);
            const service: FileServiceBase = createService();

            // Act
            await service.enqueueParameterFilesAsync();

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(It.isAny()), Times.never());
        });
    });
});
