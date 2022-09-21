import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from './app.component';
import { BaseDesktop } from './common/io/base-desktop';
import { Logger } from './common/logger';
import { AddToPlaylistMenu } from './components/add-to-playlist-menu';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseSearchService } from './services/search/base-search.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { BaseTrayService } from './services/tray/base-tray.service';

describe('AppComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let discordServiceMock: IMock<BaseDiscordService>;
    let trayServiceMock: IMock<BaseTrayService>;
    let searchServiceMock: IMock<BaseSearchService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let desktopMock: IMock<BaseDesktop>;
    let loggerMock: IMock<Logger>;
    let matDrawerMock: IMock<MatDrawer>;

    let showNowPlayingRequestedMock: Subject<void>;
    let showNowPlayingRequestedMock$: Observable<void>;

    function createComponent(): AppComponent {
        return new AppComponent(
            navigationServiceMock.object,
            appearanceServiceMock.object,
            translatorServiceMock.object,
            dialogServiceMock.object,
            discordServiceMock.object,
            trayServiceMock.object,
            searchServiceMock.object,
            addToPlaylistMenuMock.object,
            desktopMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        discordServiceMock = Mock.ofType<BaseDiscordService>();
        trayServiceMock = Mock.ofType<BaseTrayService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        desktopMock = Mock.ofType<BaseDesktop>();
        loggerMock = Mock.ofType<Logger>();
        matDrawerMock = Mock.ofType<MatDrawer>();

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
            appearanceServiceMock.verify((x) => x.applyAppearance(), Times.once());
        });

        it('should apply language', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguageAsync(), Times.once());
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
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.once());
        });

        it('should initialize Discord', async () => {
            // Arrange
            const app: AppComponent = createComponent();

            // Act
            await app.ngOnInit();

            // Assert
            discordServiceMock.verify((x) => x.setRichPresenceFromSettings(), Times.once());
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
    });

    describe('handleKeyboardEvent', () => {
        it('should prevent the default action when space is pressed while not searching and no input dialog is opened', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => false);
            dialogServiceMock.setup((x) => x.isInputDialogOpened).returns(() => false);
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.once());
        });

        it('should not prevent the default action when space is pressed while searching', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => true);
            dialogServiceMock.setup((x) => x.isInputDialogOpened).returns(() => false);
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.never());
        });

        it('should not prevent the default action when space is pressed while an input dialog is opened', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => false);
            dialogServiceMock.setup((x) => x.isInputDialogOpened).returns(() => true);
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
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');
            const app: AppComponent = createComponent();

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.never());
        });
    });
});
