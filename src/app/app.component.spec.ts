import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from './app.component';
import { Logger } from './common/logger';
import { IntegrationTestRunner } from './testing/integration-test-runner';
import { EventListenerServiceBase } from './services/event-listener/event-listener.service.base';
import { MediaSessionService } from './services/media-session/media-session.service';
import { TrayServiceBase } from './services/tray/tray.service.base';
import { ScrobblingServiceBase } from './services/scrobbling/scrobbling.service.base';
import { DiscordService } from './services/discord/discord.service';
import { TranslatorServiceBase } from './services/translator/translator.service.base';
import { AppearanceServiceBase } from './services/appearance/appearance.service.base';
import { NavigationServiceBase } from './services/navigation/navigation.service.base';
import { AddToPlaylistMenu } from './ui/components/add-to-playlist-menu';
import { DesktopBase } from './common/io/desktop.base';
import { AudioVisualizer } from './services/playback/audio-visualizer';
import { LifetimeService } from './services/lifetime/lifetime.service';
import { SwitchPlayerService } from './services/player-switcher/switch-player.service';
import { PlaybackService } from './services/playback/playback.service';

describe('AppComponent', () => {
    let playerSwitcherServiceMock: IMock<SwitchPlayerService>;
    let playbackServiceMock: IMock<PlaybackService>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let discordServiceMock: IMock<DiscordService>;
    let scrobblingServiceMock: IMock<ScrobblingServiceBase>;
    let trayServiceMock: IMock<TrayServiceBase>;
    let mediaSessionServiceMock: IMock<MediaSessionService>;
    let eventListenerServiceMock: IMock<EventListenerServiceBase>;
    let lifetimeServiceMock: IMock<LifetimeService>;
    let audioVisualizerMock: IMock<AudioVisualizer>;

    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let desktopMock: IMock<DesktopBase>;
    let loggerMock: IMock<Logger>;
    let matDrawerMock: IMock<MatDrawer>;

    let integrationTestRunnerMock: IMock<IntegrationTestRunner>;

    let showNowPlayingRequestedMock: Subject<void>;
    let showNowPlayingRequestedMock$: Observable<void>;

    function createComponent(): AppComponent {
        return new AppComponent(
            playbackServiceMock.object,
            navigationServiceMock.object,
            appearanceServiceMock.object,
            translatorServiceMock.object,
            discordServiceMock.object,
            scrobblingServiceMock.object,
            trayServiceMock.object,
            mediaSessionServiceMock.object,
            eventListenerServiceMock.object,
            lifetimeServiceMock.object,
            addToPlaylistMenuMock.object,
            desktopMock.object,
            loggerMock.object,
            audioVisualizerMock.object,
            integrationTestRunnerMock.object,
        );
    }

    beforeEach(() => {
        playerSwitcherServiceMock = Mock.ofType<SwitchPlayerService>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        discordServiceMock = Mock.ofType<DiscordService>();
        scrobblingServiceMock = Mock.ofType<ScrobblingServiceBase>();
        trayServiceMock = Mock.ofType<TrayServiceBase>();
        mediaSessionServiceMock = Mock.ofType<MediaSessionService>();
        eventListenerServiceMock = Mock.ofType<EventListenerServiceBase>();
        lifetimeServiceMock = Mock.ofType<LifetimeService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        desktopMock = Mock.ofType<DesktopBase>();
        loggerMock = Mock.ofType<Logger>();
        matDrawerMock = Mock.ofType<MatDrawer>();
        integrationTestRunnerMock = Mock.ofType<IntegrationTestRunner>();
        audioVisualizerMock = Mock.ofType<AudioVisualizer>();

        showNowPlayingRequestedMock = new Subject();
        showNowPlayingRequestedMock$ = showNowPlayingRequestedMock.asObservable();

        navigationServiceMock.setup((x) => x.showPlaybackQueueRequested$).returns(() => showNowPlayingRequestedMock$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const app: AppComponent = createComponent();

            // Assert
            expect(app).toBeDefined();
        });

        it('should declare but not define drawer', () => {
            // Arrange

            // Act
            const app: AppComponent = createComponent();

            // Assert
            expect(app.playbackQueueDrawer).toBeUndefined();
        });

        it('should define LifetimeService', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            expect(app.lifetimeService).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should initialize playlist context menu', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            addToPlaylistMenuMock.verify((x) => x.initializeAsync(), Times.once());
        });

        it('should apply appearance', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyAppearanceAsync(), Times.once());
        });

        it('should apply language', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguage(), Times.once());
        });

        it('should update tray context menu', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            trayServiceMock.verify((x) => x.updateTrayContextMenu(), Times.once());
        });

        it('should navigate to loading', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoadingAsync(), Times.once());
        });

        it('should initialize Discord', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            discordServiceMock.verify((x) => x.initialize(), Times.once());
        });

        it('should toggle the drawer on showNowPlayingRequested when it is not undefined', async () => {
            // Arrange
            const app: AppComponent = createComponent();
            app.playbackQueueDrawer = matDrawerMock.object;

            // Act
            await app.ngOnInit();
            showNowPlayingRequestedMock.next();

            // Assert
            matDrawerMock.verify((x) => x.toggle(), Times.exactly(1));
        });

        it('should initialize MediaSessionService', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            mediaSessionServiceMock.verify((x) => x.initialize(), Times.once());
        });

        it('should initialize ScrobblingService', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            scrobblingServiceMock.verify((x) => x.initialize(), Times.once());
        });

        it('should initialize PlaybackService', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            playbackServiceMock.verify((x) => x.initializeAsync(), Times.once());
        });

        it('should initialize LifetimeService', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            lifetimeServiceMock.verify((x) => x.initialize(), Times.once());
        });

        it('should connect audio visualizer audio element', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            audioVisualizerMock.verify((x) => x.initialize(), Times.once());
        });
    });

    describe('handleKeyboardEvent', () => {
        it('should prevent the default action when space is pressed outside of an input element', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('div'));
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.once());
        });

        it('should not prevent the default action when space is pressed inside an input element', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('input'));
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.never());
        });

        it('should not prevent the default action when another key then space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('div'));
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.never());
        });
    });
});
