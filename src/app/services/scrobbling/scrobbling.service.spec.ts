import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { LastfmApi } from '../../common/api/lastfm/lastfm-api';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackProgress } from '../playback/playback-progress';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseScrobblingService } from './base-scrobbling.service';
import { ScrobblingService } from './scrobbling.service';
import { SignInState } from './sign-in-state';

describe('ScrobblingService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let lastfmApiMock: IMock<LastfmApi>;
    let dateTimeMock: IMock<DateTime>;
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;

    let translatorServiceMock: IMock<BaseTranslatorService>;

    let playbackService_playbackStarted: Subject<PlaybackStarted>;
    let playbackService_playbackStarted$: Observable<PlaybackStarted>;

    let playbackService_progressChanged: Subject<PlaybackProgress>;
    let playbackService_progressChanged$: Observable<PlaybackProgress>;

    let playbackService_playbackSkipped: Subject<void>;
    let playbackService_playbackSkipped$: Observable<void>;

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        dateTimeMock = Mock.ofType<DateTime>();
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

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

    function createService(): BaseScrobblingService {
        return new ScrobblingService(
            playbackServiceMock.object,
            lastfmApiMock.object,
            dateTimeMock.object,
            settingsMock.object,
            loggerMock.object
        );
    }

    function createSettingsMock(
        enableLastFmScrobbling: boolean,
        lastFmUsername: string,
        lastFmPassword: string,
        lastFmSessionKey: string
    ): IMock<BaseSettings> {
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
        durationInMilliseconds: number
    ): TrackModel {
        const track: Track = new Track(path);
        track.artists = artists;
        track.trackTitle = title;
        track.albumTitle = albumTitle;
        track.duration = durationInMilliseconds;

        return new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should set username from settings if Last.fm scrobbling is enabled', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.username).toEqual('user');
        });

        it('should set password from settings if Last.fm scrobbling is enabled', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.password).toEqual('password');
        });

        it('should not set username from settings if Last.fm scrobbling is disabled', () => {
            // Arrange
            createSettingsMock(false, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.username).toEqual('');
        });

        it('should not set password from settings if Last.fm scrobbling is disabled', () => {
            // Arrange
            createSettingsMock(false, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.password).toEqual('');
        });

        it('should set SignInState to SignedOut if Last.fm scrobbling is disabled', () => {
            // Arrange
            createSettingsMock(false, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.signInState).toEqual(SignInState.SignedOut);
        });

        it('should set SignInState to SignedIn if Last.fm scrobbling is enabled and lastFmUsername, lastFmPassword and lastFmSessionKey are set in the settings', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.signInState).toEqual(SignInState.SignedIn);
        });

        it('should set SignInState to SignedOut if Last.fm scrobbling is enabled and lastFmUsername is not set in the settings', () => {
            // Arrange
            createSettingsMock(true, '', 'password', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.signInState).toEqual(SignInState.SignedOut);
        });

        it('should set SignInState to SignedOut if Last.fm scrobbling is enabled and lastFmPassword is not set in the settings', () => {
            // Arrange
            createSettingsMock(true, 'user', '', 'key');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.signInState).toEqual(SignInState.SignedOut);
        });

        it('should set SignInState to SignedOut if Last.fm scrobbling is enabled and lastFmSessionKey is not set in the settings', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', '');

            // Act
            const service: BaseScrobblingService = createService();

            // Assert
            expect(service.signInState).toEqual(SignInState.SignedOut);
        });
    });

    describe('PlaybackService.playbackStarted', () => {
        it('should update Last.fm now playing when signed in to Last.fm and artist and title are known', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1'), Times.once());
        });

        it('should not update Last.fm now playing when not signed in to Last.fm', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(false, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1'), Times.never());
        });

        it('should not update Last.fm now playing when artist is unknown', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1'), Times.never());
        });

        it('should not update Last.fm now playing when title is unknown', async () => {
            // Arrange
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', '', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);

            // Act
            playbackService_playbackStarted.next(playbackStarted);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1'), Times.never());
        });
    });

    describe('PlaybackService.progressChanged', () => {
        it('Should scrobble when the track is longer than 30 seconds has been played for at least half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.once()
            );
        });

        it('Should scrobble when the track is longer than 30 seconds has been played for 4 minutes even if it did not play for half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 900000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(300, 900);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.once()
            );
        });

        it('Should not scrobble when the track is shorter than than 30 seconds even if it has been played for at least half its duration', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 20000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(15, 20);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });

        it('Should not scrobble when after playback has been skipped even if scrobble conditions are met', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_playbackSkipped.next();
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });

        it('Should not scrobble when not signed in to Last.fm even if scrobble conditions are met', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(false, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });

        it('Should not scrobble when there is no current track', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });

        it('Should not scrobble when artist is unknown', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });

        it('Should not scrobble when title is unknown', async () => {
            // Arrange
            const currentTrackUTCStartTime: Date = new Date(2022, 11, 28, 9, 47, 0);
            dateTimeMock.setup((x) => x.getUTCDate(It.isAny())).returns(() => currentTrackUTCStartTime);
            lastfmApiMock.setup((x) => x.updateTrackNowPlayingAsync('key', 'artist1', 'title1', 'albumTitle1')).returns(async () => true);
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1;', '', 'albumTitle1', 300000);
            const playbackStarted: PlaybackStarted = new PlaybackStarted(trackModel1, false);
            playbackService_playbackStarted.next(playbackStarted);
            const playbackProgress: PlaybackProgress = new PlaybackProgress(200, 300);

            // Act
            playbackService_progressChanged.next(playbackProgress);
            await flushPromises();

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('key', 'artist1', 'title1', 'albumTitle1', currentTrackUTCStartTime),
                Times.never()
            );
        });
    });

    describe('sendTrackLoveAsync', () => {
        it('should not send track love/unlove when not signed in', () => {
            // Arrange
            createSettingsMock(false, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', 'title1', 'albumTitle1', 300000);

            // Act
            service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
            lastfmApiMock.verify((x) => x.unloveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not send track love/unlove for an unknown track title', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', '', 'albumTitle1', 300000);

            // Act
            service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
            lastfmApiMock.verify((x) => x.unloveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not send track love/unlove for unknown artists', () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', '', 'title1', 'albumTitle1', 300000);

            // Act
            service.sendTrackLoveAsync(trackModel1, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
            lastfmApiMock.verify((x) => x.unloveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should send track love for all artists', async () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', 'title1', 'albumTitle1', 300000);

            // Act
            service.sendTrackLoveAsync(trackModel1, true);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync('key', 'artist1a', 'title1'), Times.once());
            lastfmApiMock.verify((x) => x.loveTrackAsync('key', 'artist1b', 'title1'), Times.once());
        });

        it('should send track unlove for all artists', async () => {
            // Arrange
            createSettingsMock(true, 'user', 'password', 'key');
            const service: BaseScrobblingService = createService();
            const trackModel1: TrackModel = createTrackModel('path1', ';artist1a;;artist1b;', 'title1', 'albumTitle1', 300000);

            // Act
            service.sendTrackLoveAsync(trackModel1, false);
            await flushPromises();

            // Assert
            lastfmApiMock.verify((x) => x.unloveTrackAsync('key', 'artist1a', 'title1'), Times.once());
            lastfmApiMock.verify((x) => x.unloveTrackAsync('key', 'artist1b', 'title1'), Times.once());
        });
    });
});
