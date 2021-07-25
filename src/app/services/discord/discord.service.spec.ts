import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseSettings } from '../../common/settings/base-settings';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { DiscordService } from './discord.service';
import { PresenceUpdater } from './presence-updater';

describe('DiscordService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let settingsMock: IMock<BaseSettings>;
    let presenceUpdaterMock: IMock<PresenceUpdater>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStoppedMock: Subject<void>;
    let playbackServicePlaybackPausedMock: Subject<void>;
    let playbackServicePlaybackResumedMock: Subject<void>;

    let service: DiscordService;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        settingsMock = Mock.ofType<BaseSettings>();
        presenceUpdaterMock = Mock.ofType<PresenceUpdater>();

        settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);
        translatorServiceMock.setup((x) => x.get('playing')).returns(() => 'Playing');
        translatorServiceMock.setup((x) => x.get('paused')).returns(() => 'Paused');
        translatorServiceMock.setup((x) => x.get('playing-with-dopamine')).returns(() => 'Playing with Dopamine');

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

        service = new DiscordService(
            playbackServiceMock.object,
            translatorServiceMock.object,
            presenceUpdaterMock.object,
            settingsMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('enableRichPresence', () => {
        it('should enable rich presence if the settings require it', () => {
            // Arrange
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should set Discord presence to "Playing" if a track is already playing and if Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.once());
        });

        it('should set Discord presence to "Playing" after a track starts playing and if Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(
                new PlaybackStarted(new TrackModel(new Track('Path1'), translatorServiceMock.object), false)
            );

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.once());
        });

        it('should set Discord presence to "Paused" after a track is paused and if Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('pause', 'Paused', 'icon', 'Playing with Dopamine'), Times.once());
        });

        it('should set Discord presence to "Playing" after a track is resumed and if Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.once());
        });

        it('should clear Discord presence after a track is stopped and if Discord Rich Presence is enabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });

        it('should not set Discord presence to "Playing" after a track starts playing and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStartedMock.next(
                new PlaybackStarted(new TrackModel(new Track('Path1'), translatorServiceMock.object), false)
            );

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should not set Discord presence to "Paused" after a track is paused and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('pause', 'Paused', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should not set Discord presence to "Playing" after a track is resumed and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should not clear Discord presence after a track is stopped and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();

            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.never());
        });

        it('should disable setting Discord presence to "Playing" after a track starts playing and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            service.setRichPresenceFromSettings();
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();
            playbackServicePlaybackStartedMock.next(
                new PlaybackStarted(new TrackModel(new Track('Path1'), translatorServiceMock.object), false)
            );

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should disable setting Discord presence to "Paused" after a track is paused and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            service.setRichPresenceFromSettings();
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();
            playbackServicePlaybackPausedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('pause', 'Paused', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should disable setting Discord presence to "Playing" after a track is resumed and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            service.setRichPresenceFromSettings();
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();
            playbackServicePlaybackResumedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.updatePresence('play', 'Playing', 'icon', 'Playing with Dopamine'), Times.never());
        });

        it('should disable clearing of Discord presence after a track is stopped and if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            service.setRichPresenceFromSettings();
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            // Act
            service.setRichPresenceFromSettings();
            presenceUpdaterMock.reset();
            playbackServicePlaybackStoppedMock.next();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.never());
        });

        it('should clear Discord presence if Discord Rich Presence is disabled', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => true);

            service = new DiscordService(
                playbackServiceMock.object,
                translatorServiceMock.object,
                presenceUpdaterMock.object,
                settingsMock.object
            );

            service.setRichPresenceFromSettings();
            settingsMock.reset();
            settingsMock.setup((x) => x.enableDiscordRichPresence).returns(() => false);

            // Act
            service.setRichPresenceFromSettings();

            // Assert
            presenceUpdaterMock.verify((x) => x.clearPresence(), Times.once());
        });
    });
});
