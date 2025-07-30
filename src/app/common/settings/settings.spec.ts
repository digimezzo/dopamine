import { Settings } from './settings';
import Store from 'electron-store';
import { IMock, Mock, Times } from 'typemoq';
import { StoreProxy } from './store-proxy';

describe('Settings', () => {
    let storeProxyMock: IMock<StoreProxy>;
    let storeMock: IMock<Store>;

    function createSettings() {
        return new Settings(storeProxyMock.object);
    }

    beforeEach(() => {
        storeProxyMock = Mock.ofType<StoreProxy>();
        storeMock = Mock.ofType<Store>();
        storeProxyMock.setup((x) => x.store).returns(() => storeMock.object);
    });

    describe('constructor', () => {
        const defaultSettings: Record<string, any> = {
            language: 'en',
            checkForUpdates: true,
            checkForUpdatesIncludesPreReleases: true,
            useSystemTitleBar: false,
            fontSize: 13,
            theme: 'Dopamine',
            showWelcome: true,
            followSystemTheme: false,
            useLightBackgroundTheme: false,
            followSystemColor: false,
            followAlbumCoverColor: false,
            skipRemovedFilesDuringRefresh: true,
            downloadMissingAlbumCovers: true,
            showAllFoldersInCollection: true,
            refreshCollectionAutomatically: true,
            albumsRightPaneWidthPercent: 30,
            foldersLeftPaneWidthPercent: 30,
            artistsLeftPaneWidthPercent: 25,
            artistsRightPaneWidthPercent: 25,
            genresLeftPaneWidthPercent: 25,
            genresRightPaneWidthPercent: 25,
            playlistsLeftPaneWidthPercent: 25,
            playlistsRightPaneWidthPercent: 25,
            volume: 0.5,
            selectedCollectionPage: 0,
            foldersTabOpenedFolder: '',
            foldersTabOpenedSubfolder: '',
            albumsTabSelectedAlbum: '',
            albumsTabSelectedAlbumOrder: '',
            albumsTabSelectedTrackOrder: '',
            artistsTabSelectedArtistType: '',
            artistsTabSelectedArtist: '',
            artistsTabSelectedArtistOrder: '',
            artistsTabSelectedAlbum: '',
            artistsTabSelectedAlbumOrder: '',
            artistsTabSelectedTrackOrder: '',
            genresTabSelectedGenre: '',
            genresTabSelectedAlbum: '',
            genresTabSelectedGenreOrder: '',
            genresTabSelectedAlbumOrder: '',
            genresTabSelectedTrackOrder: '',
            playlistsTabSelectedPlaylistFolder: '',
            playlistsTabSelectedPlaylist: '',
            playlistsTabSelectedPlaylistOrder: '',
            playlistsTabSelectedTrackOrder: '',
            enableDiscordRichPresence: false,
            enableLastFmScrobbling: false,
            showIconInNotificationArea: true,
            minimizeToNotificationArea: false,
            closeToNotificationArea: false,
            invertNotificationAreaIconColor: false,
            showArtistsPage: true,
            showGenresPage: true,
            showAlbumsPage: false,
            showTracksPage: true,
            showPlaylistsPage: true,
            showFoldersPage: true,
            showRating: true,
            saveRatingToAudioFiles: false,
            tracksPageVisibleColumns: 'rating;artists;duration;number',
            tracksPageColumnsOrder: '',
            lastFmUsername: '',
            lastFmPassword: '',
            lastFmSessionKey: '',
            showLove: false,
            downloadArtistInformationFromLastFm: true,
            downloadLyricsOnline: true,
            showAudioVisualizer: true,
            audioVisualizerStyle: 'flames',
            audioVisualizerFrameRate: 10,
            keepPlaybackControlsVisibleOnNowPlayingPage: false,
            albumsDefinedByTitleAndArtist: true,
            albumsDefinedByTitle: false,
            albumsDefinedByFolders: false,
            playbackControlsLoop: 0,
            playbackControlsShuffle: 0,
            rememberPlaybackStateAfterRestart: true,
            artistSplitSeparators: '[feat.][ft.]',
            artistSplitExceptions: '',
            playerType: 'full',
            fullPlayerPositionSizeMaximized: '50;50;1000;650;0',
            coverPlayerPosition: '50;50',
            useGaplessPlayback: false,
        };

        Object.entries(defaultSettings).forEach(([key, value]) => {
            it(`should initialize "${key}" with default value`, () => {
                // Arrange
                storeMock.setup((x) => x.has(key)).returns(() => false);

                // Act
                createSettings();

                // Assert
                storeMock.verify((x) => x.set(key, value), Times.once());
            });
        });

        Object.entries(defaultSettings).forEach(([key, value]) => {
            it(`should initialize "${key}" with existing value`, () => {
                // Arrange
                storeMock.setup((x) => x.has(key)).returns(() => true);

                // Act
                createSettings();

                // Assert
                storeMock.verify((x) => x.set(key, value), Times.never());
            });
        });

        Object.entries(defaultSettings).forEach(([key, value]) => {
            it(`should return value for "${key}"`, () => {
                // Arrange
                const settings = createSettings();
                storeMock.reset();
                storeMock.setup((x) => x.get(key)).returns(() => value);

                // Act
                const result = settings[key];

                // Assert
                expect(result).toEqual(value);
                storeMock.verify((x) => x.get(key), Times.once());
            });
        });

        it('should have declared all setting keys', () => {
            // Arrange
            const settings = createSettings();

            // Act
            const result = settings['allSettings'].map((x) => x.key).sort();

            // Assert
            expect(result).toEqual(Object.keys(defaultSettings).sort());
        });

        it('should not have duplicated setting keys', () => {
            // Arrange
            const settings = createSettings();

            // Act
            const result = settings['allSettings'].map((x) => x.key).sort();

            // Assert
            expect(result).toEqual(Array.from(new Set(result).keys()).sort());
        });
    });

    describe('defaultLanguage', () => {
        it('should return default language', () => {
            // Arrange
            const settings = createSettings();

            // Act
            const result = settings.defaultLanguage;

            // Assert
            expect(result).toEqual('en');
        });
    });

    describe('albumKeyIndex', () => {
        it('should return "3" when cachedAlbumKeyIndex is default and albums are defined by folders', () => {
            // Arrange
            const settings = createSettings();
            settings['cachedAlbumKeyIndex'] = '-1';
            storeMock.reset();

            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => true);

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('3');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.once());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.never());
        });

        it('should return "3" when albums are defined by folders', () => {
            // Arrange
            const settings = createSettings();
            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => true);
            settings.albumsDefinedByFolders = true;
            storeMock.reset();

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('3');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.never());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.never());
        });

        it('should return "2" when cachedAlbumKeyIndex is default albums are defined by title', () => {
            // Arrange
            const settings = createSettings();
            settings['cachedAlbumKeyIndex'] = '-1';
            storeMock.reset();

            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => false);
            storeMock.setup((x) => x.get('albumsDefinedByTitle')).returns(() => true);

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('2');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.once());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.once());
        });

        it('should return "2" when albums are defined by title', () => {
            // Arrange
            const settings = createSettings();
            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => false);
            storeMock.setup((x) => x.get('albumsDefinedByTitle')).returns(() => true);
            settings.albumsDefinedByTitle = true;
            storeMock.reset();

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('2');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.never());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.never());
        });

        it('should return empty when cachedAlbumKeyIndex is default and albums are defined by album title and artist', () => {
            // Arrange
            const settings = createSettings();
            settings['cachedAlbumKeyIndex'] = '-1';
            storeMock.reset();

            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => false);
            storeMock.setup((x) => x.get('albumsDefinedByTitle')).returns(() => false);

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.once());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.once());
        });

        it('should return empty when albums are defined by album title and artist', () => {
            // Arrange
            const settings = createSettings();
            storeMock.setup((x) => x.get('albumsDefinedByFolders')).returns(() => false);
            storeMock.setup((x) => x.get('albumsDefinedByTitle')).returns(() => false);
            settings.albumsDefinedByTitleAndArtist = true;
            storeMock.reset();

            // Act
            const result = settings.albumKeyIndex;

            // Assert
            expect(result).toEqual('');
            storeMock.verify((x) => x.get('albumsDefinedByFolders'), Times.never());
            storeMock.verify((x) => x.get('albumsDefinedByTitle'), Times.never());
        });
    });
});
