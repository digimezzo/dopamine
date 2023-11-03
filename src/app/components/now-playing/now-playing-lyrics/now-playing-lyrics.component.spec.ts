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
import { BasePlaybackInformationService } from '../../../services/playback-information/base-playback-information.service';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';

describe('NowPlayingLyricsComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let playbackInformationServiceMock: IMock<BasePlaybackInformationService>;
    let lyricsServiceMock: IMock<BaseLyricsService>;
    let schedulerMock: IMock<BaseScheduler>;

    let playbackInformationService_playingNextTrack_Mock: Subject<PlaybackInformation>;
    let playbackInformationService_playingPreviousTrack_Mock: Subject<PlaybackInformation>;
    let playbackInformationService_playingNoTrack_Mock: Subject<PlaybackInformation>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        playbackInformationServiceMock = Mock.ofType<BasePlaybackInformationService>();
        lyricsServiceMock = Mock.ofType<BaseLyricsService>();
        schedulerMock = Mock.ofType<BaseScheduler>();

        playbackInformationService_playingNextTrack_Mock = new Subject();
        playbackInformationService_playingPreviousTrack_Mock = new Subject();
        playbackInformationService_playingNoTrack_Mock = new Subject();

        const playbackInformationService_playingNextTrack_Mock$: Observable<PlaybackInformation> =
            playbackInformationService_playingNextTrack_Mock.asObservable();
        const playbackInformationService_playingPreviousTrack_Mock$: Observable<PlaybackInformation> =
            playbackInformationService_playingPreviousTrack_Mock.asObservable();
        const playbackInformationService_playingNoTrack_Mock$: Observable<PlaybackInformation> =
            playbackInformationService_playingNoTrack_Mock.asObservable();

        playbackInformationServiceMock.setup((x) => x.playingNextTrack$).returns(() => playbackInformationService_playingNextTrack_Mock$);
        playbackInformationServiceMock
            .setup((x) => x.playingPreviousTrack$)
            .returns(() => playbackInformationService_playingPreviousTrack_Mock$);
        playbackInformationServiceMock.setup((x) => x.playingNoTrack$).returns(() => playbackInformationService_playingNoTrack_Mock$);
    });

    function createComponent(): NowPlayingLyricsComponent {
        return new NowPlayingLyricsComponent(
            appearanceServiceMock.object,
            playbackInformationServiceMock.object,
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

        it('should define lyricsSourceTypeEnum', () => {
            // Arrange

            // Act
            const component: NowPlayingLyricsComponent = createComponent();

            // Assert
            expect(component.lyricsSourceTypeEnum).toBeDefined();
        });

        it('should set contentAnimation to fade-in', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.contentAnimation).toEqual('fade-in');
        });
    });

    describe('ngOnInit', () => {
        it('should set undefined lyrics if PlaybackService has no current track', async () => {
            // Arrange

            const playbackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(playbackInformation));
            const component: NowPlayingLyricsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.lyrics).toBeUndefined();
        });

        it('should set defined lyrics if PlaybackService has a current track', async () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const playbackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(playbackInformation));
            const lyricsModelMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            lyricsServiceMock.setup((x) => x.getLyricsAsync(trackModel)).returns(() => Promise.resolve(lyricsModelMock));
            const component: NowPlayingLyricsComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.lyrics!.sourceName).toEqual('online source');
            expect(component.lyrics!.sourceType).toEqual(LyricsSourceType.online);
            expect(component.lyrics!.text).toEqual('online text');
        });
    });

    describe('lyrics', () => {
        it('should return undefined if no playback is started', () => {
            // Arrange
            const component: NowPlayingLyricsComponent = createComponent();

            // Act, Assert
            expect(component.lyrics).toBeUndefined();
        });

        it('should return lyrics if playing next track', async () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const lyricsModelMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            lyricsServiceMock.setup((x) => x.getLyricsAsync(trackModel)).returns(() => Promise.resolve(lyricsModelMock));

            const emptyCurrentPlaybackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(emptyCurrentPlaybackInformation));

            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();

            const playbackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationService_playingNextTrack_Mock.next(playbackInformation);
            await flushPromises();

            // Act
            const lyrics: LyricsModel | undefined = component.lyrics;

            // Assert
            expect(lyrics!.sourceName).toEqual('online source');
            expect(lyrics!.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics!.text).toEqual('online text');
        });

        it('should return lyrics if playing previous track', async () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const lyricsModelMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            lyricsServiceMock.setup((x) => x.getLyricsAsync(trackModel)).returns(() => Promise.resolve(lyricsModelMock));

            const emptyCurrentPlaybackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(emptyCurrentPlaybackInformation));

            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();

            const playbackInformation: PlaybackInformation = new PlaybackInformation(trackModel, 'imageUrl');
            playbackInformationService_playingPreviousTrack_Mock.next(playbackInformation);
            await flushPromises();

            // Act
            const lyrics: LyricsModel | undefined = component.lyrics;

            // Assert
            expect(lyrics!.sourceName).toEqual('online source');
            expect(lyrics!.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics!.text).toEqual('online text');
        });

        it('should return undefined lyrics if playing no track', async () => {
            // Arrange
            const trackModel: TrackModel = MockCreator.createTrackModel('path1', 'title', ';artist1;');
            const emptyCurrentPlaybackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationServiceMock
                .setup((x) => x.getCurrentPlaybackInformationAsync())
                .returns(() => Promise.resolve(emptyCurrentPlaybackInformation));

            const component: NowPlayingLyricsComponent = createComponent();
            await component.ngOnInit();

            const playbackInformation: PlaybackInformation = new PlaybackInformation(undefined, '');
            playbackInformationService_playingNoTrack_Mock.next(playbackInformation);
            await flushPromises();

            // Act
            const lyrics: LyricsModel | undefined = component.lyrics;

            // Assert
            expect(lyrics).toBeUndefined();
        });
    });
});
