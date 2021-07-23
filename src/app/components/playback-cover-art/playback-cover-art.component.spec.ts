import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { Scheduler } from '../../common/scheduler/scheduler';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { PlaybackCoverArtComponent } from './playback-cover-art.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackCoverArtComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let schedulerMock: IMock<Scheduler>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;
    let playbackServicePlaybackStopped: Subject<void>;

    const track1: Track = new Track('/home/user/Music/track1.mp3');
    track1.artists = 'My artist';
    track1.trackTitle = 'My title';

    let trackModel1: TrackModel;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        schedulerMock = Mock.ofType<Scheduler>();

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        trackModel1 = new TrackModel(track1, translatorServiceMock.object);

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);
        playbackServicePlaybackStopped = new Subject();
        const playbackServicePlaybackStopped$: Observable<void> = playbackServicePlaybackStopped.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStopped$);

        component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize contentAnimation as "down"', () => {
            // Arrange

            // Act

            // Assert
            expect(component.contentAnimation).toEqual('down');
        });

        it('should initialize topImageUrl as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topImageUrl).toEqual('');
        });

        it('should initialize bottomImageUrl as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomImageUrl).toEqual('');
        });

        it('should initialize size as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.size).toEqual(0);
        });
    });

    describe('ngOnInit', () => {
        it('should set top image URL and go down without animation if there is a current track playing', async () => {
            // Arrange
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(It.isAny())).returns(async () => 'image-url-mock');
            component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('down');
        });

        it('should subscribe to playbackService.playbackStarted, set bottom image URL and animate up when playing a next track', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModel1)).returns(async () => 'image-url-mock');
            component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.bottomImageUrl = '';
            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, false));
            while (component.bottomImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackService.playbackStarted, set top image URL and animate down when playing a previous track', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(trackModel1)).returns(async () => 'image-url-mock');
            component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.topImageUrl = '';
            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, true));
            while (component.topImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should subscribe to playbackService.playbackStopped, set bottom image URL and animate up when stopping playback', async () => {
            // Arrange
            const scheduler: Scheduler = new Scheduler();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(undefined)).returns(async () => '');
            component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);

            // Act
            await component.ngOnInit();
            component.bottomImageUrl = 'image-url-mock';
            playbackServicePlaybackStopped.next();
            while (component.bottomImageUrl === 'image-url-mock') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomImageUrl).toEqual('');
            expect(component.contentAnimation).toEqual('animated-up');
        });
    });
});
