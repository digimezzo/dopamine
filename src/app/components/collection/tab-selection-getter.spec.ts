import { IMock, Mock } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { BaseSettings } from '../../common/settings/base-settings';
import { TabSelectionGetter } from './tab-selection-getter';

describe('TabSelectionGetter', () => {
    let settingsMock: IMock<BaseSettings>;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
    });

    function createTabSelectionGetter(): TabSelectionGetter {
        return new TabSelectionGetter(settingsMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Assert
            expect(tabSelectionGetter).toBeDefined();
        });
    });

    describe('getTabLabelForIndex', () => {
        it('should return empty when tabIndex is smaller than 0', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(-1);

            // Assert
            expect(tabLabel).toEqual('');
        });

        it('should return empty when tabIndex is larger than 5', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(6);

            // Assert
            expect(tabLabel).toEqual('');
        });

        it('should return Constants.artistsTabLabel if all pages are visible and tabIndex equals 0', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(0);

            // Assert
            expect(tabLabel).toEqual(Constants.artistsTabLabel);
        });

        it('should return Constants.genresTabLabel if all pages are visible and tabIndex equals 1', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(1);

            // Assert
            expect(tabLabel).toEqual(Constants.genresTabLabel);
        });

        it('should return Constants.albumsTabLabel if all pages are visible and tabIndex equals 2', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(2);

            // Assert
            expect(tabLabel).toEqual(Constants.albumsTabLabel);
        });

        it('should return Constants.tracksTabLabel if all pages are visible and tabIndex equals 3', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(3);

            // Assert
            expect(tabLabel).toEqual(Constants.tracksTabLabel);
        });

        it('should return Constants.playlistsTabLabel if all pages are visible and tabIndex equals 4', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(4);

            // Assert
            expect(tabLabel).toEqual(Constants.playlistsTabLabel);
        });

        it('should return Constants.foldersTabLabel if all pages are visible and tabIndex equals 5', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(5);

            // Assert
            expect(tabLabel).toEqual(Constants.foldersTabLabel);
        });

        it('should return Constants.genresTabLabel if not all pages are visible and tabIndex equals 0', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(0);

            // Assert
            expect(tabLabel).toEqual(Constants.genresTabLabel);
        });

        it('should return Constants.tracksTabLabel if not all pages are visible and tabIndex equals 1', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(1);

            // Assert
            expect(tabLabel).toEqual(Constants.tracksTabLabel);
        });

        it('should return Constants.playlistsTabLabel if not all pages are visible and tabIndex equals 2', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(2);

            // Assert
            expect(tabLabel).toEqual(Constants.playlistsTabLabel);
        });

        it('should return empty if not all pages are visible and tabIndex equals 3', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => false);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => false);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabLabel: string = tabSelectionGetter.getTabLabelForIndex(3);

            // Assert
            expect(tabLabel).toEqual('');
        });
    });

    describe('getTabIndexForLabel', () => {
        it('should return 0 when tabLabel is undefined', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(undefined);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 when tabLabel is empty', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel('');

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 when tabLabel is not found', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel('something');

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 if all pages are visible and tabLabel equalsConstants.artistsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.artistsTabLabel);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 1 if all pages are visible and tabLabel equalsConstants.genresTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.genresTabLabel);

            // Assert
            expect(tabIndex).toEqual(1);
        });

        it('should return 2 if all pages are visible and tabLabel equalsConstants.albumsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.albumsTabLabel);

            // Assert
            expect(tabIndex).toEqual(2);
        });

        it('should return 3 if all pages are visible and tabLabel equalsConstants.tracksTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.tracksTabLabel);

            // Assert
            expect(tabIndex).toEqual(3);
        });

        it('should return 4 if all pages are visible and tabLabel equalsConstants.playlistsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.playlistsTabLabel);

            // Assert
            expect(tabIndex).toEqual(4);
        });

        it('should return 5 if all pages are visible and tabLabel equalsConstants.foldersTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => true);
            settingsMock.setup((x) => x.showGenresPage).returns(() => true);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => true);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.foldersTabLabel);

            // Assert
            expect(tabIndex).toEqual(5);
        });

        it('should return 0 if not all pages are visible and tabLabel equalsConstants.artistsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.artistsTabLabel);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 if not all pages are visible and tabLabel equalsConstants.genresTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.genresTabLabel);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 if not all pages are visible and tabLabel equalsConstants.albumsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.albumsTabLabel);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 0 if not all pages are visible and tabLabel equalsConstants.tracksTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.tracksTabLabel);

            // Assert
            expect(tabIndex).toEqual(0);
        });

        it('should return 1 if not all pages are visible and tabLabel equalsConstants.playlistsTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.playlistsTabLabel);

            // Assert
            expect(tabIndex).toEqual(1);
        });

        it('should return 2 if not all pages are visible and tabLabel equalsConstants.foldersTabLabel', () => {
            // Arrange
            settingsMock.setup((x) => x.showArtistsPage).returns(() => false);
            settingsMock.setup((x) => x.showGenresPage).returns(() => false);
            settingsMock.setup((x) => x.showAlbumsPage).returns(() => true);
            settingsMock.setup((x) => x.showTracksPage).returns(() => false);
            settingsMock.setup((x) => x.showPlaylistsPage).returns(() => true);
            settingsMock.setup((x) => x.showFoldersPage).returns(() => true);

            const tabSelectionGetter: TabSelectionGetter = createTabSelectionGetter();

            // Act
            const tabIndex: number = tabSelectionGetter.getTabIndexForLabel(Constants.foldersTabLabel);

            // Assert
            expect(tabIndex).toEqual(2);
        });
    });
});
