import { MatDrawer } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { AppComponent } from './app.component';
import { Logger } from './common/logger';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';

describe('AppComponent', () => {
    let discordServiceMock: IMock<BaseDiscordService>;
    let navigationServiceMock: IMock<BaseNavigationService>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let loggerMock: IMock<Logger>;
    let matDrawerMock: IMock<MatDrawer>;

    let showNowPlayingRequestedMock: Subject<void>;
    let showNowPlayingRequestedMock$: Observable<void>;

    let app: AppComponent;

    beforeEach(() => {
        discordServiceMock = Mock.ofType<BaseDiscordService>();
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        loggerMock = Mock.ofType<Logger>();
        matDrawerMock = Mock.ofType<MatDrawer>();

        showNowPlayingRequestedMock = new Subject();
        showNowPlayingRequestedMock$ = showNowPlayingRequestedMock.asObservable();

        navigationServiceMock.setup((x) => x.showPlaybackQueueRequested$).returns(() => showNowPlayingRequestedMock$);

        app = new AppComponent(
            navigationServiceMock.object,
            appearanceServiceMock.object,
            translatorServiceMock.object,
            discordServiceMock.object,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(app).toBeDefined();
        });

        it('should declare but not define drawer', () => {
            // Arrange

            // Act

            // Assert
            expect(app.playbackQueueDrawer).toBeUndefined();
        });
    });

    describe('ngOnInit', () => {
        it('should initialize appearanceService', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.initialize(), Times.once());
        });

        it('should apply language', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguageAsync(), Times.once());
        });

        it('should navigate to loading', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.once());
        });

        it('should initialize Discord', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            discordServiceMock.verify((x) => x.setRichPresenceFromSettings(), Times.once());
        });

        it('should toggle the drawer on showNowPlayingRequested when it is not undefined', async () => {
            // Arrange
            app.playbackQueueDrawer = matDrawerMock.object;

            // Act
            await app.ngOnInit();
            showNowPlayingRequestedMock.next();

            // Assert
            matDrawerMock.verify((x) => x.toggle(), Times.exactly(1));
        });
    });

    describe('handleKeyboardEvent', () => {
        it('should prevent the default action when space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.once());
        });

        it('should not prevent the default action when another key then space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keydown');
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');

            // Act
            app.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            keyboardEventMock.verify((x) => x.preventDefault(), Times.never());
        });
    });
});
