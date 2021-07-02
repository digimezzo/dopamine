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

        navigationServiceMock.setup((x) => x.showNowPlayingRequested$).returns(() => showNowPlayingRequestedMock$);

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
            expect(app.drawer).toBeUndefined();
        });
    });

    describe('ngOnInit', () => {
        it('should apply theme', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyTheme(), Times.exactly(1));
        });

        it('should apply font size', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            appearanceServiceMock.verify((x) => x.applyFontSize(), Times.exactly(1));
        });

        it('should apply language', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            translatorServiceMock.verify((x) => x.applyLanguageAsync(), Times.exactly(1));
        });

        it('should navigate to loading', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToLoading(), Times.exactly(1));
        });

        it('should initialize Discord', async () => {
            // Arrange

            // Act
            await app.ngOnInit();

            // Assert
            discordServiceMock.verify((x) => x.initialize(), Times.exactly(1));
        });

        it('should not toggle the drawer on showNowPlayingRequested when it is undefined', async () => {
            // Arrange
            let test: boolean = false;

            // Act
            await app.ngOnInit();
            showNowPlayingRequestedMock.next();
            test = true;

            // Assert
            expect(test).toBeTruthy();
        });

        it('should toggle the drawer on showNowPlayingRequested when it is not undefined', async () => {
            // Arrange
            app.drawer = matDrawerMock.object;

            // Act
            await app.ngOnInit();
            showNowPlayingRequestedMock.next();

            // Assert
            matDrawerMock.verify((x) => x.toggle(), Times.exactly(1));
        });
    });
});
