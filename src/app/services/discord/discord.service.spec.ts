import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { DateProxy } from '../../common/io/date-proxy';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackProgress } from '../playback/playback-progress';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { DiscordService } from './discord.service';
import { PresenceUpdater } from './presence-updater';

describe('DiscordService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let presenceUpdaterMock: IMock<PresenceUpdater>;
    let dateProxyMock: IMock<DateProxy>;
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;
    let playbackServicePlaybackPausedMock: Subject<void>;
    let playbackServicePlaybackResumedMock: Subject<void>;
    let playbackServicePlaybackSkippedMock: Subject<void>;

    let trackModel: TrackModel;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        presenceUpdaterMock = Mock.ofType<PresenceUpdater>();
        dateProxyMock = Mock.ofType<DateProxy>();
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();

        translatorServiceMock.setup((x) => x.get('playing')).returns(() => 'Playing');
        translatorServiceMock.setup((x) => x.get('paused')).returns(() => 'Paused');
        translatorServiceMock.setup((x) => x.get('playing-with-dopamine')).returns(() => 'Playing with Dopamine');

        const track: Track = new Track('path');
        track.trackTitle = 'title';
        track.artists = ';artist1;;artist2';
        trackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
        track.duration = 200000;

        dateProxyMock.setup((x) => x.now()).returns(() => 10);
    });

    function setUpPlaybackServiceMock(isPlaying: boolean, canPause: boolean): void {
        playbackServicePlaybackStartedMock = new Subject();
        const playbackServicePlaybackStartedMock$: Observable<PlaybackStarted> = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStartedMock$);

        playbackServicePlaybackStoppedMock = new Subject();
        const playbackServicePlaybackStoppedMock$: Observable<void> = playbackServicePlaybackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackServicePlaybackStoppedMock$);

        playbackServicePlaybackPausedMock = new Subject();
        const playbackServicePlaybackPausedMock$: Observable<void> = playbackServicePlaybackPausedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackPaused$).returns(() => playbackServicePlaybackPausedMock$);

        playbackServicePlaybackResumedMock = new Subject();
        const playbackServicePlaybackResumedMock$: Observable<void> = playbackServicePlaybackResumedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackResumed$).returns(() => playbackServicePlaybackResumedMock$);

        playbackServicePlaybackSkippedMock = new Subject();
        const playbackServicePlaybackSkippedMock$: Observable<void> = playbackServicePlaybackSkippedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackSkipped$).returns(() => playbackServicePlaybackSkippedMock$);

        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel);

        const progress: PlaybackProgress = new PlaybackProgress(20, 120);
        playbackServiceMock.setup((x) => x.progress).returns(() => progress);

        playbackServiceMock.setup((x) => x.isPlaying).returns(() => isPlaying);
        playbackServiceMock.setup((x) => x.canPause).returns(() => canPause);
    }

    function createDiscordService(): DiscordService {
        return new DiscordService(
            playbackServiceMock.object,
            translatorServiceMock.object,
            presenceUpdaterMock.object,
            dateProxyMock.object,
            settingsMock.object,
            loggerMock.object
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: DiscordService = createDiscordService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('setRichPresenceFromSettings', () => {
        it('should clear Discord presence if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });

        it('should set Discord presence to "Playing" if a track is already playing and Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(true, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track starts playing and Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel, false));

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Paused" after a track is paused and Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'pause', 'Paused', 'icon', 'Playing with Dopamine', false, 0, 0),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track is resumed and Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track is skipped and Discord Rich Presence is enabled and playbackService can pause', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Paused" after a track is skipped and Discord Rich Presence is enabled and playbackService cannot pause', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'pause', 'Paused', 'icon', 'Playing with Dopamine', false, 0, 0),
                Times.once()
            );
        });

        it('should clear Discord presence after a track is stopped and Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });

        it('should not set Discord presence after a track starts playing and Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(
                new PlaybackStarted(new TrackModel(new Track('Path1'), dateTimeMock.object, translatorServiceMock.object), false)
            );

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Paused" after a track is paused and Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is resumed and Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is skipped and Discord Rich Presence is disabled and playbackService can pause', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is skipped and Discord Rich Presence is disabled and playbackService cannot pause', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not clear Discord presence after a track is stopped and Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.never());
        });
    });

    describe('setRichPresence', () => {
        it('should clear Discord presence if enableRichPresence is false', () => {
            // Arrange
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });

        it('should set Discord presence to "Playing" if a track is already playing and enableRichPresence is true', () => {
            // Arrange
            setUpPlaybackServiceMock(true, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track starts playing and enableRichPresence is true', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(new PlaybackStarted(trackModel, false));

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Paused" after a track is paused and enableRichPresence is true', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'pause', 'Paused', 'icon', 'Playing with Dopamine', false, 0, 0),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track is resumed and enableRichPresence is true', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Playing" after a track is skipped and enableRichPresence is true and playbackService can pause', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'play', 'Playing', 'icon', 'Playing with Dopamine', true, 10, 100010),
                Times.once()
            );
        });

        it('should set Discord presence to "Paused" after a track is skipped and enableRichPresence is true and playbackService cannot pause', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) => x.updatePresence('title', 'artist1, artist2', 'pause', 'Paused', 'icon', 'Playing with Dopamine', false, 0, 0),
                Times.once()
            );
        });

        it('should clear Discord presence after a track is stopped and enableRichPresence is true', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(true);
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });

        it('should not set Discord presence after a track starts playing and enableRichPresence is false', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(
                new PlaybackStarted(new TrackModel(new Track('Path1'), dateTimeMock.object, translatorServiceMock.object), false)
            );

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Paused" after a track is paused and enableRichPresence is false', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is resumed and enableRichPresence is false', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is skipped and enableRichPresence is false and playbackService can pause', () => {
            // Arrange
            setUpPlaybackServiceMock(false, true);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not set Discord presence to "Playing" after a track is skipped and enableRichPresence is false and playbackService cannot pause', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackSkippedMock.next();

            // Assert
            presenceUpdaterMock.verify(
                (x) =>
                    x.updatePresence(
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny(),
                        It.isAny()
                    ),
                Times.never()
            );
        });

        it('should not clear Discord presence after a track is stopped and enableRichPresence is false', () => {
            // Arrange
            setUpPlaybackServiceMock(false, false);
            const service: DiscordService = createDiscordService();

            // Act
            service.setRichPresence(false);
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.never());
        });
    });
});
