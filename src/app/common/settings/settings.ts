/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@angular/core';
import { SettingsBase } from './settings.base';
import { ipcRenderer } from 'electron';

@Injectable()
export class Settings implements SettingsBase {
    private cachedAlbumKeyIndex: string = '-1';

    private cache = new Map<string, any>();
    private ready = false;

    private get<T>(key: string): T {
        if (!this.ready) throw new Error('Settings not initialized yet');
        return this.cache.get(key);
    }

    private async set<T>(key: string, value: T) {
        this.cache.set(key, value);
        await ipcRenderer.invoke('settings:set', key, value);
    }

    public async initializeAsync(): Promise<void> {
        const all = await ipcRenderer.invoke('settings:getAll');
        Object.entries(all).forEach(([k, v]) => this.cache.set(k, v));
        this.ready = true;
    }

    // defaultLanguage
    public get defaultLanguage(): string {
        return 'en';
    }

    // language
    public get language(): string {
        return this.get<string>('language');
    }

    public set language(v: string) {
        this.set<string>('language', v);
    }

    // albumKeyIndex
    public get albumKeyIndex(): string {
        if (this.cachedAlbumKeyIndex === '-1') {
            this.setCachedAlbumKeyIndex();
        }

        return this.cachedAlbumKeyIndex;
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

    // checkForUpdates
    public get checkForUpdates(): boolean {
        return this.get<boolean>('checkForUpdates');
    }

    public set checkForUpdates(v: boolean) {
        this.set('checkForUpdates', v);
    }

    // checkForUpdatesIncludesPreReleases
    public get checkForUpdatesIncludesPreReleases(): boolean {
        return this.get<boolean>('checkForUpdatesIncludesPreReleases');
    }

    public set checkForUpdatesIncludesPreReleases(v: boolean) {
        this.set('checkForUpdatesIncludesPreReleases', v);
    }

    // useSystemTitleBar
    public get useSystemTitleBar(): boolean {
        return this.get<boolean>('useSystemTitleBar');
    }

    public set useSystemTitleBar(v: boolean) {
        this.set('useSystemTitleBar', v);
    }

    // fontSize
    public get fontSize(): number {
        return this.get<number>('fontSize');
    }

    public set fontSize(v: number) {
        this.set('fontSize', v);
    }

    // theme
    public get theme(): string {
        return this.get<string>('theme');
    }

    public set theme(v: string) {
        this.set('theme', v);
    }

    // showWelcome
    public get showWelcome(): boolean {
        return this.get<boolean>('showWelcome');
    }

    public set showWelcome(v: boolean) {
        this.set('showWelcome', v);
    }

    // followSystemTheme
    public get followSystemTheme(): boolean {
        return this.get<boolean>('followSystemTheme');
    }

    public set followSystemTheme(v: boolean) {
        this.set('followSystemTheme', v);
    }

    // useLightBackgroundTheme
    public get useLightBackgroundTheme(): boolean {
        return this.get<boolean>('useLightBackgroundTheme');
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.set('useLightBackgroundTheme', v);
    }

    // followSystemColor
    public get followSystemColor(): boolean {
        return this.get<boolean>('followSystemColor');
    }

    public set followSystemColor(v: boolean) {
        this.set('followSystemColor', v);
    }

    // followAlbumCoverColor
    public get followAlbumCoverColor(): boolean {
        return this.get<boolean>('followAlbumCoverColor');
    }

    public set followAlbumCoverColor(v: boolean) {
        this.set('followAlbumCoverColor', v);
    }

    // skipRemovedFilesDuringRefresh
    public get skipRemovedFilesDuringRefresh(): boolean {
        return this.get<boolean>('skipRemovedFilesDuringRefresh');
    }

    public set skipRemovedFilesDuringRefresh(v: boolean) {
        this.set('skipRemovedFilesDuringRefresh', v);
    }

    // downloadMissingAlbumCovers
    public get downloadMissingAlbumCovers(): boolean {
        return this.get<boolean>('downloadMissingAlbumCovers');
    }

    public set downloadMissingAlbumCovers(v: boolean) {
        this.set('downloadMissingAlbumCovers', v);
    }

    // showAllFoldersInCollection
    public get showAllFoldersInCollection(): boolean {
        return this.get<boolean>('showAllFoldersInCollection');
    }

    public set showAllFoldersInCollection(v: boolean) {
        this.set('showAllFoldersInCollection', v);
    }

    // refreshCollectionAutomatically
    public get refreshCollectionAutomatically(): boolean {
        return this.get<boolean>('refreshCollectionAutomatically');
    }

    public set refreshCollectionAutomatically(v: boolean) {
        this.set('refreshCollectionAutomatically', v);
    }

    // albumsRightPaneWidthPercent
    public get albumsRightPaneWidthPercent(): number {
        return this.get<number>('albumsRightPaneWidthPercent');
    }

    public set albumsRightPaneWidthPercent(v: number) {
        this.set('albumsRightPaneWidthPercent', v);
    }

    // foldersLeftPaneWidthPercent
    public get foldersLeftPaneWidthPercent(): number {
        return this.get<number>('foldersLeftPaneWidthPercent');
    }

    public set foldersLeftPaneWidthPercent(v: number) {
        this.set('foldersLeftPaneWidthPercent', v);
    }

    // artistsLeftPaneWidthPercent
    public get artistsLeftPaneWidthPercent(): number {
        return this.get<number>('artistsLeftPaneWidthPercent');
    }

    public set artistsLeftPaneWidthPercent(v: number) {
        this.set('artistsLeftPaneWidthPercent', v);
    }

    // artistsRightPaneWidthPercent
    public get artistsRightPaneWidthPercent(): number {
        return this.get<number>('artistsRightPaneWidthPercent');
    }

    public set artistsRightPaneWidthPercent(v: number) {
        this.set('artistsRightPaneWidthPercent', v);
    }

    // genresLeftPaneWidthPercent
    public get genresLeftPaneWidthPercent(): number {
        return this.get<number>('genresLeftPaneWidthPercent');
    }

    public set genresLeftPaneWidthPercent(v: number) {
        this.set('genresLeftPaneWidthPercent', v);
    }

    // genresRightPaneWidthPercent
    public get genresRightPaneWidthPercent(): number {
        return this.get<number>('genresRightPaneWidthPercent');
    }

    public set genresRightPaneWidthPercent(v: number) {
        this.set('genresRightPaneWidthPercent', v);
    }

    // playlistsLeftPaneWidthPercent
    public get playlistsLeftPaneWidthPercent(): number {
        return this.get<number>('playlistsLeftPaneWidthPercent');
    }

    public set playlistsLeftPaneWidthPercent(v: number) {
        this.set('playlistsLeftPaneWidthPercent', v);
    }

    // playlistsRightPaneWidthPercent
    public get playlistsRightPaneWidthPercent(): number {
        return this.get<number>('playlistsRightPaneWidthPercent');
    }

    public set playlistsRightPaneWidthPercent(v: number) {
        this.set('playlistsRightPaneWidthPercent', v);
    }

    // volume
    public get volume(): number {
        return this.get<number>('volume');
    }

    public set volume(v: number) {
        this.set('volume', v);
    }

    // selectedCollectionPage
    public get selectedCollectionPage(): number {
        return this.get<number>('selectedCollectionPage');
    }

    public set selectedCollectionPage(v: number) {
        this.set('selectedCollectionPage', v);
    }

    // foldersTabOpenedFolder
    public get foldersTabOpenedFolder(): string {
        return this.get<string>('foldersTabOpenedFolder');
    }

    public set foldersTabOpenedFolder(v: string) {
        this.set('foldersTabOpenedFolder', v);
    }

    // foldersTabOpenedSubfolder
    public get foldersTabOpenedSubfolder(): string {
        return this.get<string>('foldersTabOpenedSubfolder');
    }

    public set foldersTabOpenedSubfolder(v: string) {
        this.set('foldersTabOpenedSubfolder', v);
    }

    // foldersTabSelectedTrackOrder
    public get foldersTabSelectedTrackOrder(): string {
        return this.get<string>('foldersTabSelectedTrackOrder');
    }

    public set foldersTabSelectedTrackOrder(v: string) {
        this.set('foldersTabSelectedTrackOrder', v);
    }

    // albumsTabSelectedAlbum
    public get albumsTabSelectedAlbum(): string {
        return this.get<string>('albumsTabSelectedAlbum');
    }

    public set albumsTabSelectedAlbum(v: string) {
        this.set('albumsTabSelectedAlbum', v);
    }

    // albumsTabSelectedAlbumOrder
    public get albumsTabSelectedAlbumOrder(): string {
        return this.get<string>('albumsTabSelectedAlbumOrder');
    }

    public set albumsTabSelectedAlbumOrder(v: string) {
        this.set('albumsTabSelectedAlbumOrder', v);
    }

    // albumsTabSelectedTrackOrder
    public get albumsTabSelectedTrackOrder(): string {
        return this.get<string>('albumsTabSelectedTrackOrder');
    }

    public set albumsTabSelectedTrackOrder(v: string) {
        this.set('albumsTabSelectedTrackOrder', v);
    }

    // artistsTabSelectedArtistType
    public get artistsTabSelectedArtistType(): string {
        return this.get<string>('artistsTabSelectedArtistType');
    }

    public set artistsTabSelectedArtistType(v: string) {
        this.set('artistsTabSelectedArtistType', v);
    }

    // artistsTabSelectedArtist
    public get artistsTabSelectedArtist(): string {
        return this.get<string>('artistsTabSelectedArtist');
    }

    public set artistsTabSelectedArtist(v: string) {
        this.set('artistsTabSelectedArtist', v);
    }

    // artistsTabSelectedArtistOrder
    public get artistsTabSelectedArtistOrder(): string {
        return this.get<string>('artistsTabSelectedArtistOrder');
    }

    public set artistsTabSelectedArtistOrder(v: string) {
        this.set('artistsTabSelectedArtistOrder', v);
    }

    // artistsTabSelectedAlbum
    public get artistsTabSelectedAlbum(): string {
        return this.get<string>('artistsTabSelectedAlbum');
    }

    public set artistsTabSelectedAlbum(v: string) {
        this.set('artistsTabSelectedAlbum', v);
    }

    // artistsTabSelectedAlbumOrder
    public get artistsTabSelectedAlbumOrder(): string {
        return this.get<string>('artistsTabSelectedAlbumOrder');
    }

    public set artistsTabSelectedAlbumOrder(v: string) {
        this.set('artistsTabSelectedAlbumOrder', v);
    }

    // artistsTabSelectedTrackOrder
    public get artistsTabSelectedTrackOrder(): string {
        return this.get<string>('artistsTabSelectedTrackOrder');
    }

    public set artistsTabSelectedTrackOrder(v: string) {
        this.set('artistsTabSelectedTrackOrder', v);
    }

    // genresTabSelectedGenre
    public get genresTabSelectedGenre(): string {
        return this.get<string>('genresTabSelectedGenre');
    }

    public set genresTabSelectedGenre(v: string) {
        this.set('genresTabSelectedGenre', v);
    }

    // genresTabSelectedAlbum
    public get genresTabSelectedAlbum(): string {
        return this.get<string>('genresTabSelectedAlbum');
    }

    public set genresTabSelectedAlbum(v: string) {
        this.set('genresTabSelectedAlbum', v);
    }

    // genresTabSelectedGenreOrder
    public get genresTabSelectedGenreOrder(): string {
        return this.get<string>('genresTabSelectedGenreOrder');
    }

    public set genresTabSelectedGenreOrder(v: string) {
        this.set('genresTabSelectedGenreOrder', v);
    }

    // genresTabSelectedAlbumOrder
    public get genresTabSelectedAlbumOrder(): string {
        return this.get<string>('genresTabSelectedAlbumOrder');
    }

    public set genresTabSelectedAlbumOrder(v: string) {
        this.set('genresTabSelectedAlbumOrder', v);
    }

    // genresTabSelectedTrackOrder
    public get genresTabSelectedTrackOrder(): string {
        return this.get<string>('genresTabSelectedTrackOrder');
    }

    public set genresTabSelectedTrackOrder(v: string) {
        this.set('genresTabSelectedTrackOrder', v);
    }

    // playlistsTabSelectedPlaylistFolder
    public get playlistsTabSelectedPlaylistFolder(): string {
        return this.get<string>('playlistsTabSelectedPlaylistFolder');
    }

    public set playlistsTabSelectedPlaylistFolder(v: string) {
        this.set('playlistsTabSelectedPlaylistFolder', v);
    }

    // playlistsTabSelectedPlaylist
    public get playlistsTabSelectedPlaylist(): string {
        return this.get<string>('playlistsTabSelectedPlaylist');
    }

    public set playlistsTabSelectedPlaylist(v: string) {
        this.set('playlistsTabSelectedPlaylist', v);
    }

    // playlistsTabSelectedPlaylistOrder
    public get playlistsTabSelectedPlaylistOrder(): string {
        return this.get<string>('playlistsTabSelectedPlaylistOrder');
    }

    public set playlistsTabSelectedPlaylistOrder(v: string) {
        this.set('playlistsTabSelectedPlaylistOrder', v);
    }

    // playlistsTabSelectedTrackOrder
    public get playlistsTabSelectedTrackOrder(): string {
        return this.get<string>('playlistsTabSelectedTrackOrder');
    }

    public set playlistsTabSelectedTrackOrder(v: string) {
        this.set('playlistsTabSelectedTrackOrder', v);
    }

    // enableDiscordRichPresence
    public get enableDiscordRichPresence(): boolean {
        return this.get<boolean>('enableDiscordRichPresence');
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.set('enableDiscordRichPresence', v);
    }

    // enableLastFmScrobbling
    public get enableLastFmScrobbling(): boolean {
        return this.get<boolean>('enableLastFmScrobbling');
    }

    public set enableLastFmScrobbling(v: boolean) {
        this.set('enableLastFmScrobbling', v);
    }

    // showIconInNotificationArea
    public get showIconInNotificationArea(): boolean {
        return this.get<boolean>('showIconInNotificationArea');
    }

    public set showIconInNotificationArea(v: boolean) {
        this.set('showIconInNotificationArea', v);
    }

    // minimizeToNotificationArea
    public get minimizeToNotificationArea(): boolean {
        return this.get<boolean>('minimizeToNotificationArea');
    }

    public set minimizeToNotificationArea(v: boolean) {
        this.set('minimizeToNotificationArea', v);
    }

    // closeToNotificationArea
    public get closeToNotificationArea(): boolean {
        return this.get<boolean>('closeToNotificationArea');
    }

    public set closeToNotificationArea(v: boolean) {
        this.set('closeToNotificationArea', v);
    }

    // invertNotificationAreaIconColor
    public get invertNotificationAreaIconColor(): boolean {
        return this.get<boolean>('invertNotificationAreaIconColor');
    }

    public set invertNotificationAreaIconColor(v: boolean) {
        this.set('invertNotificationAreaIconColor', v);
    }

    // showArtistsPage
    public get showArtistsPage(): boolean {
        return this.get<boolean>('showArtistsPage');
    }

    public set showArtistsPage(v: boolean) {
        this.set('showArtistsPage', v);
    }

    // showGenresPage
    public get showGenresPage(): boolean {
        return this.get<boolean>('showGenresPage');
    }

    public set showGenresPage(v: boolean) {
        this.set('showGenresPage', v);
    }

    // showAlbumsPage
    public get showAlbumsPage(): boolean {
        return this.get<boolean>('showAlbumsPage');
    }

    public set showAlbumsPage(v: boolean) {
        this.set('showAlbumsPage', v);
    }

    // showTracksPage
    public get showTracksPage(): boolean {
        return this.get<boolean>('showTracksPage');
    }

    public set showTracksPage(v: boolean) {
        this.set('showTracksPage', v);
    }

    // showPlaylistsPage
    public get showPlaylistsPage(): boolean {
        return this.get<boolean>('showPlaylistsPage');
    }

    public set showPlaylistsPage(v: boolean) {
        this.set('showPlaylistsPage', v);
    }

    // showFoldersPage
    public get showFoldersPage(): boolean {
        return this.get<boolean>('showFoldersPage');
    }

    public set showFoldersPage(v: boolean) {
        this.set('showFoldersPage', v);
    }

    // saveRatingToAudioFiles
    public get saveRatingToAudioFiles(): boolean {
        return this.get<boolean>('saveRatingToAudioFiles');
    }

    public set saveRatingToAudioFiles(v: boolean) {
        this.set('saveRatingToAudioFiles', v);
    }

    // showRating
    public get showRating(): boolean {
        return this.get<boolean>('showRating');
    }

    public set showRating(v: boolean) {
        this.set('showRating', v);
    }

    // tracksPageVisibleColumns
    public get tracksPageVisibleColumns(): string {
        return this.get<string>('tracksPageVisibleColumns');
    }

    public set tracksPageVisibleColumns(v: string) {
        this.set('tracksPageVisibleColumns', v);
    }

    // tracksPageColumnsOrder
    public get tracksPageColumnsOrder(): string {
        return this.get<string>('tracksPageColumnsOrder');
    }

    public set tracksPageColumnsOrder(v: string) {
        this.set('tracksPageColumnsOrder', v);
    }

    // lastFmUsername
    public get lastFmUsername(): string {
        return this.get<string>('lastFmUsername');
    }

    public set lastFmUsername(v: string) {
        this.set('lastFmUsername', v);
    }

    // lastFmPassword
    public get lastFmPassword(): string {
        return this.get<string>('lastFmPassword');
    }

    public set lastFmPassword(v: string) {
        this.set('lastFmPassword', v);
    }

    // lastFmSessionKey
    public get lastFmSessionKey(): string {
        return this.get<string>('lastFmSessionKey');
    }

    public set lastFmSessionKey(v: string) {
        this.set('lastFmSessionKey', v);
    }

    // showLove
    public get showLove(): boolean {
        return this.get<boolean>('showLove');
    }

    public set showLove(v: boolean) {
        this.set('showLove', v);
    }

    // downloadArtistInformationFromLastFm
    public get downloadArtistInformationFromLastFm(): boolean {
        return this.get<boolean>('downloadArtistInformationFromLastFm');
    }

    public set downloadArtistInformationFromLastFm(v: boolean) {
        this.set('downloadArtistInformationFromLastFm', v);
    }

    // downloadLyricsOnline
    public get downloadLyricsOnline(): boolean {
        return this.get<boolean>('downloadLyricsOnline');
    }

    public set downloadLyricsOnline(v: boolean) {
        this.set('downloadLyricsOnline', v);
    }

    // showAudioVisualizer
    public get showAudioVisualizer(): boolean {
        return this.get<boolean>('showAudioVisualizer');
    }

    public set showAudioVisualizer(v: boolean) {
        this.set('showAudioVisualizer', v);
    }

    // audioVisualizerStyle
    public get audioVisualizerStyle(): string {
        return this.get<string>('audioVisualizerStyle');
    }

    public set audioVisualizerStyle(v: string) {
        this.set('audioVisualizerStyle', v);
    }

    // audioVisualizerFrameRate

    public get audioVisualizerFrameRate(): number {
        return this.get<number>('audioVisualizerFrameRate');
    }

    public set audioVisualizerFrameRate(v: number) {
        this.set('audioVisualizerFrameRate', v);
    }

    // keepPlaybackControlsVisibleOnNowPlayingPage
    public get keepPlaybackControlsVisibleOnNowPlayingPage(): boolean {
        return this.get<boolean>('keepPlaybackControlsVisibleOnNowPlayingPage');
    }

    public set keepPlaybackControlsVisibleOnNowPlayingPage(v: boolean) {
        this.set('keepPlaybackControlsVisibleOnNowPlayingPage', v);
    }

    // albumsDefinedByTitleAndArtist
    public get albumsDefinedByTitleAndArtist(): boolean {
        return this.get<boolean>('albumsDefinedByTitleAndArtist');
    }

    public set albumsDefinedByTitleAndArtist(v: boolean) {
        this.set('albumsDefinedByTitleAndArtist', v);
        this.setCachedAlbumKeyIndex();
    }

    // albumsDefinedByTitle
    public get albumsDefinedByTitle(): boolean {
        return this.get<boolean>('albumsDefinedByTitle');
    }

    public set albumsDefinedByTitle(v: boolean) {
        this.set('albumsDefinedByTitle', v);
        this.setCachedAlbumKeyIndex();
    }

    // albumsDefinedByFolders
    public get albumsDefinedByFolders(): boolean {
        return this.get<boolean>('albumsDefinedByFolders');
    }

    public set albumsDefinedByFolders(v: boolean) {
        this.set('albumsDefinedByFolders', v);
        this.setCachedAlbumKeyIndex();
    }

    // playbackControlsLoop
    public get playbackControlsLoop(): number {
        return this.get<number>('playbackControlsLoop');
    }

    public set playbackControlsLoop(v: number) {
        this.set('playbackControlsLoop', v);
    }

    // playbackControlsShuffle
    public get playbackControlsShuffle(): number {
        return this.get<number>('playbackControlsShuffle');
    }

    public set playbackControlsShuffle(v: number) {
        this.set('playbackControlsShuffle', v);
    }

    // rememberPlaybackStateAfterRestart
    public get rememberPlaybackStateAfterRestart(): boolean {
        return this.get<boolean>('rememberPlaybackStateAfterRestart');
    }

    public set rememberPlaybackStateAfterRestart(v: boolean) {
        this.set('rememberPlaybackStateAfterRestart', v);
    }

    // artistSplitSeparators
    public get artistSplitSeparators(): string {
        return this.get<string>('artistSplitSeparators');
    }

    public set artistSplitSeparators(v: string) {
        this.set('artistSplitSeparators', v);
    }

    // artistSplitExceptions
    public get artistSplitExceptions(): string {
        return this.get<string>('artistSplitExceptions');
    }

    public set artistSplitExceptions(v: string) {
        this.set('artistSplitExceptions', v);
    }

    // playerType
    public get playerType(): string {
        return this.get<string>('playerType');
    }

    public set playerType(v: string) {
        this.set('playerType', v);
    }

    // fullPlayerPositionSizeMaximized
    public get fullPlayerPositionSizeMaximized(): string {
        return this.get<string>('fullPlayerPositionSizeMaximized');
    }

    public set fullPlayerPositionSizeMaximized(v: string) {
        this.set('fullPlayerPositionSizeMaximized', v);
    }

    // coverPlayerPosition
    public get coverPlayerPosition(): string {
        return this.get<string>('coverPlayerPosition');
    }

    public set coverPlayerPositionAndSize(v: string) {
        this.set('coverPlayerPosition', v);
    }

    // useGaplessPlayback
    public get useGaplessPlayback(): boolean {
        return this.get<boolean>('useGaplessPlayback');
    }
    public set useGaplessPlayback(v: boolean) {
        this.set('useGaplessPlayback', v);
    }

    // jumpToPlayingSong
    public get jumpToPlayingSong(): boolean {
        return this.get<boolean>('jumpToPlayingSong');
    }

    public set jumpToPlayingSong(v: boolean) {
        this.set('jumpToPlayingSong', v);
    }

    // showSquareImages
    public get showSquareImages(): boolean {
        return this.get<boolean>('showSquareImages');
    }

    public set showSquareImages(v: boolean) {
        this.set('showSquareImages', v);
    }

    // useCompactYearView
    public get useCompactYearView(): boolean {
        return this.get<boolean>('useCompactYearView');
    }

    public set useCompactYearView(v: boolean) {
        this.set('useCompactYearView', v);
    }
}
