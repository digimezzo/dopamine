import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { BaseDiscordService } from '../../../services/discord/base-discord.service';
import { BaseScrobblingService } from '../../../services/scrobbling/base-scrobbling.service';
import { SignInState } from '../../../services/scrobbling/sign-in-state';
import { BaseSnackBarService } from '../../../services/snack-bar/base-snack-bar.service';
import { OnlineSettingsComponent } from './online-settings.component';

describe('OnlineSettingsComponent', () => {
    let discordServiceMock: IMock<BaseDiscordService>;
    let scrobblingServiceMock: IMock<BaseScrobblingService>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let settingsStub: any;

    let scrobblingServiceMock_signInStateChanged: Subject<SignInState>;
    let scrobblingServiceMock_signInStateChanged$: Observable<SignInState>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): OnlineSettingsComponent {
        return new OnlineSettingsComponent(
            discordServiceMock.object,
            scrobblingServiceMock.object,
            snackBarServiceMock.object,
            settingsStub
        );
    }

    function createComponentFromScrobblingServiceStub(scrobblingServiceStub: any): OnlineSettingsComponent {
        return new OnlineSettingsComponent(discordServiceMock.object, scrobblingServiceStub, snackBarServiceMock.object, settingsStub);
    }

    beforeEach(() => {
        discordServiceMock = Mock.ofType<BaseDiscordService>();
        scrobblingServiceMock = Mock.ofType<BaseScrobblingService>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        settingsStub = { enableDiscordRichPresence: true, enableLastFmScrobbling: true };

        scrobblingServiceMock_signInStateChanged = new Subject();
        scrobblingServiceMock_signInStateChanged$ = scrobblingServiceMock_signInStateChanged.asObservable();
        scrobblingServiceMock.setup((x) => x.signInStateChanged$).returns(() => scrobblingServiceMock_signInStateChanged$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should have SignInState.SignedOut', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component.signInState).toEqual(SignInState.SignedOut);
        });
    });

    describe('ngOnInit', () => {
        it('should set signInState from scrobblingService.signInState', () => {
            // Arrange
            scrobblingServiceMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.signInState).toEqual(SignInState.SignedIn);
        });

        it('should update SignInState when changed', async () => {
            // Arrange
            scrobblingServiceMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            scrobblingServiceMock_signInStateChanged.next(SignInState.Error);
            await flushPromises();

            // Assert
            expect(component.signInState).toEqual(SignInState.Error);
        });

        it('should tell the user when sign in failed', async () => {
            // Arrange
            scrobblingServiceMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            scrobblingServiceMock_signInStateChanged.next(SignInState.Error);
            await flushPromises();

            // Assert
            snackBarServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.once());
        });

        it('should not tell the user that sign in failed when signed in', async () => {
            // Arrange
            scrobblingServiceMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            scrobblingServiceMock_signInStateChanged.next(SignInState.SignedIn);
            await flushPromises();

            // Assert
            snackBarServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
        });

        it('should not tell the user that sign in failed when signed out', async () => {
            // Arrange
            scrobblingServiceMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            scrobblingServiceMock_signInStateChanged.next(SignInState.SignedOut);
            await flushPromises();

            // Assert
            snackBarServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
        });
    });

    describe('lastFmUserName', () => {
        it('should get scrobblingService.username', () => {
            // Arrange
            const scrobblingServiceStub: any = { username: 'MyLastFmUsername', password: 'MyLastFmPassword' };
            const component: OnlineSettingsComponent = createComponentFromScrobblingServiceStub(scrobblingServiceStub);

            // Act

            // Assert
            expect(component.lastFmUserName).toEqual('MyLastFmUsername');
        });

        it('should set scrobblingService.username', () => {
            // Arrange
            const scrobblingServiceStub: any = { username: 'MyLastFmUsername', password: 'MyLastFmPassword' };
            const component: OnlineSettingsComponent = createComponentFromScrobblingServiceStub(scrobblingServiceStub);

            // Act
            component.lastFmUserName = 'MyNewLastFmUsername';

            // Assert
            expect(component.lastFmUserName).toEqual('MyNewLastFmUsername');
        });
    });

    describe('lastFmPassword', () => {
        it('should get scrobblingService.password', () => {
            // Arrange
            const scrobblingServiceStub: any = { username: 'MyLastFmUsername', password: 'MyLastFmPassword' };
            const component: OnlineSettingsComponent = createComponentFromScrobblingServiceStub(scrobblingServiceStub);

            // Act

            // Assert
            expect(component.lastFmPassword).toEqual('MyLastFmPassword');
        });

        it('should set scrobblingService.username', () => {
            // Arrange
            const scrobblingServiceStub: any = { username: 'MyLastFmUsername', password: 'MyLastFmPassword' };
            const component: OnlineSettingsComponent = createComponentFromScrobblingServiceStub(scrobblingServiceStub);

            // Act
            component.lastFmPassword = 'MyNewLastFmPassword';

            // Assert
            expect(component.lastFmPassword).toEqual('MyNewLastFmPassword');
        });
    });

    describe('enableDiscordRichPresence', () => {
        it('should get enableDiscordRichPresence from the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            const enableDiscordRichPresenceFromSettings: boolean = component.enableDiscordRichPresence;

            // Assert
            expect(enableDiscordRichPresenceFromSettings).toBeTruthy();
        });

        it('should set enableDiscordRichPresence to true when true', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableDiscordRichPresence = true;

            // Assert
            discordServiceMock.verify((x) => x.setRichPresence(true), Times.once());
        });

        it('should set enableDiscordRichPresence to false when false', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableDiscordRichPresence = false;

            // Assert
            discordServiceMock.verify((x) => x.setRichPresence(false), Times.once());
        });

        it('should save enableDiscordRichPresence to the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableDiscordRichPresence = false;

            // Assert
            expect(settingsStub.enableDiscordRichPresence).toBeFalsy();
        });
    });

    describe('enableLastFmScrobbling', () => {
        it('should get enableLastFmScrobbling from the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            const enableLastFmScrobblingFromSettings: boolean = component.enableLastFmScrobbling;

            // Assert
            expect(enableLastFmScrobblingFromSettings).toBeTruthy();
        });

        it('should not sign out when true', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableLastFmScrobbling = true;

            // Assert
            scrobblingServiceMock.verify((x) => x.signOut(), Times.never());
        });

        it('should sign out when false', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableLastFmScrobbling = false;

            // Assert
            scrobblingServiceMock.verify((x) => x.signOut(), Times.once());
        });

        it('should save enableLastFmScrobbling to the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableLastFmScrobbling = false;

            // Assert
            expect(settingsStub.enableLastFmScrobbling).toBeFalsy();
        });
    });

    describe('signInToLastFmAsync', () => {
        it('should sign in to Last.fm', async () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            await component.signInToLastFmAsync();

            // Assert
            scrobblingServiceMock.verify((x) => x.signInAsync(), Times.once());
        });
    });
});
