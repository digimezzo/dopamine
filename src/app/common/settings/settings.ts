import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import { BaseSettings } from './base-settings';

@Injectable()
export class Settings implements BaseSettings {
    private settings: Store<any> = new Store();

    constructor() {
        this.initialize();
    }

    // defaultLanguage
    public get defaultLanguage(): string {
        return 'en';
    }

    // language
    public get language(): string {
        return this.settings.get('language');
    }

    public set language(v: string) {
        this.settings.set('language', v);
    }

    // checkForUpdates
    public get checkForUpdates(): boolean {
        return this.settings.get('checkForUpdates');
    }

    public set checkForUpdates(v: boolean) {
        this.settings.set('checkForUpdates', v);
    }

    // checkForUpdatesIncludesPreReleases
    public get checkForUpdatesIncludesPreReleases(): boolean {
        return this.settings.get('checkForUpdatesIncludesPreReleases');
    }

    public set checkForUpdatesIncludesPreReleases(v: boolean) {
        this.settings.set('checkForUpdatesIncludesPreReleases', v);
    }

    // useSystemTitleBar
    public get useSystemTitleBar(): boolean {
        return this.settings.get('useSystemTitleBar');
    }

    public set useSystemTitleBar(v: boolean) {
        this.settings.set('useSystemTitleBar', v);
    }

    // fontSize
    public get fontSize(): number {
        return this.settings.get('fontSize');
    }

    public set fontSize(v: number) {
        this.settings.set('fontSize', v);
    }

    // theme
    public get theme(): string {
        return this.settings.get('theme');
    }

    public set theme(v: string) {
        this.settings.set('theme', v);
    }

    // showWelcome
    public get showWelcome(): boolean {
        return this.settings.get('showWelcome');
    }

    public set showWelcome(v: boolean) {
        this.settings.set('showWelcome', v);
    }

    // followSystemTheme
    public get followSystemTheme(): boolean {
        return this.settings.get('followSystemTheme');
    }

    public set followSystemTheme(v: boolean) {
        this.settings.set('followSystemTheme', v);
    }

    // useLightBackgroundTheme
    public get useLightBackgroundTheme(): boolean {
        return this.settings.get('useLightBackgroundTheme');
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.set('useLightBackgroundTheme', v);
    }

    // followSystemColor
    public get followSystemColor(): boolean {
        return this.settings.get('followSystemColor');
    }

    public set followSystemColor(v: boolean) {
        this.settings.set('followSystemColor', v);
    }

    // skipRemovedFilesDuringRefresh
    public get skipRemovedFilesDuringRefresh(): boolean {
        return this.settings.get('skipRemovedFilesDuringRefresh');
    }

    public set skipRemovedFilesDuringRefresh(v: boolean) {
        this.settings.set('skipRemovedFilesDuringRefresh', v);
    }

    // downloadMissingAlbumCovers
    public get downloadMissingAlbumCovers(): boolean {
        return this.settings.get('downloadMissingAlbumCovers');
    }

    public set downloadMissingAlbumCovers(v: boolean) {
        this.settings.set('downloadMissingAlbumCovers', v);
    }

    // showAllFoldersInCollection
    public get showAllFoldersInCollection(): boolean {
        return this.settings.get('showAllFoldersInCollection');
    }

    public set showAllFoldersInCollection(v: boolean) {
        this.settings.set('showAllFoldersInCollection', v);
    }

    // refreshCollectionAutomatically
    public get refreshCollectionAutomatically(): boolean {
        return this.settings.get('refreshCollectionAutomatically');
    }

    public set refreshCollectionAutomatically(v: boolean) {
        this.settings.set('refreshCollectionAutomatically', v);
    }

    // albumsRightPaneWidthPercent
    public get albumsRightPaneWidthPercent(): number {
        return this.settings.get('albumsRightPaneWidthPercent');
    }

    public set albumsRightPaneWidthPercent(v: number) {
        this.settings.set('albumsRightPaneWidthPercent', v);
    }

    // foldersLeftPaneWidthPercent
    public get foldersLeftPaneWidthPercent(): number {
        return this.settings.get('foldersLeftPaneWidthPercent');
    }

    public set foldersLeftPaneWidthPercent(v: number) {
        this.settings.set('foldersLeftPaneWidthPercent', v);
    }

    // artistsLeftPaneWidthPercent
    public get artistsLeftPaneWidthPercent(): number {
        return this.settings.get('artistsLeftPaneWidthPercent');
    }

    public set artistsLeftPaneWidthPercent(v: number) {
        this.settings.set('artistsLeftPaneWidthPercent', v);
    }

    // artistsRightPaneWidthPercent
    public get artistsRightPaneWidthPercent(): number {
        return this.settings.get('artistsRightPaneWidthPercent');
    }

    public set artistsRightPaneWidthPercent(v: number) {
        this.settings.set('artistsRightPaneWidthPercent', v);
    }

    // genresLeftPaneWidthPercent
    public get genresLeftPaneWidthPercent(): number {
        return this.settings.get('genresLeftPaneWidthPercent');
    }

    public set genresLeftPaneWidthPercent(v: number) {
        this.settings.set('genresLeftPaneWidthPercent', v);
    }

    // genresRightPaneWidthPercent
    public get genresRightPaneWidthPercent(): number {
        return this.settings.get('genresRightPaneWidthPercent');
    }

    public set genresRightPaneWidthPercent(v: number) {
        this.settings.set('genresRightPaneWidthPercent', v);
    }

    // playlistsLeftPaneWidthPercent
    public get playlistsLeftPaneWidthPercent(): number {
        return this.settings.get('playlistsLeftPaneWidthPercent');
    }

    public set playlistsLeftPaneWidthPercent(v: number) {
        this.settings.set('playlistsLeftPaneWidthPercent', v);
    }

    // playlistsRightPaneWidthPercent
    public get playlistsRightPaneWidthPercent(): number {
        return this.settings.get('playlistsRightPaneWidthPercent');
    }

    public set playlistsRightPaneWidthPercent(v: number) {
        this.settings.set('playlistsRightPaneWidthPercent', v);
    }

    // volume
    public get volume(): number {
        return this.settings.get('volume');
    }

    public set volume(v: number) {
        this.settings.set('volume', v);
    }

    // selectedCollectionTab
    public get selectedCollectionTab(): string {
        return this.settings.get('selectedCollectionTab');
    }

    public set selectedCollectionTab(v: string) {
        this.settings.set('selectedCollectionTab', v);
    }

    // foldersTabOpenedFolder
    public get foldersTabOpenedFolder(): string {
        return this.settings.get('foldersTabOpenedFolder');
    }

    public set foldersTabOpenedFolder(v: string) {
        this.settings.set('foldersTabOpenedFolder', v);
    }

    // foldersTabOpenedSubfolder
    public get foldersTabOpenedSubfolder(): string {
        return this.settings.get('foldersTabOpenedSubfolder');
    }

    public set foldersTabOpenedSubfolder(v: string) {
        this.settings.set('foldersTabOpenedSubfolder', v);
    }

    // albumsTabSelectedAlbum
    public get albumsTabSelectedAlbum(): string {
        return this.settings.get('albumsTabSelectedAlbum');
    }

    public set albumsTabSelectedAlbum(v: string) {
        this.settings.set('albumsTabSelectedAlbum', v);
    }

    // albumsTabSelectedAlbumOrder
    public get albumsTabSelectedAlbumOrder(): string {
        return this.settings.get('albumsTabSelectedAlbumOrder');
    }

    public set albumsTabSelectedAlbumOrder(v: string) {
        this.settings.set('albumsTabSelectedAlbumOrder', v);
    }

    // albumsTabSelectedTrackOrder
    public get albumsTabSelectedTrackOrder(): string {
        return this.settings.get('albumsTabSelectedTrackOrder');
    }

    public set albumsTabSelectedTrackOrder(v: string) {
        this.settings.set('albumsTabSelectedTrackOrder', v);
    }

    // artistsTabSelectedArtistType
    public get artistsTabSelectedArtistType(): string {
        return this.settings.get('artistsTabSelectedArtistType');
    }

    public set artistsTabSelectedArtistType(v: string) {
        this.settings.set('artistsTabSelectedArtistType', v);
    }

    // artistsTabSelectedArtist
    public get artistsTabSelectedArtist(): string {
        return this.settings.get('artistsTabSelectedArtist');
    }

    public set artistsTabSelectedArtist(v: string) {
        this.settings.set('artistsTabSelectedArtist', v);
    }

    // artistsTabSelectedArtistOrder
    public get artistsTabSelectedArtistOrder(): string {
        return this.settings.get('artistsTabSelectedArtistOrder');
    }

    public set artistsTabSelectedArtistOrder(v: string) {
        this.settings.set('artistsTabSelectedArtistOrder', v);
    }

    // artistsTabSelectedAlbum
    public get artistsTabSelectedAlbum(): string {
        return this.settings.get('artistsTabSelectedAlbum');
    }

    public set artistsTabSelectedAlbum(v: string) {
        this.settings.set('artistsTabSelectedAlbum', v);
    }

    // artistsTabSelectedAlbumOrder
    public get artistsTabSelectedAlbumOrder(): string {
        return this.settings.get('artistsTabSelectedAlbumOrder');
    }

    public set artistsTabSelectedAlbumOrder(v: string) {
        this.settings.set('artistsTabSelectedAlbumOrder', v);
    }

    // artistsTabSelectedTrackOrder
    public get artistsTabSelectedTrackOrder(): string {
        return this.settings.get('artistsTabSelectedTrackOrder');
    }

    public set artistsTabSelectedTrackOrder(v: string) {
        this.settings.set('artistsTabSelectedTrackOrder', v);
    }

    // genresTabSelectedGenre
    public get genresTabSelectedGenre(): string {
        return this.settings.get('genresTabSelectedGenre');
    }

    public set genresTabSelectedGenre(v: string) {
        this.settings.set('genresTabSelectedGenre', v);
    }

    // genresTabSelectedAlbum
    public get genresTabSelectedAlbum(): string {
        return this.settings.get('genresTabSelectedAlbum');
    }

    public set genresTabSelectedAlbum(v: string) {
        this.settings.set('genresTabSelectedAlbum', v);
    }

    // genresTabSelectedGenreOrder
    public get genresTabSelectedGenreOrder(): string {
        return this.settings.get('genresTabSelectedGenreOrder');
    }

    public set genresTabSelectedGenreOrder(v: string) {
        this.settings.set('genresTabSelectedGenreOrder', v);
    }

    // genresTabSelectedAlbumOrder
    public get genresTabSelectedAlbumOrder(): string {
        return this.settings.get('genresTabSelectedAlbumOrder');
    }

    public set genresTabSelectedAlbumOrder(v: string) {
        this.settings.set('genresTabSelectedAlbumOrder', v);
    }

    // genresTabSelectedTrackOrder
    public get genresTabSelectedTrackOrder(): string {
        return this.settings.get('genresTabSelectedTrackOrder');
    }

    public set genresTabSelectedTrackOrder(v: string) {
        this.settings.set('genresTabSelectedTrackOrder', v);
    }

    // playlistsTabSelectedPlaylistFolder
    public get playlistsTabSelectedPlaylistFolder(): string {
        return this.settings.get('playlistsTabSelectedPlaylistFolder');
    }

    public set playlistsTabSelectedPlaylistFolder(v: string) {
        this.settings.set('playlistsTabSelectedPlaylistFolder', v);
    }

    // playlistsTabSelectedPlaylist
    public get playlistsTabSelectedPlaylist(): string {
        return this.settings.get('playlistsTabSelectedPlaylist');
    }

    public set playlistsTabSelectedPlaylist(v: string) {
        this.settings.set('playlistsTabSelectedPlaylist', v);
    }

    // playlistsTabSelectedPlaylistOrder
    public get playlistsTabSelectedPlaylistOrder(): string {
        return this.settings.get('playlistsTabSelectedPlaylistOrder');
    }

    public set playlistsTabSelectedPlaylistOrder(v: string) {
        this.settings.set('playlistsTabSelectedPlaylistOrder', v);
    }

    // playlistsTabSelectedTrackOrder
    public get playlistsTabSelectedTrackOrder(): string {
        return this.settings.get('playlistsTabSelectedTrackOrder');
    }

    public set playlistsTabSelectedTrackOrder(v: string) {
        this.settings.set('playlistsTabSelectedTrackOrder', v);
    }

    // enableDiscordRichPresence
    public get enableDiscordRichPresence(): boolean {
        return this.settings.get('enableDiscordRichPresence');
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.set('enableDiscordRichPresence', v);
    }

    // enableLastFmScrobbling
    public get enableLastFmScrobbling(): boolean {
        return this.settings.get('enableLastFmScrobbling');
    }

    public set enableLastFmScrobbling(v: boolean) {
        this.settings.set('enableLastFmScrobbling', v);
    }

    // showIconInNotificationArea
    public get showIconInNotificationArea(): boolean {
        return this.settings.get('showIconInNotificationArea');
    }

    public set showIconInNotificationArea(v: boolean) {
        this.settings.set('showIconInNotificationArea', v);
    }

    // minimizeToNotificationArea
    public get minimizeToNotificationArea(): boolean {
        return this.settings.get('minimizeToNotificationArea');
    }

    public set minimizeToNotificationArea(v: boolean) {
        this.settings.set('minimizeToNotificationArea', v);
    }

    // closeToNotificationArea
    public get closeToNotificationArea(): boolean {
        return this.settings.get('closeToNotificationArea');
    }

    public set closeToNotificationArea(v: boolean) {
        this.settings.set('closeToNotificationArea', v);
    }

    // invertNotificationAreaIconColor
    public get invertNotificationAreaIconColor(): boolean {
        return this.settings.get('invertNotificationAreaIconColor');
    }

    public set invertNotificationAreaIconColor(v: boolean) {
        this.settings.set('invertNotificationAreaIconColor', v);
    }

    // showArtistsPage
    public get showArtistsPage(): boolean {
        return this.settings.get('showArtistsPage');
    }

    public set showArtistsPage(v: boolean) {
        this.settings.set('showArtistsPage', v);
    }

    // showGenresPage
    public get showGenresPage(): boolean {
        return this.settings.get('showGenresPage');
    }

    public set showGenresPage(v: boolean) {
        this.settings.set('showGenresPage', v);
    }

    // showAlbumsPage
    public get showAlbumsPage(): boolean {
        return this.settings.get('showAlbumsPage');
    }

    public set showAlbumsPage(v: boolean) {
        this.settings.set('showAlbumsPage', v);
    }

    // showTracksPage
    public get showTracksPage(): boolean {
        return this.settings.get('showTracksPage');
    }

    public set showTracksPage(v: boolean) {
        this.settings.set('showTracksPage', v);
    }

    // showPlaylistsPage
    public get showPlaylistsPage(): boolean {
        return this.settings.get('showPlaylistsPage');
    }

    public set showPlaylistsPage(v: boolean) {
        this.settings.set('showPlaylistsPage', v);
    }

    // showFoldersPage
    public get showFoldersPage(): boolean {
        return this.settings.get('showFoldersPage');
    }

    public set showFoldersPage(v: boolean) {
        this.settings.set('showFoldersPage', v);
    }

    // saveRatingToAudioFiles
    public get saveRatingToAudioFiles(): boolean {
        return this.settings.get('saveRatingToAudioFiles');
    }

    public set saveRatingToAudioFiles(v: boolean) {
        this.settings.set('saveRatingToAudioFiles', v);
    }

    // showRating
    public get showRating(): boolean {
        return this.settings.get('showRating');
    }

    public set showRating(v: boolean) {
        this.settings.set('showRating', v);
    }

    // tracksPageVisibleColumns
    public get tracksPageVisibleColumns(): string {
        return this.settings.get('tracksPageVisibleColumns');
    }

    public set tracksPageVisibleColumns(v: string) {
        this.settings.set('tracksPageVisibleColumns', v);
    }

    // tracksPageColumnsOrder
    public get tracksPageColumnsOrder(): string {
        return this.settings.get('tracksPageColumnsOrder');
    }

    public set tracksPageColumnsOrder(v: string) {
        this.settings.set('tracksPageColumnsOrder', v);
    }

    // lastFmUsername
    public get lastFmUsername(): string {
        return this.settings.get('lastFmUsername');
    }

    public set lastFmUsername(v: string) {
        this.settings.set('lastFmUsername', v);
    }

    // lastFmPassword
    public get lastFmPassword(): string {
        return this.settings.get('lastFmPassword');
    }

    public set lastFmPassword(v: string) {
        this.settings.set('lastFmPassword', v);
    }

    // lastFmSessionKey
    public get lastFmSessionKey(): string {
        return this.settings.get('lastFmSessionKey');
    }

    public set lastFmSessionKey(v: string) {
        this.settings.set('lastFmSessionKey', v);
    }

    // showLove
    public get showLove(): boolean {
        return this.settings.get('showLove');
    }

    public set showLove(v: boolean) {
        this.settings.set('showLove', v);
    }

    // enableMultimediaKeys
    public get enableMultimediaKeys(): boolean {
        return this.settings.get('enableMultimediaKeys');
    }

    public set enableMultimediaKeys(v: boolean) {
        this.settings.set('enableMultimediaKeys', v);
    }

    // downloadArtistInformationFromLastFm
    public get downloadArtistInformationFromLastFm(): boolean {
        return this.settings.get('downloadArtistInformationFromLastFm');
    }

    public set downloadArtistInformationFromLastFm(v: boolean) {
        this.settings.set('downloadArtistInformationFromLastFm', v);
    }

    // Initialize
    private initialize(): void {
        if (!this.settings.has('language')) {
            this.settings.set('language', 'en');
        }

        if (!this.settings.has('checkForUpdates')) {
            this.settings.set('checkForUpdates', true);
        }

        if (!this.settings.has('checkForUpdatesIncludesPreReleases')) {
            this.settings.set('checkForUpdatesIncludesPreReleases', true);
        }

        if (!this.settings.has('useSystemTitleBar')) {
            this.settings.set('useSystemTitleBar', false);
        }

        if (!this.settings.has('fontSize')) {
            this.settings.set('fontSize', 13);
        }

        if (!this.settings.has('theme')) {
            this.settings.set('theme', 'Dopamine');
        }

        if (!this.settings.has('showWelcome')) {
            this.settings.set('showWelcome', true);
        }

        if (!this.settings.has('followSystemTheme')) {
            this.settings.set('followSystemTheme', false);
        }

        if (!this.settings.has('useLightBackgroundTheme')) {
            this.settings.set('useLightBackgroundTheme', false);
        }

        if (!this.settings.has('followSystemColor')) {
            this.settings.set('followSystemColor', false);
        }

        if (!this.settings.has('skipRemovedFilesDuringRefresh')) {
            this.settings.set('skipRemovedFilesDuringRefresh', true);
        }

        if (!this.settings.has('downloadMissingAlbumCovers')) {
            this.settings.set('downloadMissingAlbumCovers', false);
        }

        if (!this.settings.has('showAllFoldersInCollection')) {
            this.settings.set('showAllFoldersInCollection', true);
        }

        if (!this.settings.has('refreshCollectionAutomatically')) {
            this.settings.set('refreshCollectionAutomatically', true);
        }

        if (!this.settings.has('albumsRightPaneWidthPercent')) {
            this.settings.set('albumsRightPaneWidthPercent', 30);
        }

        if (!this.settings.has('foldersLeftPaneWidthPercent')) {
            this.settings.set('foldersLeftPaneWidthPercent', 30);
        }

        if (!this.settings.has('artistsLeftPaneWidthPercent')) {
            this.settings.set('artistsLeftPaneWidthPercent', 25);
        }

        if (!this.settings.has('artistsRightPaneWidthPercent')) {
            this.settings.set('artistsRightPaneWidthPercent', 25);
        }

        if (!this.settings.has('genresLeftPaneWidthPercent')) {
            this.settings.set('genresLeftPaneWidthPercent', 25);
        }

        if (!this.settings.has('genresRightPaneWidthPercent')) {
            this.settings.set('genresRightPaneWidthPercent', 25);
        }

        if (!this.settings.has('playlistsLeftPaneWidthPercent')) {
            this.settings.set('playlistsLeftPaneWidthPercent', 25);
        }

        if (!this.settings.has('playlistsRightPaneWidthPercent')) {
            this.settings.set('playlistsRightPaneWidthPercent', 25);
        }

        if (!this.settings.has('volume')) {
            this.settings.set('volume', 0.5);
        }

        if (!this.settings.has('selectedCollectionTab')) {
            this.settings.set('selectedCollectionTab', 'artists');
        }

        if (!this.settings.has('foldersTabOpenedFolder')) {
            this.settings.set('foldersTabOpenedFolder', '');
        }

        if (!this.settings.has('foldersTabOpenedSubfolder')) {
            this.settings.set('foldersTabOpenedSubfolder', '');
        }

        if (!this.settings.has('albumsTabSelectedAlbum')) {
            this.settings.set('albumsTabSelectedAlbum', '');
        }

        if (!this.settings.has('albumsTabSelectedAlbumOrder')) {
            this.settings.set('albumsTabSelectedAlbumOrder', '');
        }

        if (!this.settings.has('albumsTabSelectedTrackOrder')) {
            this.settings.set('albumsTabSelectedTrackOrder', '');
        }

        if (!this.settings.has('artistsTabSelectedArtistType')) {
            this.settings.set('artistsTabSelectedArtistType', '');
        }

        if (!this.settings.has('artistsTabSelectedArtist')) {
            this.settings.set('artistsTabSelectedArtist', '');
        }

        if (!this.settings.has('artistsTabSelectedArtistOrder')) {
            this.settings.set('artistsTabSelectedArtistOrder', '');
        }

        if (!this.settings.has('artistsTabSelectedAlbum')) {
            this.settings.set('artistsTabSelectedAlbum', '');
        }

        if (!this.settings.has('artistsTabSelectedAlbumOrder')) {
            this.settings.set('artistsTabSelectedAlbumOrder', '');
        }

        if (!this.settings.has('artistsTabSelectedTrackOrder')) {
            this.settings.set('artistsTabSelectedTrackOrder', '');
        }

        if (!this.settings.has('genresTabSelectedGenre')) {
            this.settings.set('genresTabSelectedGenre', '');
        }

        if (!this.settings.has('genresTabSelectedAlbum')) {
            this.settings.set('genresTabSelectedAlbum', '');
        }

        if (!this.settings.has('genresTabSelectedGenreOrder')) {
            this.settings.set('genresTabSelectedGenreOrder', '');
        }

        if (!this.settings.has('genresTabSelectedAlbumOrder')) {
            this.settings.set('genresTabSelectedAlbumOrder', '');
        }

        if (!this.settings.has('genresTabSelectedTrackOrder')) {
            this.settings.set('genresTabSelectedTrackOrder', '');
        }

        if (!this.settings.has('playlistsTabSelectedPlaylistFolder')) {
            this.settings.set('playlistsTabSelectedPlaylistFolder', '');
        }

        if (!this.settings.has('playlistsTabSelectedPlaylist')) {
            this.settings.set('playlistsTabSelectedPlaylist', '');
        }

        if (!this.settings.has('playlistsTabSelectedPlaylistOrder')) {
            this.settings.set('playlistsTabSelectedPlaylistOrder', '');
        }

        if (!this.settings.has('enableDiscordRichPresence')) {
            this.settings.set('enableDiscordRichPresence', false);
        }

        if (!this.settings.has('enableLastFmScrobbling')) {
            this.settings.set('enableLastFmScrobbling', false);
        }

        if (!this.settings.has('showIconInNotificationArea')) {
            this.settings.set('showIconInNotificationArea', true);
        }

        if (!this.settings.has('minimizeToNotificationArea')) {
            this.settings.set('minimizeToNotificationArea', false);
        }

        if (!this.settings.has('closeToNotificationArea')) {
            this.settings.set('closeToNotificationArea', false);
        }

        if (!this.settings.has('invertNotificationAreaIconColor')) {
            this.settings.set('invertNotificationAreaIconColor', false);
        }

        if (!this.settings.has('showArtistsPage')) {
            this.settings.set('showArtistsPage', true);
        }

        if (!this.settings.has('showGenresPage')) {
            this.settings.set('showGenresPage', true);
        }

        if (!this.settings.has('showAlbumsPage')) {
            this.settings.set('showAlbumsPage', true);
        }

        if (!this.settings.has('showTracksPage')) {
            this.settings.set('showTracksPage', true);
        }

        if (!this.settings.has('showPlaylistsPage')) {
            this.settings.set('showPlaylistsPage', true);
        }

        if (!this.settings.has('showFoldersPage')) {
            this.settings.set('showFoldersPage', true);
        }

        if (!this.settings.has('showRating')) {
            this.settings.set('showRating', true);
        }

        if (!this.settings.has('saveRatingToAudioFiles')) {
            this.settings.set('saveRatingToAudioFiles', false);
        }

        if (!this.settings.has('tracksPageVisibleColumns')) {
            this.settings.set('tracksPageVisibleColumns', 'rating;artists;duration;number');
        }

        if (!this.settings.has('tracksPageColumnsOrder')) {
            this.settings.set('tracksPageColumnsOrder', '');
        }

        if (!this.settings.has('lastFmUsername')) {
            this.settings.set('lastFmUsername', '');
        }

        if (!this.settings.has('lastFmPassword')) {
            this.settings.set('lastFmPassword', '');
        }

        if (!this.settings.has('lastFmSessionKey')) {
            this.settings.set('lastFmSessionKey', '');
        }

        if (!this.settings.has('showLove')) {
            this.settings.set('showLove', false);
        }

        if (!this.settings.has('enableMultimediaKeys')) {
            this.settings.set('enableMultimediaKeys', false);
        }

        if (!this.settings.has('downloadArtistInformationFromLastFm')) {
            this.settings.set('downloadArtistInformationFromLastFm', false);
        }
    }
}
