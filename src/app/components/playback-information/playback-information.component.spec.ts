import { Observable, Subject } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Scheduler } from '../../core/scheduler/scheduler';
import { Track } from '../../data/entities/track';
import { FormatTrackArtistsPipe } from '../../pipes/format-track-artists.pipe';
import { FormatTrackTitlePipe } from '../../pipes/format-track-title.pipe';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';
import { PlaybackInformationComponent } from './playback-information.component';

describe('PlaybackInformationComponent', () => {
    let component: PlaybackInformationComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let formatTrackArtistsPipeMock: IMock<FormatTrackArtistsPipe>;
    let formatTrackTitlePipeMock: IMock<FormatTrackTitlePipe>;
    let schedulerMock: IMock<Scheduler>;

    let playbackServicePlaybackStarted: Subject<PlaybackStarted>;

    beforeEach(async () => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        formatTrackArtistsPipeMock = Mock.ofType<FormatTrackArtistsPipe>();
        formatTrackTitlePipeMock = Mock.ofType<FormatTrackTitlePipe>();
        schedulerMock = Mock.ofType<Scheduler>();

        component = new PlaybackInformationComponent(
            playbackServiceMock.object,
            formatTrackArtistsPipeMock.object,
            formatTrackTitlePipeMock.object,
            schedulerMock.object
        );

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

        it('should initialize topContentArtist as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topContentArtist).toEqual('');
        });

        it('should initialize topContentTitle as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.topContentTitle).toEqual('');
        });

        it('should initialize bottomContentArtist as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomContentArtist).toEqual('');
        });

        it('should initialize bottomContentTitle as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.bottomContentTitle).toEqual('');
        });
    });

    describe('ngOnInit', () => {
        it('should subscribe to playbackService.playbackStarted, set bottom content items and animate up when playing a next track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1);
            const scheduler: Scheduler = new Scheduler();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, false));

            while (component.bottomContentArtist === '' || component.bottomContentTitle === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.bottomContentArtist).toEqual('My artist');
            expect(component.bottomContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-up');
        });

        it('should subscribe to playbackService.playbackStarted, set top content items and animate down when playing a previous track', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1);
            const scheduler: Scheduler = new Scheduler();

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            playbackServicePlaybackStarted.next(new PlaybackStarted(trackModel1, true));

            while (component.topContentArtist === '' || component.topContentTitle === '') {
                await scheduler.sleepAsync(10);
            }

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('animated-down');
        });

        it('should set top content items and go down without animation if there is a current track playing', async () => {
            // Arrange
            const track1: Track = new Track('/home/user/Music/track1.mp3');
            track1.artists = 'My artist';
            track1.trackTitle = 'My title';
            const trackModel1: TrackModel = new TrackModel(track1);

            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);

            formatTrackArtistsPipeMock.setup((x) => x.transform(trackModel1.artists)).returns(() => 'My artist');
            formatTrackTitlePipeMock.setup((x) => x.transform(trackModel1.title, undefined)).returns(() => 'My title');

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.topContentArtist).toEqual('My artist');
            expect(component.topContentTitle).toEqual('My title');
            expect(component.contentAnimation).toEqual('down');
        });
    });
});
