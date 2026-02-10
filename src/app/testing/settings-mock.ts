import { SettingsBase } from '../common/settings/settings.base';

export class SettingsMock implements SettingsBase {
    public albumKeyIndexMock: string = '';

    public async initializeAsync(): Promise<void> {
        return Promise.resolve();
    }
    public albumsDefinedByFolders: boolean;
    public albumsDefinedByTitle: boolean;
    public albumsDefinedByTitleAndArtist: boolean;
    public albumsRightPaneWidthPercent: number;
    public albumsTabSelectedAlbum: string;
    public albumsTabSelectedAlbumOrder: string;
    public albumsTabSelectedTrackOrder: string;
    public artistsLeftPaneWidthPercent: number;
    public artistsRightPaneWidthPercent: number;
    public artistsTabSelectedAlbum: string;
    public artistsTabSelectedAlbumOrder: string;
    public artistsTabSelectedArtist: string;
    public artistsTabSelectedArtistOrder: string;
    public artistsTabSelectedArtistType: string;
    public artistsTabSelectedTrackOrder: string;
    public audioVisualizerFrameRate: number;
    public audioVisualizerStyle: string;
    public checkForUpdates: boolean;
    public checkForUpdatesIncludesPreReleases: boolean;
    public closeToNotificationArea: boolean;
    public downloadArtistInformationFromLastFm: boolean;
    public downloadLyricsOnline: boolean;
    public downloadMissingAlbumCovers: boolean;
    public enableDiscordRichPresence: boolean;
    public enableLastFmScrobbling: boolean;
    public foldersLeftPaneWidthPercent: number;
    public foldersTabOpenedFolder: string;
    public foldersTabOpenedSubfolder: string;
    public foldersTabSelectedTrackOrder: string;
    public followSystemColor: boolean;
    public followAlbumCoverColor: boolean;
    public followSystemTheme: boolean;
    public fontSize: number;
    public genresLeftPaneWidthPercent: number;
    public genresRightPaneWidthPercent: number;
    public genresTabSelectedAlbum: string;
    public genresTabSelectedAlbumOrder: string;
    public genresTabSelectedGenre: string;
    public genresTabSelectedGenreOrder: string;
    public genresTabSelectedTrackOrder: string;
    public invertNotificationAreaIconColor: boolean;
    public keepPlaybackControlsVisibleOnNowPlayingPage: boolean;
    public language: string;
    public lastFmPassword: string;
    public lastFmSessionKey: string;
    public lastFmUsername: string;
    public minimizeToNotificationArea: boolean;
    public playlistsLeftPaneWidthPercent: number;
    public playlistsRightPaneWidthPercent: number;
    public playlistsTabSelectedPlaylist: string;
    public playlistsTabSelectedPlaylistFolder: string;
    public playlistsTabSelectedPlaylistOrder: string;
    public playlistsTabSelectedTrackOrder: string;
    public refreshCollectionAutomatically: boolean;
    public saveRatingToAudioFiles: boolean;
    public selectedCollectionPage: number;
    public showAlbumsPage: boolean;
    public showAllFoldersInCollection: boolean;
    public showArtistsPage: boolean;
    public showAudioVisualizer: boolean;
    public showFoldersPage: boolean;
    public showGenresPage: boolean;
    public showIconInNotificationArea: boolean;
    public showLove: boolean;
    public showPlaylistsPage: boolean;
    public showRating: boolean;
    public showTracksPage: boolean;
    public showWelcome: boolean;
    public skipRemovedFilesDuringRefresh: boolean;
    public theme: string;
    public tracksPageColumnsOrder: string;
    public tracksPageVisibleColumns: string;
    public useLightBackgroundTheme: boolean;
    public useSystemTitleBar: boolean;
    public volume: number;
    public playbackControlsLoop: number;
    public playbackControlsShuffle: number;
    public rememberPlaybackStateAfterRestart: boolean;
    public artistSplitSeparators: string;
    public artistSplitExceptions: string;
    public playerType: string;
    public fullPlayerPositionSizeMaximized: string;
    public coverPlayerPosition: string;
    public useGaplessPlayback: boolean;
    public useCrossfade: boolean;
    public crossfadeDuration: number;
    public jumpToPlayingSong: boolean;
    public showSquareImages: boolean;
    public useCompactYearView: boolean;

    public get albumKeyIndex(): string {
        return this.albumKeyIndexMock;
    }

    public get defaultLanguage(): string {
        return '';
    }
}
