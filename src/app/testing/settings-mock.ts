import { SettingsBase } from '../common/settings/settings.base';

export class SettingsMock implements SettingsBase {
    albumsDefinedByFolders: boolean;
    albumsDefinedByTitle: boolean;
    albumsDefinedByTitleAndArtist: boolean;
    albumsRightPaneWidthPercent: number;
    albumsTabSelectedAlbum: string;
    albumsTabSelectedAlbumOrder: string;
    albumsTabSelectedTrackOrder: string;
    artistsLeftPaneWidthPercent: number;
    artistsRightPaneWidthPercent: number;
    artistsTabSelectedAlbum: string;
    artistsTabSelectedAlbumOrder: string;
    artistsTabSelectedArtist: string;
    artistsTabSelectedArtistOrder: string;
    artistsTabSelectedArtistType: string;
    artistsTabSelectedTrackOrder: string;
    audioVisualizerFrameRate: number;
    audioVisualizerStyle: string;
    checkForUpdates: boolean;
    checkForUpdatesIncludesPreReleases: boolean;
    closeToNotificationArea: boolean;
    downloadArtistInformationFromLastFm: boolean;
    downloadLyricsOnline: boolean;
    downloadMissingAlbumCovers: boolean;
    enableDiscordRichPresence: boolean;
    enableLastFmScrobbling: boolean;
    enableMultimediaKeys: boolean;
    foldersLeftPaneWidthPercent: number;
    foldersTabOpenedFolder: string;
    foldersTabOpenedSubfolder: string;
    followSystemColor: boolean;
    followSystemTheme: boolean;
    fontSize: number;
    genresLeftPaneWidthPercent: number;
    genresRightPaneWidthPercent: number;
    genresTabSelectedAlbum: string;
    genresTabSelectedAlbumOrder: string;
    genresTabSelectedGenre: string;
    genresTabSelectedGenreOrder: string;
    genresTabSelectedTrackOrder: string;
    invertNotificationAreaIconColor: boolean;
    keepPlaybackControlsVisibleOnNowPlayingPage: boolean;
    language: string;
    lastFmPassword: string;
    lastFmSessionKey: string;
    lastFmUsername: string;
    minimizeToNotificationArea: boolean;
    playlistsLeftPaneWidthPercent: number;
    playlistsRightPaneWidthPercent: number;
    playlistsTabSelectedPlaylist: string;
    playlistsTabSelectedPlaylistFolder: string;
    playlistsTabSelectedPlaylistOrder: string;
    playlistsTabSelectedTrackOrder: string;
    refreshCollectionAutomatically: boolean;
    saveRatingToAudioFiles: boolean;
    selectedCollectionPage: number;
    showAlbumsPage: boolean;
    showAllFoldersInCollection: boolean;
    showArtistsPage: boolean;
    showAudioVisualizer: boolean;
    showFoldersPage: boolean;
    showGenresPage: boolean;
    showIconInNotificationArea: boolean;
    showLove: boolean;
    showPlaylistsPage: boolean;
    showRating: boolean;
    showTracksPage: boolean;
    showWelcome: boolean;
    skipRemovedFilesDuringRefresh: boolean;
    theme: string;
    tracksPageColumnsOrder: string;
    tracksPageVisibleColumns: string;
    useLightBackgroundTheme: boolean;
    useSystemTitleBar: boolean;
    volume: number;

    get albumKeyIndex(): string {
        return '';
    }

    get defaultLanguage(): string {
        return '';
    }
}
