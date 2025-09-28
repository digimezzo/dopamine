import { Injectable } from '@angular/core';
import Store from 'electron-store';
import { SettingsBase } from './settings.base';
import { Setting } from './setting';
import { StoreProxy } from './store-proxy';

@Injectable()
export class Settings implements SettingsBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly settings: Store<any>;

    private readonly _defaultLanguage = 'en';
    private readonly defaultCachedAlbumKeyIndex = '-1';
    private cachedAlbumKeyIndex: string = this.defaultCachedAlbumKeyIndex;

    private readonly _language = new Setting('language', this._defaultLanguage);
    private readonly _checkForUpdates = new Setting('checkForUpdates', true);
    private readonly _checkForUpdatesIncludesPreReleases = new Setting('checkForUpdatesIncludesPreReleases', true);
    private readonly _useSystemTitleBar = new Setting('useSystemTitleBar', false);
    private readonly _fontSize = new Setting('fontSize', 13);
    private readonly _theme = new Setting('theme', 'Dopamine');
    private readonly _showWelcome = new Setting('showWelcome', true);
    private readonly _followSystemTheme = new Setting('followSystemTheme', false);
    private readonly _useLightBackgroundTheme = new Setting('useLightBackgroundTheme', false);
    private readonly _followSystemColor = new Setting('followSystemColor', false);
    private readonly _followAlbumCoverColor = new Setting('followAlbumCoverColor', false);
    private readonly _skipRemovedFilesDuringRefresh = new Setting('skipRemovedFilesDuringRefresh', true);
    private readonly _downloadMissingAlbumCovers = new Setting('downloadMissingAlbumCovers', true);
    private readonly _showAllFoldersInCollection = new Setting('showAllFoldersInCollection', true);
    private readonly _refreshCollectionAutomatically = new Setting('refreshCollectionAutomatically', true);
    private readonly _albumsRightPaneWidthPercent = new Setting('albumsRightPaneWidthPercent', 30);
    private readonly _foldersLeftPaneWidthPercent = new Setting('foldersLeftPaneWidthPercent', 30);
    private readonly _artistsLeftPaneWidthPercent = new Setting('artistsLeftPaneWidthPercent', 25);
    private readonly _artistsRightPaneWidthPercent = new Setting('artistsRightPaneWidthPercent', 25);
    private readonly _genresLeftPaneWidthPercent = new Setting('genresLeftPaneWidthPercent', 25);
    private readonly _genresRightPaneWidthPercent = new Setting('genresRightPaneWidthPercent', 25);
    private readonly _playlistsLeftPaneWidthPercent = new Setting('playlistsLeftPaneWidthPercent', 25);
    private readonly _playlistsRightPaneWidthPercent = new Setting('playlistsRightPaneWidthPercent', 25);
    private readonly _volume = new Setting('volume', 0.5);
    private readonly _selectedCollectionPage = new Setting('selectedCollectionPage', 0);
    private readonly _foldersTabOpenedFolder = new Setting('foldersTabOpenedFolder', '');
    private readonly _foldersTabOpenedSubfolder = new Setting('foldersTabOpenedSubfolder', '');
    private readonly _albumsTabSelectedAlbum = new Setting('albumsTabSelectedAlbum', '');
    private readonly _albumsTabSelectedAlbumOrder = new Setting('albumsTabSelectedAlbumOrder', '');
    private readonly _albumsTabSelectedTrackOrder = new Setting('albumsTabSelectedTrackOrder', '');
    private readonly _artistsTabSelectedArtistType = new Setting('artistsTabSelectedArtistType', '');
    private readonly _artistsTabSelectedArtist = new Setting('artistsTabSelectedArtist', '');
    private readonly _artistsTabSelectedArtistOrder = new Setting('artistsTabSelectedArtistOrder', '');
    private readonly _artistsTabSelectedAlbum = new Setting('artistsTabSelectedAlbum', '');
    private readonly _artistsTabSelectedAlbumOrder = new Setting('artistsTabSelectedAlbumOrder', '');
    private readonly _artistsTabSelectedTrackOrder = new Setting('artistsTabSelectedTrackOrder', '');
    private readonly _genresTabSelectedGenre = new Setting('genresTabSelectedGenre', '');
    private readonly _genresTabSelectedAlbum = new Setting('genresTabSelectedAlbum', '');
    private readonly _genresTabSelectedGenreOrder = new Setting('genresTabSelectedGenreOrder', '');
    private readonly _genresTabSelectedAlbumOrder = new Setting('genresTabSelectedAlbumOrder', '');
    private readonly _genresTabSelectedTrackOrder = new Setting('genresTabSelectedTrackOrder', '');
    private readonly _playlistsTabSelectedPlaylistFolder = new Setting('playlistsTabSelectedPlaylistFolder', '');
    private readonly _playlistsTabSelectedPlaylist = new Setting('playlistsTabSelectedPlaylist', '');
    private readonly _playlistsTabSelectedPlaylistOrder = new Setting('playlistsTabSelectedPlaylistOrder', '');
    private readonly _playlistsTabSelectedTrackOrder = new Setting('playlistsTabSelectedTrackOrder', '');
    private readonly _enableDiscordRichPresence = new Setting('enableDiscordRichPresence', false);
    private readonly _enableLastFmScrobbling = new Setting('enableLastFmScrobbling', false);
    private readonly _showIconInNotificationArea = new Setting('showIconInNotificationArea', true);
    private readonly _minimizeToNotificationArea = new Setting('minimizeToNotificationArea', false);
    private readonly _closeToNotificationArea = new Setting('closeToNotificationArea', false);
    private readonly _invertNotificationAreaIconColor = new Setting('invertNotificationAreaIconColor', false);
    private readonly _showArtistsPage = new Setting('showArtistsPage', true);
    private readonly _showGenresPage = new Setting('showGenresPage', true);
    private readonly _showAlbumsPage = new Setting('showAlbumsPage', false);
    private readonly _showTracksPage = new Setting('showTracksPage', true);
    private readonly _showPlaylistsPage = new Setting('showPlaylistsPage', true);
    private readonly _showFoldersPage = new Setting('showFoldersPage', true);
    private readonly _showRating = new Setting('showRating', true);
    private readonly _saveRatingToAudioFiles = new Setting('saveRatingToAudioFiles', false);
    private readonly _tracksPageVisibleColumns = new Setting('tracksPageVisibleColumns', 'rating;artists;duration;number');
    private readonly _tracksPageColumnsOrder = new Setting('tracksPageColumnsOrder', '');
    private readonly _lastFmUsername = new Setting('lastFmUsername', '');
    private readonly _lastFmPassword = new Setting('lastFmPassword', '');
    private readonly _lastFmSessionKey = new Setting('lastFmSessionKey', '');
    private readonly _showLove = new Setting('showLove', false);
    private readonly _downloadArtistInformationFromLastFm = new Setting('downloadArtistInformationFromLastFm', true);
    private readonly _downloadLyricsOnline = new Setting('downloadLyricsOnline', true);
    private readonly _showAudioVisualizer = new Setting('showAudioVisualizer', true);
    private readonly _audioVisualizerStyle = new Setting('audioVisualizerStyle', 'flames');
    private readonly _audioVisualizerFrameRate = new Setting('audioVisualizerFrameRate', 10);
    private readonly _keepPlaybackControlsVisibleOnNowPlayingPage = new Setting('keepPlaybackControlsVisibleOnNowPlayingPage', false);
    private readonly _albumsDefinedByTitleAndArtist = new Setting('albumsDefinedByTitleAndArtist', true);
    private readonly _albumsDefinedByTitle = new Setting('albumsDefinedByTitle', false);
    private readonly _albumsDefinedByFolders = new Setting('albumsDefinedByFolders', false);
    private readonly _playbackControlsLoop = new Setting('playbackControlsLoop', 0);
    private readonly _playbackControlsShuffle = new Setting('playbackControlsShuffle', 0);
    private readonly _rememberPlaybackStateAfterRestart = new Setting('rememberPlaybackStateAfterRestart', true);
    private readonly _artistSplitSeparators = new Setting('artistSplitSeparators', '[feat.][ft.]');
    private readonly _artistSplitExceptions = new Setting('artistSplitExceptions', '');
    private readonly _playerType = new Setting('playerType', 'full');
    private readonly _fullPlayerPositionSizeMaximized = new Setting('fullPlayerPositionSizeMaximized', '50;50;1000;650;0');
    private readonly _coverPlayerPosition = new Setting('coverPlayerPosition', '50;50');
    private readonly _useGaplessPlayback = new Setting('useGaplessPlayback', false);
    private readonly _jumpToPlayingSong = new Setting('jumpToPlayingSong', true);

    private readonly allSettings = [
        this._language,
        this._checkForUpdates,
        this._checkForUpdatesIncludesPreReleases,
        this._useSystemTitleBar,
        this._fontSize,
        this._theme,
        this._showWelcome,
        this._followSystemTheme,
        this._useLightBackgroundTheme,
        this._followSystemColor,
        this._followAlbumCoverColor,
        this._skipRemovedFilesDuringRefresh,
        this._downloadMissingAlbumCovers,
        this._showAllFoldersInCollection,
        this._refreshCollectionAutomatically,
        this._albumsRightPaneWidthPercent,
        this._foldersLeftPaneWidthPercent,
        this._artistsLeftPaneWidthPercent,
        this._artistsRightPaneWidthPercent,
        this._genresLeftPaneWidthPercent,
        this._genresRightPaneWidthPercent,
        this._playlistsLeftPaneWidthPercent,
        this._playlistsRightPaneWidthPercent,
        this._volume,
        this._selectedCollectionPage,
        this._foldersTabOpenedFolder,
        this._foldersTabOpenedSubfolder,
        this._albumsTabSelectedAlbum,
        this._albumsTabSelectedAlbumOrder,
        this._albumsTabSelectedTrackOrder,
        this._artistsTabSelectedArtistType,
        this._artistsTabSelectedArtist,
        this._artistsTabSelectedArtistOrder,
        this._artistsTabSelectedAlbum,
        this._artistsTabSelectedAlbumOrder,
        this._artistsTabSelectedTrackOrder,
        this._genresTabSelectedGenre,
        this._genresTabSelectedAlbum,
        this._genresTabSelectedGenreOrder,
        this._genresTabSelectedAlbumOrder,
        this._genresTabSelectedTrackOrder,
        this._playlistsTabSelectedPlaylistFolder,
        this._playlistsTabSelectedPlaylist,
        this._playlistsTabSelectedPlaylistOrder,
        this._playlistsTabSelectedTrackOrder,
        this._enableDiscordRichPresence,
        this._enableLastFmScrobbling,
        this._showIconInNotificationArea,
        this._minimizeToNotificationArea,
        this._closeToNotificationArea,
        this._invertNotificationAreaIconColor,
        this._showArtistsPage,
        this._showGenresPage,
        this._showAlbumsPage,
        this._showTracksPage,
        this._showPlaylistsPage,
        this._showFoldersPage,
        this._showRating,
        this._saveRatingToAudioFiles,
        this._tracksPageVisibleColumns,
        this._tracksPageColumnsOrder,
        this._lastFmUsername,
        this._lastFmPassword,
        this._lastFmSessionKey,
        this._showLove,
        this._downloadArtistInformationFromLastFm,
        this._downloadLyricsOnline,
        this._showAudioVisualizer,
        this._audioVisualizerStyle,
        this._audioVisualizerFrameRate,
        this._keepPlaybackControlsVisibleOnNowPlayingPage,
        this._albumsDefinedByTitleAndArtist,
        this._albumsDefinedByTitle,
        this._albumsDefinedByFolders,
        this._playbackControlsLoop,
        this._playbackControlsShuffle,
        this._rememberPlaybackStateAfterRestart,
        this._artistSplitSeparators,
        this._artistSplitExceptions,
        this._playerType,
        this._fullPlayerPositionSizeMaximized,
        this._coverPlayerPosition,
        this._useGaplessPlayback,
        this._jumpToPlayingSong,
    ];

    public constructor(storeProxy: StoreProxy) {
        this.settings = storeProxy.store;
        this.initialize();
    }

    // defaultLanguage
    public get defaultLanguage(): string {
        return this._defaultLanguage;
    }

    // albumKeyIndex
    public get albumKeyIndex(): string {
        if (this.cachedAlbumKeyIndex === this.defaultCachedAlbumKeyIndex) {
            this.setCachedAlbumKeyIndex();
        }

        return this.cachedAlbumKeyIndex;
    }

    // language
    public get language(): string {
        return <string>this.settings.get(this._language.key);
    }

    public set language(v: string) {
        this.settings.set(this._language.key, v);
    }

    // checkForUpdates
    public get checkForUpdates(): boolean {
        return <boolean>this.settings.get(this._checkForUpdates.key);
    }

    public set checkForUpdates(v: boolean) {
        this.settings.set(this._checkForUpdates.key, v);
    }

    // checkForUpdatesIncludesPreReleases
    public get checkForUpdatesIncludesPreReleases(): boolean {
        return <boolean>this.settings.get(this._checkForUpdatesIncludesPreReleases.key);
    }

    public set checkForUpdatesIncludesPreReleases(v: boolean) {
        this.settings.set(this._checkForUpdatesIncludesPreReleases.key, v);
    }

    // useSystemTitleBar
    public get useSystemTitleBar(): boolean {
        return <boolean>this.settings.get(this._useSystemTitleBar.key);
    }

    public set useSystemTitleBar(v: boolean) {
        this.settings.set(this._useSystemTitleBar.key, v);
    }

    // fontSize
    public get fontSize(): number {
        return <number>this.settings.get(this._fontSize.key);
    }

    public set fontSize(v: number) {
        this.settings.set(this._fontSize.key, v);
    }

    // theme
    public get theme(): string {
        return <string>this.settings.get(this._theme.key);
    }

    public set theme(v: string) {
        this.settings.set(this._theme.key, v);
    }

    // showWelcome
    public get showWelcome(): boolean {
        return <boolean>this.settings.get(this._showWelcome.key);
    }

    public set showWelcome(v: boolean) {
        this.settings.set(this._showWelcome.key, v);
    }

    // followSystemTheme
    public get followSystemTheme(): boolean {
        return <boolean>this.settings.get(this._followSystemTheme.key);
    }

    public set followSystemTheme(v: boolean) {
        this.settings.set(this._followSystemTheme.key, v);
    }

    // useLightBackgroundTheme
    public get useLightBackgroundTheme(): boolean {
        return <boolean>this.settings.get(this._useLightBackgroundTheme.key);
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.set(this._useLightBackgroundTheme.key, v);
    }

    // followSystemColor
    public get followSystemColor(): boolean {
        return <boolean>this.settings.get(this._followSystemColor.key);
    }

    public set followSystemColor(v: boolean) {
        this.settings.set(this._followSystemColor.key, v);
    }

    // followAlbumCoverColor
    public get followAlbumCoverColor(): boolean {
        return <boolean>this.settings.get(this._followAlbumCoverColor.key);
    }

    public set followAlbumCoverColor(v: boolean) {
        this.settings.set(this._followAlbumCoverColor.key, v);
    }

    // skipRemovedFilesDuringRefresh
    public get skipRemovedFilesDuringRefresh(): boolean {
        return <boolean>this.settings.get(this._skipRemovedFilesDuringRefresh.key);
    }

    public set skipRemovedFilesDuringRefresh(v: boolean) {
        this.settings.set(this._skipRemovedFilesDuringRefresh.key, v);
    }

    // downloadMissingAlbumCovers
    public get downloadMissingAlbumCovers(): boolean {
        return <boolean>this.settings.get(this._downloadMissingAlbumCovers.key);
    }

    public set downloadMissingAlbumCovers(v: boolean) {
        this.settings.set(this._downloadMissingAlbumCovers.key, v);
    }

    // showAllFoldersInCollection
    public get showAllFoldersInCollection(): boolean {
        return <boolean>this.settings.get(this._showAllFoldersInCollection.key);
    }

    public set showAllFoldersInCollection(v: boolean) {
        this.settings.set(this._showAllFoldersInCollection.key, v);
    }

    // refreshCollectionAutomatically
    public get refreshCollectionAutomatically(): boolean {
        return <boolean>this.settings.get(this._refreshCollectionAutomatically.key);
    }

    public set refreshCollectionAutomatically(v: boolean) {
        this.settings.set(this._refreshCollectionAutomatically.key, v);
    }

    // albumsRightPaneWidthPercent
    public get albumsRightPaneWidthPercent(): number {
        return <number>this.settings.get(this._albumsRightPaneWidthPercent.key);
    }

    public set albumsRightPaneWidthPercent(v: number) {
        this.settings.set(this._albumsRightPaneWidthPercent.key, v);
    }

    // foldersLeftPaneWidthPercent
    public get foldersLeftPaneWidthPercent(): number {
        return <number>this.settings.get(this._foldersLeftPaneWidthPercent.key);
    }

    public set foldersLeftPaneWidthPercent(v: number) {
        this.settings.set(this._foldersLeftPaneWidthPercent.key, v);
    }

    // artistsLeftPaneWidthPercent
    public get artistsLeftPaneWidthPercent(): number {
        return <number>this.settings.get(this._artistsLeftPaneWidthPercent.key);
    }

    public set artistsLeftPaneWidthPercent(v: number) {
        this.settings.set(this._artistsLeftPaneWidthPercent.key, v);
    }

    // artistsRightPaneWidthPercent
    public get artistsRightPaneWidthPercent(): number {
        return <number>this.settings.get(this._artistsRightPaneWidthPercent.key);
    }

    public set artistsRightPaneWidthPercent(v: number) {
        this.settings.set(this._artistsRightPaneWidthPercent.key, v);
    }

    // genresLeftPaneWidthPercent
    public get genresLeftPaneWidthPercent(): number {
        return <number>this.settings.get(this._genresLeftPaneWidthPercent.key);
    }

    public set genresLeftPaneWidthPercent(v: number) {
        this.settings.set(this._genresLeftPaneWidthPercent.key, v);
    }

    // genresRightPaneWidthPercent
    public get genresRightPaneWidthPercent(): number {
        return <number>this.settings.get(this._genresRightPaneWidthPercent.key);
    }

    public set genresRightPaneWidthPercent(v: number) {
        this.settings.set(this._genresRightPaneWidthPercent.key, v);
    }

    // playlistsLeftPaneWidthPercent
    public get playlistsLeftPaneWidthPercent(): number {
        return <number>this.settings.get(this._playlistsLeftPaneWidthPercent.key);
    }

    public set playlistsLeftPaneWidthPercent(v: number) {
        this.settings.set(this._playlistsLeftPaneWidthPercent.key, v);
    }

    // playlistsRightPaneWidthPercent
    public get playlistsRightPaneWidthPercent(): number {
        return <number>this.settings.get(this._playlistsRightPaneWidthPercent.key);
    }

    public set playlistsRightPaneWidthPercent(v: number) {
        this.settings.set(this._playlistsRightPaneWidthPercent.key, v);
    }

    // volume
    public get volume(): number {
        return <number>this.settings.get(this._volume.key);
    }

    public set volume(v: number) {
        this.settings.set(this._volume.key, v);
    }

    // selectedCollectionPage
    public get selectedCollectionPage(): number {
        return <number>this.settings.get(this._selectedCollectionPage.key);
    }

    public set selectedCollectionPage(v: number) {
        this.settings.set(this._selectedCollectionPage.key, v);
    }

    // foldersTabOpenedFolder
    public get foldersTabOpenedFolder(): string {
        return <string>this.settings.get(this._foldersTabOpenedFolder.key);
    }

    public set foldersTabOpenedFolder(v: string) {
        this.settings.set(this._foldersTabOpenedFolder.key, v);
    }

    // foldersTabOpenedSubfolder
    public get foldersTabOpenedSubfolder(): string {
        return <string>this.settings.get(this._foldersTabOpenedSubfolder.key);
    }

    public set foldersTabOpenedSubfolder(v: string) {
        this.settings.set(this._foldersTabOpenedSubfolder.key, v);
    }

    // albumsTabSelectedAlbum
    public get albumsTabSelectedAlbum(): string {
        return <string>this.settings.get(this._albumsTabSelectedAlbum.key);
    }

    public set albumsTabSelectedAlbum(v: string) {
        this.settings.set(this._albumsTabSelectedAlbum.key, v);
    }

    // albumsTabSelectedAlbumOrder
    public get albumsTabSelectedAlbumOrder(): string {
        return <string>this.settings.get(this._albumsTabSelectedAlbumOrder.key);
    }

    public set albumsTabSelectedAlbumOrder(v: string) {
        this.settings.set(this._albumsTabSelectedAlbumOrder.key, v);
    }

    // albumsTabSelectedTrackOrder
    public get albumsTabSelectedTrackOrder(): string {
        return <string>this.settings.get(this._albumsTabSelectedTrackOrder.key);
    }

    public set albumsTabSelectedTrackOrder(v: string) {
        this.settings.set(this._albumsTabSelectedTrackOrder.key, v);
    }

    // artistsTabSelectedArtistType
    public get artistsTabSelectedArtistType(): string {
        return <string>this.settings.get(this._artistsTabSelectedArtistType.key);
    }

    public set artistsTabSelectedArtistType(v: string) {
        this.settings.set(this._artistsTabSelectedArtistType.key, v);
    }

    // artistsTabSelectedArtist
    public get artistsTabSelectedArtist(): string {
        return <string>this.settings.get(this._artistsTabSelectedArtist.key);
    }

    public set artistsTabSelectedArtist(v: string) {
        this.settings.set(this._artistsTabSelectedArtist.key, v);
    }

    // artistsTabSelectedArtistOrder
    public get artistsTabSelectedArtistOrder(): string {
        return <string>this.settings.get(this._artistsTabSelectedArtistOrder.key);
    }

    public set artistsTabSelectedArtistOrder(v: string) {
        this.settings.set(this._artistsTabSelectedArtistOrder.key, v);
    }

    // artistsTabSelectedAlbum
    public get artistsTabSelectedAlbum(): string {
        return <string>this.settings.get(this._artistsTabSelectedAlbum.key);
    }

    public set artistsTabSelectedAlbum(v: string) {
        this.settings.set(this._artistsTabSelectedAlbum.key, v);
    }

    // artistsTabSelectedAlbumOrder
    public get artistsTabSelectedAlbumOrder(): string {
        return <string>this.settings.get(this._artistsTabSelectedAlbumOrder.key);
    }

    public set artistsTabSelectedAlbumOrder(v: string) {
        this.settings.set(this._artistsTabSelectedAlbumOrder.key, v);
    }

    // artistsTabSelectedTrackOrder
    public get artistsTabSelectedTrackOrder(): string {
        return <string>this.settings.get(this._artistsTabSelectedTrackOrder.key);
    }

    public set artistsTabSelectedTrackOrder(v: string) {
        this.settings.set(this._artistsTabSelectedTrackOrder.key, v);
    }

    // genresTabSelectedGenre
    public get genresTabSelectedGenre(): string {
        return <string>this.settings.get(this._genresTabSelectedGenre.key);
    }

    public set genresTabSelectedGenre(v: string) {
        this.settings.set(this._genresTabSelectedGenre.key, v);
    }

    // genresTabSelectedAlbum
    public get genresTabSelectedAlbum(): string {
        return <string>this.settings.get(this._genresTabSelectedAlbum.key);
    }

    public set genresTabSelectedAlbum(v: string) {
        this.settings.set(this._genresTabSelectedAlbum.key, v);
    }

    // genresTabSelectedGenreOrder
    public get genresTabSelectedGenreOrder(): string {
        return <string>this.settings.get(this._genresTabSelectedGenreOrder.key);
    }

    public set genresTabSelectedGenreOrder(v: string) {
        this.settings.set(this._genresTabSelectedGenreOrder.key, v);
    }

    // genresTabSelectedAlbumOrder
    public get genresTabSelectedAlbumOrder(): string {
        return <string>this.settings.get(this._genresTabSelectedAlbumOrder.key);
    }

    public set genresTabSelectedAlbumOrder(v: string) {
        this.settings.set(this._genresTabSelectedAlbumOrder.key, v);
    }

    // genresTabSelectedTrackOrder
    public get genresTabSelectedTrackOrder(): string {
        return <string>this.settings.get(this._genresTabSelectedTrackOrder.key);
    }

    public set genresTabSelectedTrackOrder(v: string) {
        this.settings.set(this._genresTabSelectedTrackOrder.key, v);
    }

    // playlistsTabSelectedPlaylistFolder
    public get playlistsTabSelectedPlaylistFolder(): string {
        return <string>this.settings.get(this._playlistsTabSelectedPlaylistFolder.key);
    }

    public set playlistsTabSelectedPlaylistFolder(v: string) {
        this.settings.set(this._playlistsTabSelectedPlaylistFolder.key, v);
    }

    // playlistsTabSelectedPlaylist
    public get playlistsTabSelectedPlaylist(): string {
        return <string>this.settings.get(this._playlistsTabSelectedPlaylist.key);
    }

    public set playlistsTabSelectedPlaylist(v: string) {
        this.settings.set(this._playlistsTabSelectedPlaylist.key, v);
    }

    // playlistsTabSelectedPlaylistOrder
    public get playlistsTabSelectedPlaylistOrder(): string {
        return <string>this.settings.get(this._playlistsTabSelectedPlaylistOrder.key);
    }

    public set playlistsTabSelectedPlaylistOrder(v: string) {
        this.settings.set(this._playlistsTabSelectedPlaylistOrder.key, v);
    }

    // playlistsTabSelectedTrackOrder
    public get playlistsTabSelectedTrackOrder(): string {
        return <string>this.settings.get(this._playlistsTabSelectedTrackOrder.key);
    }

    public set playlistsTabSelectedTrackOrder(v: string) {
        this.settings.set(this._playlistsTabSelectedTrackOrder.key, v);
    }

    // enableDiscordRichPresence
    public get enableDiscordRichPresence(): boolean {
        return <boolean>this.settings.get(this._enableDiscordRichPresence.key);
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.set(this._enableDiscordRichPresence.key, v);
    }

    // enableLastFmScrobbling
    public get enableLastFmScrobbling(): boolean {
        return <boolean>this.settings.get(this._enableLastFmScrobbling.key);
    }

    public set enableLastFmScrobbling(v: boolean) {
        this.settings.set(this._enableLastFmScrobbling.key, v);
    }

    // showIconInNotificationArea
    public get showIconInNotificationArea(): boolean {
        return <boolean>this.settings.get(this._showIconInNotificationArea.key);
    }

    public set showIconInNotificationArea(v: boolean) {
        this.settings.set(this._showIconInNotificationArea.key, v);
    }

    // minimizeToNotificationArea
    public get minimizeToNotificationArea(): boolean {
        return <boolean>this.settings.get(this._minimizeToNotificationArea.key);
    }

    public set minimizeToNotificationArea(v: boolean) {
        this.settings.set(this._minimizeToNotificationArea.key, v);
    }

    // closeToNotificationArea
    public get closeToNotificationArea(): boolean {
        return <boolean>this.settings.get(this._closeToNotificationArea.key);
    }

    public set closeToNotificationArea(v: boolean) {
        this.settings.set(this._closeToNotificationArea.key, v);
    }

    // invertNotificationAreaIconColor
    public get invertNotificationAreaIconColor(): boolean {
        return <boolean>this.settings.get(this._invertNotificationAreaIconColor.key);
    }

    public set invertNotificationAreaIconColor(v: boolean) {
        this.settings.set(this._invertNotificationAreaIconColor.key, v);
    }

    // showArtistsPage
    public get showArtistsPage(): boolean {
        return <boolean>this.settings.get(this._showArtistsPage.key);
    }

    public set showArtistsPage(v: boolean) {
        this.settings.set(this._showArtistsPage.key, v);
    }

    // showGenresPage
    public get showGenresPage(): boolean {
        return <boolean>this.settings.get(this._showGenresPage.key);
    }

    public set showGenresPage(v: boolean) {
        this.settings.set(this._showGenresPage.key, v);
    }

    // showAlbumsPage
    public get showAlbumsPage(): boolean {
        return <boolean>this.settings.get(this._showAlbumsPage.key);
    }

    public set showAlbumsPage(v: boolean) {
        this.settings.set(this._showAlbumsPage.key, v);
    }

    // showTracksPage
    public get showTracksPage(): boolean {
        return <boolean>this.settings.get(this._showTracksPage.key);
    }

    public set showTracksPage(v: boolean) {
        this.settings.set(this._showTracksPage.key, v);
    }

    // showPlaylistsPage
    public get showPlaylistsPage(): boolean {
        return <boolean>this.settings.get(this._showPlaylistsPage.key);
    }

    public set showPlaylistsPage(v: boolean) {
        this.settings.set(this._showPlaylistsPage.key, v);
    }

    // showFoldersPage
    public get showFoldersPage(): boolean {
        return <boolean>this.settings.get(this._showFoldersPage.key);
    }

    public set showFoldersPage(v: boolean) {
        this.settings.set(this._showFoldersPage.key, v);
    }

    // saveRatingToAudioFiles
    public get saveRatingToAudioFiles(): boolean {
        return <boolean>this.settings.get(this._saveRatingToAudioFiles.key);
    }

    public set saveRatingToAudioFiles(v: boolean) {
        this.settings.set(this._saveRatingToAudioFiles.key, v);
    }

    // showRating
    public get showRating(): boolean {
        return <boolean>this.settings.get(this._showRating.key);
    }

    public set showRating(v: boolean) {
        this.settings.set(this._showRating.key, v);
    }

    // tracksPageVisibleColumns
    public get tracksPageVisibleColumns(): string {
        return <string>this.settings.get(this._tracksPageVisibleColumns.key);
    }

    public set tracksPageVisibleColumns(v: string) {
        this.settings.set(this._tracksPageVisibleColumns.key, v);
    }

    // tracksPageColumnsOrder
    public get tracksPageColumnsOrder(): string {
        return <string>this.settings.get(this._tracksPageColumnsOrder.key);
    }

    public set tracksPageColumnsOrder(v: string) {
        this.settings.set(this._tracksPageColumnsOrder.key, v);
    }

    // lastFmUsername
    public get lastFmUsername(): string {
        return <string>this.settings.get(this._lastFmUsername.key);
    }

    public set lastFmUsername(v: string) {
        this.settings.set(this._lastFmUsername.key, v);
    }

    // lastFmPassword
    public get lastFmPassword(): string {
        return <string>this.settings.get(this._lastFmPassword.key);
    }

    public set lastFmPassword(v: string) {
        this.settings.set(this._lastFmPassword.key, v);
    }

    // lastFmSessionKey
    public get lastFmSessionKey(): string {
        return <string>this.settings.get(this._lastFmSessionKey.key);
    }

    public set lastFmSessionKey(v: string) {
        this.settings.set(this._lastFmSessionKey.key, v);
    }

    // showLove
    public get showLove(): boolean {
        return <boolean>this.settings.get(this._showLove.key);
    }

    public set showLove(v: boolean) {
        this.settings.set(this._showLove.key, v);
    }

    // downloadArtistInformationFromLastFm
    public get downloadArtistInformationFromLastFm(): boolean {
        return <boolean>this.settings.get(this._downloadArtistInformationFromLastFm.key);
    }

    public set downloadArtistInformationFromLastFm(v: boolean) {
        this.settings.set(this._downloadArtistInformationFromLastFm.key, v);
    }

    // downloadLyricsOnline
    public get downloadLyricsOnline(): boolean {
        return <boolean>this.settings.get(this._downloadLyricsOnline.key);
    }

    public set downloadLyricsOnline(v: boolean) {
        this.settings.set(this._downloadLyricsOnline.key, v);
    }

    // showAudioVisualizer
    public get showAudioVisualizer(): boolean {
        return <boolean>this.settings.get(this._showAudioVisualizer.key);
    }

    public set showAudioVisualizer(v: boolean) {
        this.settings.set(this._showAudioVisualizer.key, v);
    }

    // audioVisualizerStyle
    public get audioVisualizerStyle(): string {
        return <string>this.settings.get(this._audioVisualizerStyle.key);
    }

    public set audioVisualizerStyle(v: string) {
        this.settings.set(this._audioVisualizerStyle.key, v);
    }

    // audioVisualizerFrameRate
    public get audioVisualizerFrameRate(): number {
        return <number>this.settings.get(this._audioVisualizerFrameRate.key);
    }

    public set audioVisualizerFrameRate(v: number) {
        this.settings.set(this._audioVisualizerFrameRate.key, v);
    }

    // keepPlaybackControlsVisibleOnNowPlayingPage
    public get keepPlaybackControlsVisibleOnNowPlayingPage(): boolean {
        return <boolean>this.settings.get(this._keepPlaybackControlsVisibleOnNowPlayingPage.key);
    }

    public set keepPlaybackControlsVisibleOnNowPlayingPage(v: boolean) {
        this.settings.set(this._keepPlaybackControlsVisibleOnNowPlayingPage.key, v);
    }

    // albumsDefinedByTitleAndArtist
    public get albumsDefinedByTitleAndArtist(): boolean {
        return <boolean>this.settings.get(this._albumsDefinedByTitleAndArtist.key);
    }

    public set albumsDefinedByTitleAndArtist(v: boolean) {
        this.settings.set(this._albumsDefinedByTitleAndArtist.key, v);
        this.setCachedAlbumKeyIndex();
    }

    // albumsDefinedByTitle
    public get albumsDefinedByTitle(): boolean {
        return <boolean>this.settings.get(this._albumsDefinedByTitle.key);
    }

    public set albumsDefinedByTitle(v: boolean) {
        this.settings.set(this._albumsDefinedByTitle.key, v);
        this.setCachedAlbumKeyIndex();
    }

    // albumsDefinedByFolders
    public get albumsDefinedByFolders(): boolean {
        return <boolean>this.settings.get(this._albumsDefinedByFolders.key);
    }

    public set albumsDefinedByFolders(v: boolean) {
        this.settings.set(this._albumsDefinedByFolders.key, v);
        this.setCachedAlbumKeyIndex();
    }

    // playbackControlsLoop
    public get playbackControlsLoop(): number {
        return <number>this.settings.get(this._playbackControlsLoop.key);
    }

    public set playbackControlsLoop(v: number) {
        this.settings.set(this._playbackControlsLoop.key, v);
    }

    // playbackControlsShuffle
    public get playbackControlsShuffle(): number {
        return <number>this.settings.get(this._playbackControlsShuffle.key);
    }

    public set playbackControlsShuffle(v: number) {
        this.settings.set(this._playbackControlsShuffle.key, v);
    }

    // rememberPlaybackStateAfterRestart
    public get rememberPlaybackStateAfterRestart(): boolean {
        return <boolean>this.settings.get(this._rememberPlaybackStateAfterRestart.key);
    }

    public set rememberPlaybackStateAfterRestart(v: boolean) {
        this.settings.set(this._rememberPlaybackStateAfterRestart.key, v);
    }

    // artistSplitSeparators
    public get artistSplitSeparators(): string {
        return <string>this.settings.get(this._artistSplitSeparators.key);
    }

    public set artistSplitSeparators(v: string) {
        this.settings.set(this._artistSplitSeparators.key, v);
    }

    // artistSplitExceptions
    public get artistSplitExceptions(): string {
        return <string>this.settings.get(this._artistSplitExceptions.key);
    }

    public set artistSplitExceptions(v: string) {
        this.settings.set(this._artistSplitExceptions.key, v);
    }

    // playerType
    public get playerType(): string {
        return <string>this.settings.get(this._playerType.key);
    }

    public set playerType(v: string) {
        this.settings.set(this._playerType.key, v);
    }

    // fullPlayerPositionSizeMaximized
    public get fullPlayerPositionSizeMaximized(): string {
        return <string>this.settings.get(this._fullPlayerPositionSizeMaximized.key);
    }

    public set fullPlayerPositionSizeMaximized(v: string) {
        this.settings.set(this._fullPlayerPositionSizeMaximized.key, v);
    }

    // coverPlayerPosition
    public get coverPlayerPosition(): string {
        return <string>this.settings.get(this._coverPlayerPosition.key);
    }

    public set coverPlayerPosition(v: string) {
        this.settings.set(this._coverPlayerPosition.key, v);
    }

    // useGaplessPlayback
    public get useGaplessPlayback(): boolean {
        return <boolean>this.settings.get(this._useGaplessPlayback.key);
    }

    public set useGaplessPlayback(v: boolean) {
        this.settings.set(this._useGaplessPlayback.key, v);
    }

    // jumpToPlayingSong
    public get jumpToPlayingSong(): boolean {
        return <boolean>this.settings.get(this._jumpToPlayingSong.key);
    }

    public set jumpToPlayingSong(v: boolean) {
        this.settings.set(this._jumpToPlayingSong.key, v);
    }

    // Initialize
    private initialize(): void {
        for (const setting of this.allSettings) {
            if (!this.settings.has(setting.key)) {
                this[setting.key] = setting.defaultValue;
            }
        }
    }

    private setCachedAlbumKeyIndex(): void {
        if (this.albumsDefinedByFolders) {
            this.cachedAlbumKeyIndex = '3';
            return;
        }

        if (this.albumsDefinedByTitle) {
            this.cachedAlbumKeyIndex = '2';
            return;
        }

        this.cachedAlbumKeyIndex = '';
    }
}
