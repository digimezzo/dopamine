import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { NowPlayingLyricsComponent } from './now-playing-lyrics.component';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseScheduler } from '../../../common/scheduling/base-scheduler';
import { Observable, Subject } from 'rxjs';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { MockCreator } from '../../../testing/mock-creator';
import { BaseLyricsService } from '../../../services/lyrics/base-lyrics.service';
import { LyricsModel } from '../../../services/lyrics/lyrics-model';
import { LyricsSourceType } from '../../../common/api/lyrics/lyrics-source-type';

describe('NowPlayingLyricsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let lyricsServiceMock: IMock<BaseLyricsService>;
    let schedulerMock: IMock<BaseScheduler>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        lyricsServiceMock = Mock.ofType<BaseLyricsService>();
        schedulerMock = Mock.ofType<BaseScheduler>();

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);
    });

    function createComponent(): NowPlayingLyricsComponent {
        return new NowPlayingLyricsComponent(
            appearanceServiceMock.object,
            playbackServiceMock.object,
            lyricsServiceMock.object,
            schedulerMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const component: NowPlayingLyricsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act
            const component: NowPlayingLyricsComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should set contentAnimation to fade-in', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.contentAnimation).toEqual('fade-in');
        });
    });

    describe('ngOnInit', () => {
        it('should set an empty string as title if PlaybackService has no current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.title).toEqual('');
        });

        it('should set current track title as title if PlaybackService has a current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.title).toEqual('title');
        });

        it('should set an empty string as artists if PlaybackService has no current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.artists).toEqual('');
        });

        it('should set current track artists as artists if PlaybackService has a current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.artists).toEqual('artist1');
        });

        it('should set undefined lyrics if PlaybackService has no current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => undefined);

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.lyrics).toBeUndefined();
        });

        it('should set defined lyrics if PlaybackService has a current track', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);
            const lyricsModelMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            lyricsServiceMock.setup((x) => x.getLyricsAsync(trackModel)).returns(() => Promise.resolve(lyricsModelMock));

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.lyrics!.sourceName).toEqual('online source');
            expect(component.lyrics!.sourceType).toEqual(LyricsSourceType.online);
            expect(component.lyrics!.text).toEqual('online text');
        });
    });

    describe('title', () => {
        it('should return empty string if no playback is started', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.title).toEqual('');
        });

        it('should return track title if playback is started', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel, false);
            playbackServicePlaybackStartedMock.next(playbackStarted);
            await flushPromises();

            // Act
            const title = component.title;

            // Assert
            expect(title).toEqual('title');
        });
    });

    describe('artists', () => {
        it('should return empty string if no playback is started', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.artists).toEqual('');
        });

        it('should return track artists if playback is started', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel, false);
            playbackServicePlaybackStartedMock.next(playbackStarted);
            await flushPromises();

            // Act
            const artists = component.artists;

            // Assert
            expect(artists).toEqual('artist1');
        });
    });

    describe('lyrics', () => {
        it('should return undefined if no playback is started', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.lyrics).toBeUndefined();
        });

        it('should return lyrics if playback is started', async () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel, false);
            const lyricsModelMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            lyricsServiceMock.setup((x) => x.getLyricsAsync(trackModel)).returns(() => Promise.resolve(lyricsModelMock));
            playbackServicePlaybackStartedMock.next(playbackStarted);
            await flushPromises();

            // Act
            const lyrics: LyricsModel | undefined = component.lyrics;

            // Assert
            expect(lyrics!.sourceName).toEqual('online source');
            expect(lyrics!.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics!.text).toEqual('online text');
        });
    });
});
