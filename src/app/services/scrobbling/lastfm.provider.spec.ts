import { IMock, Mock, It, Times } from 'typemoq';
import { LastfmProvider } from './lastfm.provider';
import { SignInState } from './sign-in-state';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { Logger } from '../../common/logger';

describe('LastFmProvider', () => {
    let settingsStub: any;
    let lastfmApiMock: IMock<LastfmApi>;
    let loggerMock: IMock<Logger>;

    function createComponent(): LastfmProvider {
        return new LastfmProvider(lastfmApiMock.object, settingsStub, loggerMock.object);
    }

    beforeEach(() => {
        settingsStub = {
            enableLastFmScrobbling: true,
            lastFmUsername: 'test-user',
            lastFmPassword: 'test-password',
            lastFmSessionKey: 'test-session-key',
        };
        lastfmApiMock = Mock.ofType<LastfmApi>();
        loggerMock = Mock.ofType<Logger>();
    });

    describe('id', () => {
        it('should return "lastfm"', () => {
            // Arrange
            const provider = createComponent();

            // Act
            const result = provider.id;

            // Assert
            expect(result).toBe('lastfm');
        });
    });

    describe('signInState', () => {
        it('should return signed out when not signed in', () => {
            // Arrange
            const provider = createComponent();

            // Act
            const result = provider.signInState;

            // Assert
            expect(result).toBe(SignInState.SignedOut);
        });
    });

    describe('signInStateChanged$', () => {
        it('should notify when signed in', async () => {
            // Arrange
            const provider = createComponent();
            const subscription = provider.signInStateChanged$.subscribe((state) => {
                expect(state).toBe(SignInState.SignedIn);
            });

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

            // Act
            await provider.signInAsync();
            subscription.unsubscribe();
        });
    });

    describe('initialize', () => {
        it('should not initialize if disabled', () => {
            // Arrange
            settingsStub.enableLastFmScrobbling = false;
            const provider = createComponent();

            // Act
            provider.initialize();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedOut);
        });

        it('should sign in when all credentials are provided', () => {
            // Arrange
            settingsStub.lastFmUsername = 'test-user';
            settingsStub.lastFmPassword = 'test-password';
            settingsStub.lastFmSessionKey = 'test-session-key';
            const provider = createComponent();

            // Act
            provider.initialize();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedIn);
        });
    });

    describe('signInAsync', () => {
        it('should sign in when credentials are provided', async () => {
            // Arrange
            lastfmApiMock
                .setup((x) => x.getMobileSessionAsync('test-user', 'test-password'))
                .returns(() => Promise.resolve('test-session-key'));
            const provider = createComponent();
            provider.username = 'test-user';
            provider.password = 'test-password';

            // Act
            await provider.signInAsync();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedIn);
            expect(settingsStub.lastFmUsername).toBe('test-user');
            expect(settingsStub.lastFmPassword).toBe('test-password');
            expect(settingsStub.lastFmSessionKey).toBe('test-session-key');
        });

        it('should not sign in when session key is not provided', async () => {
            // Arrange
            settingsStub.lastFmUsername = '';
            settingsStub.lastFmPassword = '';
            settingsStub.lastFmSessionKey = '';
            lastfmApiMock.setup((x) => x.getMobileSessionAsync('test-user', 'test-password')).returns(() => Promise.resolve(''));
            const provider = createComponent();
            provider.username = 'test-user';
            provider.password = 'test-password';

            // Act
            await provider.signInAsync();

            // Assert
            expect(provider.signInState).toBe(SignInState.Error);
            expect(settingsStub.lastFmUsername).toBe('');
            expect(settingsStub.lastFmPassword).toBe('');
            expect(settingsStub.lastFmSessionKey).toBe('');
        });
    });

    describe('signOut', () => {
        it('should clear session key', () => {
            // Arrange
            settingsStub.lastFmUsername = 'test-user';
            settingsStub.lastFmPassword = 'test-password';
            settingsStub.lastFmSessionKey = 'test-session-key';
            const provider = createComponent();

            // Act
            provider.signOut();

            // Assert
            expect(provider.signInState).toBe(SignInState.SignedOut);
            expect(settingsStub.lastFmSessionKey).toBe('');
        });
    });

    describe('sendTrackLoveAsync', () => {
        it('should not send love when not signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = '';
            const provider = createComponent();
            provider.initialize();
            lastfmApiMock
                .setup((x) => x.loveTrackAsync(It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                rawArtists: ['test-artist'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            await provider.sendTrackLoveAsync(track, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should send love when signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            lastfmApiMock
                .setup((x) => x.loveTrackAsync('test-session-key', 'test-artist', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawArtists: ['test-artist'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            await provider.sendTrackLoveAsync(track, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync('test-session-key', 'test-artist', 'test-track'), Times.once());
        });

        it('should send love for all track artists when multiple artists are present', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawArtists: ['test-artist-1', 'test-artist-2'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };
            lastfmApiMock
                .setup((x) => x.loveTrackAsync('test-session-key', 'test-artist-1', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            lastfmApiMock
                .setup((x) => x.loveTrackAsync('test-session-key', 'test-artist-2', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();

            // Act
            await provider.sendTrackLoveAsync(track, true);

            // Assert
            lastfmApiMock.verify((x) => x.loveTrackAsync('test-session-key', 'test-artist-1', 'test-track'), Times.once());
            lastfmApiMock.verify((x) => x.loveTrackAsync('test-session-key', 'test-artist-2', 'test-track'), Times.once());
        });

        it('should not send unlove when not signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = '';
            const provider = createComponent();
            provider.initialize();
            lastfmApiMock
                .setup((x) => x.unloveTrackAsync(It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                rawArtists: ['test-artist'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            await provider.sendTrackLoveAsync(track, false);

            // Assert
            lastfmApiMock.verify((x) => x.unloveTrackAsync(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should send unlove when signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            lastfmApiMock
                .setup((x) => x.unloveTrackAsync('test-session-key', 'test-artist', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawArtists: ['test-artist'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            await provider.sendTrackLoveAsync(track, false);

            // Assert
            lastfmApiMock.verify((x) => x.unloveTrackAsync('test-session-key', 'test-artist', 'test-track'), Times.once());
        });

        it('should send unlove for all track artists when multiple artists are present', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawArtists: ['test-artist-1', 'test-artist-2'],
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };
            lastfmApiMock
                .setup((x) => x.unloveTrackAsync('test-session-key', 'test-artist-1', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            lastfmApiMock
                .setup((x) => x.unloveTrackAsync('test-session-key', 'test-artist-2', 'test-track'))
                .returns(() => Promise.resolve(true))
                .verifiable();

            // Act
            await provider.sendTrackLoveAsync(track, false);

            // Assert
            lastfmApiMock.verify((x) => x.unloveTrackAsync('test-session-key', 'test-artist-1', 'test-track'), Times.once());
            lastfmApiMock.verify((x) => x.unloveTrackAsync('test-session-key', 'test-artist-2', 'test-track'), Times.once());
        });
    });

    describe('updateNowPlayingAsync', () => {
        it('should update now playing when signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            lastfmApiMock
                .setup((x) => x.updateTrackNowPlayingAsync('test-session-key', 'test-artist', 'test-track', 'test-album'))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawFirstArtist: 'test-artist',
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            const result = await provider.updateNowPlayingAsync(track);

            // Assert
            lastfmApiMock.verify(
                (x) => x.updateTrackNowPlayingAsync('test-session-key', 'test-artist', 'test-track', 'test-album'),
                Times.once(),
            );
            expect(result).toBe(true);
        });

        it('should not update now playing when not signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = '';
            const provider = createComponent();
            provider.initialize();
            lastfmApiMock
                .setup((x) => x.updateTrackNowPlayingAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                rawFirstArtist: 'test-artist',
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            const result = await provider.updateNowPlayingAsync(track);

            // Assert
            lastfmApiMock.verify((x) => x.updateTrackNowPlayingAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(result).toBe(false);
        });
    });

    describe('scrobbleAsync', () => {
        it('should scrobble when signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = 'test-session-key';
            const playbackStartTime: Date = new Date();
            lastfmApiMock
                .setup((x) => x.scrobbleTrackAsync('test-session-key', 'test-artist', 'test-track', 'test-album', playbackStartTime))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const provider = createComponent();
            provider.initialize();
            const track: any = {
                rawFirstArtist: 'test-artist',
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            const result = await provider.scrobbleAsync(track, playbackStartTime);

            // Assert
            lastfmApiMock.verify(
                (x) => x.scrobbleTrackAsync('test-session-key', 'test-artist', 'test-track', 'test-album', playbackStartTime),
                Times.once(),
            );
            expect(result).toBe(true);
        });

        it('should not scrobble when not signed in', async () => {
            // Arrange
            settingsStub.lastFmSessionKey = '';
            const provider = createComponent();
            provider.initialize();
            const playbackStartTime: Date = new Date();
            lastfmApiMock
                .setup((x) => x.scrobbleTrackAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable();
            const track: any = {
                rawFirstArtist: 'test-artist',
                rawTitle: 'test-track',
                rawAlbumTitle: 'test-album',
            };

            // Act
            const result = await provider.scrobbleAsync(track, playbackStartTime);

            // Assert
            lastfmApiMock.verify((x) => x.scrobbleTrackAsync(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(result).toBe(false);
        });
    });
});
