import { Observable, Subject, Subscription } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseMetadataService } from '../metadata/base-metadata.service';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BasePlaybackInformationService } from './base-playback-information.service';
import { PlaybackInformation } from './playback-information';
import { PlaybackInformationService } from './playback-information.service';

describe('PlaybackInformationService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let dateTimeMock: IMock<DateTime>;
    let playbackService_PlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackService_PlaybackStoppedMock: Subject<void>;

    let track: Track;
    let trackModel: TrackModel;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        dateTimeMock = Mock.ofType<DateTime>();
        playbackService_PlaybackStartedMock = new Subject();
        const playbackService_PlaybackStartedMock$: Observable<PlaybackStarted> = playbackService_PlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackService_PlaybackStartedMock$);
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

        playbackService_PlaybackStoppedMock = new Subject();
        const playbackService_PlaybackStoppedMock$: Observable<void> = playbackService_PlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackService_PlaybackStoppedMock$);

        track = new Track('Path');
        trackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);

        metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModel)).returns(async () => 'imageUrl');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            // Assert
            expect(service).toBeDefined();
        });

        it('should define playingNextTrack$', () => {
            // Arrange

            // Act
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            // Assert
            expect(service.playingNextTrack$).toBeDefined();
        });

        it('should subscribe to playbackService.playbackStarted and raise playingPreviousTrack containing defined playback information when playing a previous track', async () => {
            // Arrange
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            let receivedPlaybackInformation: PlaybackInformation;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                })
            );

            // Act
            playbackService_PlaybackStartedMock.next(new PlaybackStarted(trackModel, true));
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation.track).toBe(trackModel);
            expect(receivedPlaybackInformation.imageUrl).toEqual('imageUrl');
        });

        it('should subscribe to playbackService.playbackStarted and raise playingNextTrack containing defined playback information when playing a next track', async () => {
            // Arrange
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            let receivedPlaybackInformation: PlaybackInformation;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                })
            );

            // Act
            playbackService_PlaybackStartedMock.next(new PlaybackStarted(trackModel, false));
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation.track).toBe(trackModel);
            expect(receivedPlaybackInformation.imageUrl).toEqual('imageUrl');
        });

        it('should subscribe to playbackService.playbackStopped and raise playingNoTrack containing undefined playback information when playing a no track', async () => {
            // Arrange
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            let receivedPlaybackInformation: PlaybackInformation;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    receivedPlaybackInformation = playbackInformation;
                })
            );

            // Act
            playbackService_PlaybackStoppedMock.next();
            await flushPromises();

            // Assert
            expect(receivedPlaybackInformation).toBeDefined();
            expect(receivedPlaybackInformation.track).toBeUndefined();
            expect(receivedPlaybackInformation.imageUrl).toEqual('');
        });
    });

    describe('getCurrentPlaybackInformationAsync', () => {
        it('should return the current playback information', async () => {
            // Arrange
            const service: BasePlaybackInformationService = new PlaybackInformationService(
                playbackServiceMock.object,
                metadataServiceMock.object
            );

            // Act
            const playbackInformation: PlaybackInformation = await service.getCurrentPlaybackInformationAsync();

            // Assert
            expect(playbackInformation).toBeDefined();
            expect(playbackInformation.track).toBe(trackModel);
            expect(playbackInformation.imageUrl).toEqual('imageUrl');
        });
    });
});
