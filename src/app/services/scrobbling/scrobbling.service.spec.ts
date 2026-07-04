import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { PlaybackProgress } from '../playback/playback-progress';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { SignInState } from './sign-in-state';
import { PlaybackService } from '../playback/playback.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { ScrobblingService } from './scrobbling.service';
import { Track } from '../../data/entities/track';
import { ListenbrainzProvider } from './listenbrainz.provider';
import { LastfmProvider } from './lastfm.provider';

describe('ScrobblingService', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let lastfmProviderMock: IMock<LastfmProvider>;
    let listenbrainzProviderMock: IMock<ListenbrainzProvider>;
    let dateTimeMock: IMock<DateTime>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;

    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let playbackService_playbackStarted: Subject<PlaybackStarted>;
    let playbackService_playbackStarted$: Observable<PlaybackStarted>;

    let playbackService_progressChanged: Subject<PlaybackProgress>;
    let playbackService_progressChanged$: Observable<PlaybackProgress>;

    let playbackService_playbackSkipped: Subject<void>;
    let playbackService_playbackSkipped$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        lastfmProviderMock = Mock.ofType<LastfmProvider>();
        listenbrainzProviderMock = Mock.ofType<ListenbrainzProvider>();
        dateTimeMock = Mock.ofType<DateTime>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();

        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => new Date(2022, 11, 28, 9, 47, 0));

        playbackService_playbackStarted = new Subject();
        playbackService_playbackStarted$ = playbackService_playbackStarted.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackService_playbackStarted$);

        playbackService_progressChanged = new Subject();
        playbackService_progressChanged$ = playbackService_progressChanged.asObservable();
        playbackServiceMock.setup((x) => x.progressChanged$).returns(() => playbackService_progressChanged$);

        playbackService_playbackSkipped = new Subject();
        playbackService_playbackSkipped$ = playbackService_playbackSkipped.asObservable();
        playbackServiceMock.setup((x) => x.playbackSkipped$).returns(() => playbackService_playbackSkipped$);
    });

    function createService(): ScrobblingService {
        return new ScrobblingService(
            playbackServiceMock.object,
            dateTimeMock.object,
            settingsMock.object,
            loggerMock.object,
            lastfmProviderMock.object,
            listenbrainzProviderMock.object,
        );
    }

    function createSettingsMock(
        enableLastFmScrobbling: boolean,
        lastFmUsername: string,
        lastFmPassword: string,
        lastFmSessionKey: string,
    ): IMock<SettingsBase> {
        settingsMock.setup((x) => x.enableLastFmScrobbling).returns(() => enableLastFmScrobbling);
        settingsMock.setup((x) => x.lastFmUsername).returns(() => lastFmUsername);
        settingsMock.setup((x) => x.lastFmPassword).returns(() => lastFmPassword);
        settingsMock.setup((x) => x.lastFmSessionKey).returns(() => lastFmSessionKey);

        return settingsMock;
    }

    function createTrackModel(
        path: string,
        artists: string,
        title: string,
        albumTitle: string,
        durationInMilliseconds: number,
    ): TrackModel {
        const track: Track = new Track(path);
        track.artists = artists;
        track.trackTitle = title;
        track.albumTitle = albumTitle;
        track.duration = durationInMilliseconds;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, '');
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: ScrobblingService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('initialize', () => {
        it('should initialize all registered providers', () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.initialize()).verifiable(Times.once());
            listenbrainzProviderMock.setup((x) => x.initialize()).verifiable(Times.once());

            const service: ScrobblingService = createService();

            // Act
            service.initialize();

            // Assert
            lastfmProviderMock.verifyAll();
            listenbrainzProviderMock.verifyAll();
        });
    });

    describe('PlaybackService.playbackStarted', () => {
        it('should update now playing for signed in providers when artist and title are known', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());
            listenbrainzProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.once());
            listenbrainzProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.once());
        });

        it('should not update now playing for signed out providers when artist and title are known', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            lastfmProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());
            listenbrainzProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
        });

        it('should not update now playing for providers when artist is unknown', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());
            listenbrainzProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
        });

        it('should not update now playing when title is unknown', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());
            listenbrainzProviderMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', '', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.updateNowPlayingAsync(It.isAny()), Times.never());
        });
    });

    describe('PlaybackService.progressChanged', () => {
        it('Should scrobble when the track is longer than 30 seconds and has been played for at least half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));

            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.once());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.once());
        });

        it('Should not scrobble when the track is longer than 4 minutes and has been played for less than 4 minutes', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 900000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(150, 900);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should scrobble when the track is longer than 30 seconds and has been played for 4 minutes even if it did not play for half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 900000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(300, 900);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.once());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.once());
        });

        it('Should not scrobble when the track is shorter than than 30 seconds even if it has been played for at least half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 20000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(15, 20);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should not scrobble when after playback has been skipped even if scrobble conditions are met', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_playbackSkipped.next();
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should not scrobble when not signed in to providers even if scrobble conditions are met', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should not scrobble when there is no current track', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should not scrobble when artist is unknown', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('Should not scrobble when title is unknown', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            lastfmProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            listenbrainzProviderMock.setup((x) => x.scrobbleAsync(It.isAny(), It.isAny())).returns(() => Promise.resolve(true));
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', '', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.scrobbleAsync(It.isAny(), It.isAny()), Times.never());
        });
    });

    describe('sendTrackLoveAsync', () => {
        it('should not send track love/unlove when not signed in', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', 'title1', 'albumTitle1', 300000);

            // Act
            await service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should not send track love/unlove for an unknown track title', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', '', 'albumTitle1', 300000);

            // Act
            await service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
        });

        it('should not send track love/unlove for unknown artists', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const service: ScrobblingService = createService();
            service.initialize();

            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);

            // Act
            await service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
            listenbrainzProviderMock.verify((x) => x.sendTrackLoveAsync(It.isAny(), It.isAny()), Times.never());
        });
    });
});
