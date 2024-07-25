import { Observable, Subject, Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { PlaybackInformation } from './playback-information';
import { PlaybackInformationService } from './playback-information.service';
import { PlaybackServiceBase } from '../playback/playback.service.base';
import { MetadataServiceBase } from '../metadata/metadata.service.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { Track } from '../../data/entities/track';
import { PlaybackInformationServiceBase } from './playback-information.service.base';
import { Constants } from '../../common/application/constants';
import { MockCreator } from '../../testing/mock-creator';
import { SettingsMock } from '../../testing/settings-mock';

describe('PlaybackInformationService', () => {
    let playbackServiceMock: IMock<PlaybackServiceBase>;
    let metadataServiceMock: IMock<MetadataServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let settingsMock: any;
    let playbackService_PlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackService_PlaybackStoppedMock: Subject<void>;

    let track: Track;
    let trackModel: TrackModel;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        settingsMock = new SettingsMock();
        playbackService_PlaybackStartedMock = new Subject();
        const playbackService_PlaybackStartedMock$: Observable<PlaybackStarted> = playbackService_PlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackService_PlaybackStartedMock$);
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

        playbackService_PlaybackStoppedMock = new Subject();
        const playbackService_PlaybackStoppedMock$: Observable<void> = playbackService_PlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackService_PlaybackStoppedMock$);

        track = new Track('Path');
        trackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, settingsMock);

        metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModel, 0)).returns(() => Promise.resolve('imageUrl'));
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            // Assert
            expect(service).toBeDefined();
        });

        it('should define playingNextTrack$', () => {
            // Arrange

            // Act
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            // Assert
            expect(service.playingNextTrack$).toBeDefined();
        });

        it('should subscribe to playbackService.playbackStarted and raise playingPreviousTrack containing defined playback information when playing a previous track', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            let receivedPlaybackInformation: PlaybackInformation | undefined;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                }),
            );

            // Act
            playbackService_PlaybackStartedMock.next(new PlaybackStarted(trackModel, true));
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation!.track).toBe(trackModel);
            expect(receivedPlaybackInformation!.imageUrl).toEqual('imageUrl');
        });

        it('should subscribe to playbackService.playbackStarted and raise playingNextTrack containing defined playback information when playing a next track', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            let receivedPlaybackInformation: PlaybackInformation | undefined;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                }),
            );

            // Act
            playbackService_PlaybackStartedMock.next(new PlaybackStarted(trackModel, false));
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation!.track).toBe(trackModel);
            expect(receivedPlaybackInformation!.imageUrl).toEqual('imageUrl');
        });

        it('should subscribe to playbackService.playbackStopped and raise playingNoTrack containing undefined playback information when playing a no track', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            let receivedPlaybackInformation: PlaybackInformation | undefined;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                }),
            );

            // Act
            playbackService_PlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation!.track).toBeUndefined();
            expect(receivedPlaybackInformation!.imageUrl).toEqual('');
        });
    });

    describe('getCurrentPlaybackInformationAsync', () => {
        it('should return the current playback information', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            // Act
            const playbackInformation: PlaybackInformation = await service.getCurrentPlaybackInformationAsync();

            // Assert
            expect(playbackInformation).toBeDefined();
            expect(playbackInformation.track).toBe(trackModel);
            expect(playbackInformation.imageUrl).toEqual('imageUrl');
        });

        it('should return cached playback information if the track has not changed', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            await service.getCurrentPlaybackInformationAsync();
            metadataServiceMock.reset();

            // Act
            const playbackInformation: PlaybackInformation = await service.getCurrentPlaybackInformationAsync();

            // Assert
            metadataServiceMock.verify((x) => x.createImageUrlAsync(It.isAny(), It.isAny()), Times.never());
            expect(playbackInformation).toBeDefined();
            expect(playbackInformation.track).toBe(trackModel);
            expect(playbackInformation.imageUrl).toEqual('imageUrl');
        });

        it('should not return cached playback information if the track has changed', async () => {
            // Arrange
            const service: PlaybackInformationServiceBase = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object,
            );

            await service.getCurrentPlaybackInformationAsync();

            const trackModel2 = MockCreator.createTrackModel('path2', 'title2', 'artists2');

            metadataServiceMock.reset();

            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModel2, 0)).returns(() => Promise.resolve('imageUrl2'));

            playbackServiceMock.reset();

            const playbackService_PlaybackStartedMock$: Observable<PlaybackStarted> = playbackService_PlaybackStartedMock.asObservable();
            playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackService_PlaybackStartedMock$);
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel2);

            playbackService_PlaybackStoppedMock = new Subject();
            const playbackService_PlaybackStoppedMock$: Observable<void> = playbackService_PlaybackStoppedMock.asObservable();
            playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackService_PlaybackStoppedMock$);

            // Act
            const playbackInformation: PlaybackInformation = await service.getCurrentPlaybackInformationAsync();

            // Assert
            metadataServiceMock.verify((x) => x.createImageUrlAsync(trackModel2, 0), Times.once());
            expect(playbackInformation).toBeDefined();
            expect(playbackInformation.track).toBe(trackModel2);
            expect(playbackInformation.imageUrl).toEqual('imageUrl2');
        });
    });
});
