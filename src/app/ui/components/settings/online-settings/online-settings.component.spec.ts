import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { OnlineSettingsComponent } from './online-settings.component';
import { ScrobblingService } from '../../../../services/scrobbling/scrobbling.service';
import { SignInState } from '../../../../services/scrobbling/sign-in-state';
import { NotificationServiceBase } from '../../../../services/notification/notification.service.base';
import { DiscordService } from '../../../../services/discord/discord.service';
import { UpdateServiceBase } from '../../../../services/update/update.service.base';

describe('OnlineSettingsComponent', () => {
    let discordServiceMock: IMock<DiscordService>;
    let scrobblingServiceMock: IMock<ScrobblingService>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let updateServiceMock: IMock<UpdateServiceBase>;
    let settingsStub: any;

    let scrobblingServiceMock_signInStateChanged: Subject<SignInState>;
    let scrobblingServiceMock_signInStateChanged$: Observable<SignInState>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): OnlineSettingsComponent {
        return new OnlineSettingsComponent(
            discordServiceMock.object,
            scrobblingServiceMock.object,
            notificationServiceMock.object,
            updateServiceMock.object,
            settingsStub,
        );
    }

    function createComponentFromScrobblingServiceStub(scrobblingServiceStub: any): OnlineSettingsComponent {
        return new OnlineSettingsComponent(
            discordServiceMock.object,
            scrobblingServiceStub,
            notificationServiceMock.object,
            updateServiceMock.object,
            settingsStub,
        );
    }

    beforeEach(() => {
        discordServiceMock = Mock.ofType<DiscordService>();
        scrobblingServiceMock = Mock.ofType<ScrobblingService>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        updateServiceMock = Mock.ofType<UpdateServiceBase>();
        settingsStub = { enableDiscordRichPresence: true, enableLastFmScrobbling: true, downloadLyricsOnline: true };

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

        it('should define discordService', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component.discordService).toBeDefined();
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
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.once());
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
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
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
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
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

    describe('downloadLyricsOnline', () => {
        it('should get downloadLyricsOnline from the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            const downloadLyricsOnlineFromSettings: boolean = component.downloadLyricsOnline;

            // Assert
            expect(downloadLyricsOnlineFromSettings).toBeTruthy();
        });

        it('should save downloadLyricsOnline to the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.downloadLyricsOnline = false;

            // Assert
            expect(settingsStub.downloadLyricsOnline).toBeFalsy();
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
