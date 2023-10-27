import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { NowPlayingLyricsComponent } from './now-playing-lyrics.component';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { BaseScheduler } from '../../../common/scheduling/base-scheduler';
import { Observable, Subject } from 'rxjs';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { MockCreator } from '../../../testing/mock-creator';

describe('NowPlayingLyricsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let schedulerMock: IMock<BaseScheduler>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        schedulerMock = Mock.ofType<BaseScheduler>();

        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);
    });

    function createComponent(): NowPlayingLyricsComponent {
        return new NowPlayingLyricsComponent(appearanceServiceMock.object, playbackServiceMock.object, schedulerMock.object);
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

            // Act, Assert
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

            // Act, Assert
            expect(artists).toEqual('artist1');
        });
    });
});
