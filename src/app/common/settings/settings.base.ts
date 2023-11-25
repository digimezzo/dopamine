export abstract class SettingsBase {
    public abstract get defaultLanguage(): string;
    public abstract language: string;
    public abstract checkForUpdates: boolean;
    public abstract checkForUpdatesIncludesPreReleases: boolean;
    public abstract useSystemTitleBar: boolean;
    public abstract fontSize: number;
    public abstract theme: string;
    public abstract showWelcome: boolean;
    public abstract followSystemTheme: boolean;
    public abstract useLightBackgroundTheme: boolean;
    public abstract followSystemColor: boolean;
    public abstract skipRemovedFilesDuringRefresh: boolean;
    public abstract downloadMissingAlbumCovers: boolean;
    public abstract showAllFoldersInCollection: boolean;
    public abstract refreshCollectionAutomatically: boolean;
    public abstract albumsRightPaneWidthPercent: number;
    public abstract foldersLeftPaneWidthPercent: number;
    public abstract artistsLeftPaneWidthPercent: number;
    public abstract artistsRightPaneWidthPercent: number;
    public abstract genresLeftPaneWidthPercent: number;
    public abstract genresRightPaneWidthPercent: number;
    public abstract playlistsLeftPaneWidthPercent: number;
    public abstract playlistsRightPaneWidthPercent: number;
    public abstract volume: number;
    public abstract selectedCollectionTab: string;
    public abstract foldersTabOpenedFolder: string;
    public abstract foldersTabOpenedSubfolder: string;
    public abstract albumsTabSelectedAlbum: string;
    public abstract albumsTabSelectedAlbumOrder: string;
    public abstract albumsTabSelectedTrackOrder: string;
    public abstract artistsTabSelectedArtistType: string;
    public abstract artistsTabSelectedArtist: string;
    public abstract artistsTabSelectedArtistOrder: string;
    public abstract artistsTabSelectedAlbum: string;
    public abstract artistsTabSelectedAlbumOrder: string;
    public abstract artistsTabSelectedTrackOrder: string;
    public abstract genresTabSelectedGenre: string;
    public abstract genresTabSelectedAlbum: string;
    public abstract genresTabSelectedGenreOrder: string;
    public abstract genresTabSelectedAlbumOrder: string;
    public abstract genresTabSelectedTrackOrder: string;
    public abstract enableDiscordRichPresence: boolean;
    public abstract enableLastFmScrobbling: boolean;
    public abstract playlistsTabSelectedPlaylistFolder: string;
    public abstract playlistsTabSelectedPlaylist: string;
    public abstract playlistsTabSelectedPlaylistOrder: string;
    public abstract playlistsTabSelectedTrackOrder: string;
    public abstract showIconInNotificationArea: boolean;
    public abstract minimizeToNotificationArea: boolean;
    public abstract closeToNotificationArea: boolean;
    public abstract invertNotificationAreaIconColor: boolean;
    public abstract showArtistsPage: boolean;
    public abstract showGenresPage: boolean;
    public abstract showAlbumsPage: boolean;
    public abstract showTracksPage: boolean;
    public abstract showPlaylistsPage: boolean;
    public abstract showFoldersPage: boolean;
    public abstract showRating: boolean;
    public abstract saveRatingToAudioFiles: boolean;
    public abstract tracksPageVisibleColumns: string;
    public abstract tracksPageColumnsOrder: string;
    public abstract lastFmUsername: string;
    public abstract lastFmPassword: string;
    public abstract lastFmSessionKey: string;
    public abstract showLove: boolean;
    public abstract enableMultimediaKeys: boolean;
    public abstract downloadArtistInformationFromLastFm: boolean;
    public abstract downloadLyricsOnline: boolean;
    public abstract showAudioVisualizer: boolean;
}
