import { Observable, Subject } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { OnlineSettingsComponent } from './online-settings.component';
import { SignInState } from '../../../../services/scrobbling/sign-in-state';
import { NotificationServiceBase } from '../../../../services/notification/notification.service.base';
import { DiscordService } from '../../../../services/discord/discord.service';
import { UpdateServiceBase } from '../../../../services/update/update.service.base';
import { LastfmProvider } from '../../../../services/scrobbling/lastfm.provider';
import { ListenbrainzProvider } from '../../../../services/scrobbling/listenbrainz.provider';

describe('OnlineSettingsComponent', () => {
    let discordServiceMock: IMock<DiscordService>;
    let lastfmProviderMock: IMock<LastfmProvider>;
    let listenbrainzProviderMock: IMock<ListenbrainzProvider>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let updateServiceMock: IMock<UpdateServiceBase>;
    let settingsStub: any;

    let lastfmProviderMock_signInStateChanged: Subject<SignInState>;
    let lastfmProviderMock_signInStateChanged$: Observable<SignInState>;
    let listenbrainzProviderMock_signInStateChanged: Subject<SignInState>;
    let listenbrainzProviderMock_signInStateChanged$: Observable<SignInState>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): OnlineSettingsComponent {
        return new OnlineSettingsComponent(
            discordServiceMock.object,
            lastfmProviderMock.object,
            listenbrainzProviderMock.object,
            notificationServiceMock.object,
            updateServiceMock.object,
            settingsStub,
        );
    }

    function createComponentFromScrobblingServiceStub(lastfmProviderStub: any, listenbrainzProviderStub: any): OnlineSettingsComponent {
        return new OnlineSettingsComponent(
            discordServiceMock.object,
            lastfmProviderStub,
            listenbrainzProviderStub,
            notificationServiceMock.object,
            updateServiceMock.object,
            settingsStub,
        );
    }

    beforeEach(() => {
        discordServiceMock = Mock.ofType<DiscordService>();
        lastfmProviderMock = Mock.ofType<LastfmProvider>();
        listenbrainzProviderMock = Mock.ofType<ListenbrainzProvider>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        updateServiceMock = Mock.ofType<UpdateServiceBase>();
        settingsStub = { enableDiscordRichPresence: true, enableLastFmScrobbling: true, downloadLyricsOnline: true, enableListenbrainzScrobbling: true };

        lastfmProviderMock_signInStateChanged = new Subject();
        lastfmProviderMock_signInStateChanged$ = lastfmProviderMock_signInStateChanged.asObservable();
        lastfmProviderMock.setup((x) => x.signInStateChanged$).returns(() => lastfmProviderMock_signInStateChanged$);

        listenbrainzProviderMock_signInStateChanged = new Subject();
        listenbrainzProviderMock_signInStateChanged$ = listenbrainzProviderMock_signInStateChanged.asObservable();
        listenbrainzProviderMock.setup((x) => x.signInStateChanged$).returns(() => listenbrainzProviderMock_signInStateChanged$);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should have lastfmSignInState.SignedOut', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component.lastfmSignInState).toEqual(SignInState.SignedOut);
        });

        it('should have listenbrainzSignInState.SignedOut', () => {
            // Arrange

            // Act
            const component: OnlineSettingsComponent = createComponent();

            // Assert
            expect(component.listenbrainzSignInState).toEqual(SignInState.SignedOut);
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
        it('should set signInState from lastfmProvider.signInState', () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.lastfmSignInState).toEqual(SignInState.SignedIn);
        });

        it('should set signInState from listenbrainzProvider.signInState', () => {
            // Arrange
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.listenbrainzSignInState).toEqual(SignInState.SignedIn);
        });

        it('should update lastfmSignInState when changed', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            lastfmProviderMock_signInStateChanged.next(SignInState.Error);
            await flushPromises();

            // Assert
            expect(component.lastfmSignInState).toEqual(SignInState.Error);
        });

        it('should update listenbrainzSignInState when changed', async () => {
            // Arrange
            listenbrainzProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            listenbrainzProviderMock_signInStateChanged.next(SignInState.Error);
            await flushPromises();

            // Assert
            expect(component.listenbrainzSignInState).toEqual(SignInState.Error);
        });

        it('should tell the user when last.fm sign in failed', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            lastfmProviderMock_signInStateChanged.next(SignInState.Error);
            await flushPromises();

            // Assert
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.once());
        });

        it('should not tell the user that last.fm sign in failed when signed in', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedIn);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            lastfmProviderMock_signInStateChanged.next(SignInState.SignedIn);
            await flushPromises();

            // Assert
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
        });

        it('should not tell the user that last.fm sign in failed when signed out', async () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.signInState).returns(() => SignInState.SignedOut);
            const component: OnlineSettingsComponent = createComponent();
            component.ngOnInit();

            // Act
            lastfmProviderMock_signInStateChanged.next(SignInState.SignedOut);
            await flushPromises();

            // Assert
            notificationServiceMock.verify((x) => x.lastFmLoginFailedAsync(), Times.never());
        });
    });

    describe('lastFmUserName', () => {
        it('should get lastfmProvider.username', () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.username).returns(() => 'MyLastFmUsername');
            const component: OnlineSettingsComponent = createComponent();

            // Act

            // Assert
            expect(component.lastFmUserName).toEqual('MyLastFmUsername');
        });

        it('should set username', () => {
            // Arrange
            const lastfmStub = { username: '' };
            const listenbrainzStub = {};

            const component = createComponentFromScrobblingServiceStub(lastfmStub, listenbrainzStub);

            component.lastFmUserName = 'MyNewLastFmUsername';

            // Assert
            expect(component.lastFmUserName).toEqual('MyNewLastFmUsername');
            expect(lastfmStub.username).toEqual('MyNewLastFmUsername');
        });
    });

    describe('lastFmPassword', () => {
        it('should get lastfmProvider.password', () => {
            // Arrange
            lastfmProviderMock.setup((x) => x.password).returns(() => 'MyLastFmPassword');
            const component: OnlineSettingsComponent = createComponent();

            // Act

            // Assert
            expect(component.lastFmPassword).toEqual('MyLastFmPassword');
        });

        it('should set password', () => {
            // Arrange
            const lastfmStub = { password: '' };
            const listenbrainzStub = {};

            const component = createComponentFromScrobblingServiceStub(lastfmStub, listenbrainzStub);

            component.lastFmPassword = 'MyNewLastFmPassword';

            // Assert
            expect(component.lastFmPassword).toEqual('MyNewLastFmPassword');
            expect(lastfmStub.password).toEqual('MyNewLastFmPassword');
        });
    });

    describe('listenbrainzToken', () => {
        it('should get listenbrainzProvider.token', () => {
            // Arrange
            listenbrainzProviderMock.setup((x) => x.token).returns(() => 'MyListenbrainzToken');
            const component: OnlineSettingsComponent = createComponent();

            // Act

            // Assert
            expect(component.listenbrainzToken).toEqual('MyListenbrainzToken');
        });

        it('should set token', () => {
            // Arrange
            const lastfmStub = {};
            const listenbrainzStub = { token: '' };
            const component = createComponentFromScrobblingServiceStub(lastfmStub, listenbrainzStub);

            // Act
            component.listenbrainzToken = 'MyNewListenbrainzToken';

            // Assert
            expect(component.listenbrainzToken).toEqual('MyNewListenbrainzToken');
            expect(listenbrainzStub.token).toEqual('MyNewListenbrainzToken');
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
            lastfmProviderMock.verify((x) => x.signOut(), Times.never());
        });

        it('should sign out when false', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableLastFmScrobbling = false;

            // Assert
            lastfmProviderMock.verify((x) => x.signOut(), Times.once());
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

    describe('enableListenbrainzScrobbling', () => {
        it('should get enableListenbrainzScrobbling from the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            const enableListenbrainzScrobblingFromSettings: boolean = component.enableListenbrainzScrobbling;

            // Assert
            expect(enableListenbrainzScrobblingFromSettings).toBeTruthy();
        });

        it('should not sign out when true', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableListenbrainzScrobbling = true;

            // Assert
            listenbrainzProviderMock.verify((x) => x.signOut(), Times.never());
        });

        it('should sign out when false', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableListenbrainzScrobbling = false;

            // Assert
            listenbrainzProviderMock.verify((x) => x.signOut(), Times.once());
        });

        it('should save enableListenbrainzScrobbling to the settings', () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            component.enableListenbrainzScrobbling = false;

            // Assert
            expect(settingsStub.enableListenbrainzScrobbling).toBeFalsy();
        });
    });

    describe('signInToLastFmAsync', () => {
        it('should sign in to Last.fm', async () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            await component.signInToLastFmAsync();

            // Assert
            lastfmProviderMock.verify((x) => x.signInAsync(), Times.once());
        });
    });

    describe('signInToListenbrainzAsync', () => {
        it('should sign in to Listenbrainz', async () => {
            // Arrange
            const component: OnlineSettingsComponent = createComponent();

            // Act
            await component.signInToListenbrainzAsync();

            // Assert
            listenbrainzProviderMock.verify((x) => x.signInAsync(), Times.once());
        });
    });
});
