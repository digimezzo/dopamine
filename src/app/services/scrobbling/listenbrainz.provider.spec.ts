import { IMock, Mock, It, Times } from 'typemoq';
import { ListenbrainzProvider } from './listenbrainz.provider';
import { SignInState } from './sign-in-state';
import { ListenbrainzApi } from '../../common/api/listenbrainz/listenbrainz.api';
import { Logger } from '../../common/logger';

describe('ListenbrainzProvider', () => {
    let settingsStub: any;
    let listenbrainzApiMock: IMock<ListenbrainzApi>;
    let loggerMock: IMock<Logger>;

    function createComponent(): ListenbrainzProvider {
        return new ListenbrainzProvider(listenbrainzApiMock.object, settingsStub, loggerMock.object);
    }

    beforeEach(() => {
        settingsStub = {
            enableListenbrainzScrobbling: true,
            listenbrainzToken: 'test-token',
            listenbrainzUsername: 'test-user',
        };
        listenbrainzApiMock = Mock.ofType<ListenbrainzApi>();
        loggerMock = Mock.ofType<Logger>();
    });

    describe('id', () => {
        it('should return "listenbrainz"', () => {
            // Arrange
            const provider = createComponent();

            // Act
            const result = provider.id;

            // Assert
            expect(result).toBe('listenbrainz');
        });
    });

    describe('signInState', () => {
        it('should return signed out when not signed in', () => {
            // Arrange
            const provider = createComponent();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedOut);
        });
    });

    describe('signInStateChanged$', () => {
        it('should notify when signed in', async () => {
            // Arrange
            const provider = createComponent();
            const subscription = provider.signInStateChanged$.subscribe((state) => {
                expect(state).toBe(SignInState.SignedIn);
            });
            provider.token = 'test-token';
            listenbrainzApiMock.setup((x) => x.getUsernameByToken('test-token')).returns(() => Promise.resolve('test-user'));

            // Act
            await provider.signInAsync();
            subscription.unsubscribe();
        });

        it('should notify when signed out', () => {
            // Arrange
            const provider = createComponent();
            const subscription = provider.signInStateChanged$.subscribe((state) => {
                expect(state).toBe(SignInState.SignedOut);
            });

            // Act
            provider.signOut();
            subscription.unsubscribe();
        });

        it('should notify when error', async () => {
            // Arrange
            const provider = createComponent();
            const subscription = provider.signInStateChanged$.subscribe((state) => {
                expect(state).toBe(SignInState.Error);
            });
            provider.token = 'test-token';
            listenbrainzApiMock.setup((x) => x.getUsernameByToken('test-token')).returns(() => Promise.resolve(''));

            // Act
            await provider.signInAsync();
            subscription.unsubscribe();
        });
    });

    describe('initialize', () => {
        it('should not initialize if disabled', () => {
            // Arrange
            settingsStub.enableListenbrainzScrobbling = false;
            const provider = createComponent();

            // Act
            provider.initialize();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedOut);
        });

        it('should sign in when all credentials are provided', () => {
            // Arrange
            settingsStub.listenbrainzToken = 'test-token';
            const provider = createComponent();

            // Act
            provider.initialize();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedIn);
        });
    });

    describe('signInAsync', () => {
        it('should sign in when token is provided and username is fetched', async () => {
            // Arrange
            listenbrainzApiMock.setup((x) => x.getUsernameByToken('test-token')).returns(() => Promise.resolve('test-user'));
            const provider = createComponent();
            provider.token = 'test-token';

            // Act
            await provider.signInAsync();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedIn);
            expect(settingsStub.listenbrainzToken).toBe('test-token');
            expect(settingsStub.listenbrainzUsername).toBe('test-user');
        });

        it('should not sign in when username is not returned from API', async () => {
            // Arrange
            settingsStub.listenbrainzToken = '';
            settingsStub.listenbrainzUsername = '';
            listenbrainzApiMock.setup((x) => x.getUsernameByToken('test-token')).returns(() => Promise.resolve(''));
            const provider = createComponent();
            provider.token = 'test-token';

            // Act
            await provider.signInAsync();

            // Assert
            expect(provider.signInState).toBe(SignInState.Error);
            expect(settingsStub.listenbrainzToken).toBe('');
            expect(settingsStub.listenbrainzUsername).toBe('');
        });
    });

    describe('signOut', () => {
        it('should clear sign in state', () => {
            // Arrange
            const provider = createComponent();

            // Act
            provider.signOut();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedOut);
        });
    });

    describe('updateNowPlayingAsync', () => {
        it('should update now playing when signed in', async () => {
            // Arrange
            settingsStub.listenbrainzToken = 'test-token';
            listenbrainzApiMock
                .setup((x) => x.updateNowPlayingAsync('test-token', 'test-artist', 'test-track', 'test-album'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                artists: 'test-artist',
                title: 'test-track',
                albumTitle: 'test-album',
            };

            // Act
            const result = await provider.updateNowPlayingAsync(track);

            // Assert
            listenbrainzApiMock.verify(
                (x) => x.updateNowPlayingAsync('test-token', 'test-artist', 'test-track', 'test-album'),
                Times.once(),
            );
            expect(result).toBe(true);
        });

        it('should not update now playing when not signed in', async () => {
            // Arrange
            settingsStub.listenbrainzToken = '';
            const provider = createComponent();
            provider.initialize();
            listenbrainzApiMock
                .setup((x) => x.updateNowPlayingAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                artists: 'test-artist',
                title: 'test-track',
                albumTitle: 'test-album',
            };

            // Act
            const result = await provider.updateNowPlayingAsync(track);

            // Assert
            listenbrainzApiMock.verify((x) => x.updateNowPlayingAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(result).toBe(false);
        });
    });

    describe('scrobbleAsync', () => {
        it('should scrobble when signed in', async () => {
            // Arrange
            settingsStub.listenbrainzToken = 'test-token';
            const playbackStartTime: Date = new Date();
            listenbrainzApiMock
                .setup((x) => x.scrobbleTrackAsync('test-token', 'test-artist', 'test-track', 'test-album', playbackStartTime))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                artists: 'test-artist',
                title: 'test-track',
                albumTitle: 'test-album',
            };

            // Act
            const result = await provider.scrobbleAsync(track, playbackStartTime);

            // Assert
            listenbrainzApiMock.verify(
                (x) => x.scrobbleTrackAsync('test-token', 'test-artist', 'test-track', 'test-album', playbackStartTime),
                Times.once(),
            );
            expect(result).toBe(true);
        });

        it('should not scrobble when not signed in', async () => {
            // Arrange
            settingsStub.listenbrainzToken = '';
            const provider = createComponent();
            provider.initialize();
            const playbackStartTime: Date = new Date();
            listenbrainzApiMock
                .setup((x) => x.scrobbleTrackAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                artists: 'test-artist',
                title: 'test-track',
                albumTitle: 'test-album',
            };

            // Act
            const result = await provider.scrobbleAsync(track, playbackStartTime);

            // Assert
            listenbrainzApiMock.verify(
                (x) => x.scrobbleTrackAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            expect(result).toBe(false);
        });
    });

    describe('sendTrackLoveAsync', () => {
        it('should resolve immediately (no-op)', async () => {
            // Arrange
            const provider = createComponent();
            const track: any = {};

            // Act & Assert
            await expect(provider.sendTrackLoveAsync(track, true)).resolves.toBeUndefined();
        });
    });
});
