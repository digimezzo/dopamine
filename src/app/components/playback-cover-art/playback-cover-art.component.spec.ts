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

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        schedulerMock = Mock.ofType<Scheduler>();

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        component = new PlaybackCoverArtComponent(playbackServiceMock.object, metadataServiceMock.object, schedulerMock.object);

        playbackServicePlaybackStarted = new Subject();
        const playbackServicePlaybackStarted$: Observable<PlaybackStarted> = playbackServicePlaybackStarted.asObservable();

        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);
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
        it('should subscribe to playbackService.playbackStarted, set bottom image URL and animate up when playing a next track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);
            const scheduler: Scheduler = new Scheduler();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(It.isAny())).returns(async () => 'image-url-mock');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, false));

            while (component.bottomImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackService.playbackStarted, set top image URL and animate up when playing a previous track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);
            const scheduler: Scheduler = new Scheduler();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(It.isAny())).returns(async () => 'image-url-mock');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, true));

            while (component.topImageUrl === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should set top image URL and go down without animation if there is a current track playing', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
            metadataServiceMock.setup((x) => x.createImageUrlAsync(It.isAny())).returns(async () => 'image-url-mock');

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topImageUrl).toEqual('image-url-mock');
            expect(component.contentAnimation).toEqual('down');
        });
    });
});
