import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import { BaseSettings } from './base-settings';

@Injectable()
export class Settings implements BaseSettings {
    private settings: Store<any> = new Store();

    constructor() {
        this.initialize();
    }

    // Default language
    public get defaultLanguage(): string {
        return 'en';
    }

    // Language
    public get language(): string {
        return this.settings.get('language');
    }

    public set language(v: string) {
        this.settings.set('language', v);
    }

    // Check for updates
    public get checkForUpdates(): boolean {
        return this.settings.get('checkForUpdates');
    }

    public set checkForUpdates(v: boolean) {
        this.settings.set('checkForUpdates', v);
    }

    // Check for updates includes pre releases
    public get checkForUpdatesIncludesPreReleases(): boolean {
        return this.settings.get('checkForUpdatesIncludesPreReleases');
    }

    public set checkForUpdatesIncludesPreReleases(v: boolean) {
        this.settings.set('checkForUpdatesIncludesPreReleases', v);
    }

    // Use system title bar
    public get useSystemTitleBar(): boolean {
        return this.settings.get('useSystemTitleBar');
    }

    public set useSystemTitleBar(v: boolean) {
        this.settings.set('useSystemTitleBar', v);
    }

    // FontSize
    public get fontSize(): number {
        return this.settings.get('fontSize');
    }

    public set fontSize(v: number) {
        this.settings.set('fontSize', v);
    }

    // Theme
    public get theme(): string {
        return this.settings.get('theme');
    }

    public set theme(v: string) {
        this.settings.set('theme', v);
    }

    // Show welcome
    public get showWelcome(): boolean {
        return this.settings.get('showWelcome');
    }

    public set showWelcome(v: boolean) {
        this.settings.set('showWelcome', v);
    }

    // Follow system theme
    public get followSystemTheme(): boolean {
        return this.settings.get('followSystemTheme');
    }

    public set followSystemTheme(v: boolean) {
        this.settings.set('followSystemTheme', v);
    }

    // Use light background theme
    public get useLightBackgroundTheme(): boolean {
        return this.settings.get('useLightBackgroundTheme');
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.set('useLightBackgroundTheme', v);
    }

    // Follow system color
    public get followSystemColor(): boolean {
        return this.settings.get('followSystemColor');
    }

    public set followSystemColor(v: boolean) {
        this.settings.set('followSystemColor', v);
    }

    // Skip removed files during refresh
    public get skipRemovedFilesDuringRefresh(): boolean {
        return this.settings.get('skipRemovedFilesDuringRefresh');
    }

    public set skipRemovedFilesDuringRefresh(v: boolean) {
        this.settings.set('skipRemovedFilesDuringRefresh', v);
    }

    // Download missing album covers
    public get downloadMissingAlbumCovers(): boolean {
        return this.settings.get('downloadMissingAlbumCovers');
    }

    public set downloadMissingAlbumCovers(v: boolean) {
        this.settings.set('downloadMissingAlbumCovers', v);
    }

    // Download missing album covers
    public get showAllFoldersInCollection(): boolean {
        return this.settings.get('showAllFoldersInCollection');
    }

    public set showAllFoldersInCollection(v: boolean) {
        this.settings.set('showAllFoldersInCollection', v);
    }

    // Refresh collection automatically
    public get refreshCollectionAutomatically(): boolean {
        return this.settings.get('refreshCollectionAutomatically');
    }

    public set refreshCollectionAutomatically(v: boolean) {
        this.settings.set('refreshCollectionAutomatically', v);
    }

    //  Albums right pane width percent
    public get albumsRightPaneWidthPercent(): number {
        return this.settings.get('albumsRightPaneWidthPercent');
    }

    public set albumsRightPaneWidthPercent(v: number) {
        this.settings.set('albumsRightPaneWidthPercent', v);
    }

    //  Folders left pane width percent
    public get foldersLeftPaneWidthPercent(): number {
        return this.settings.get('foldersLeftPaneWidthPercent');
    }

    public set foldersLeftPaneWidthPercent(v: number) {
        this.settings.set('foldersLeftPaneWidthPercent', v);
    }

    //  Artists left pane width percent
    public get artistsLeftPaneWidthPercent(): number {
        return this.settings.get('artistsLeftPaneWidthPercent');
    }

    public set artistsLeftPaneWidthPercent(v: number) {
        this.settings.set('artistsLeftPaneWidthPercent', v);
    }

    //  Artists right pane width percent
    public get artistsRightPaneWidthPercent(): number {
        return this.settings.get('artistsRightPaneWidthPercent');
    }

    public set artistsRightPaneWidthPercent(v: number) {
        this.settings.set('artistsRightPaneWidthPercent', v);
    }

    //  Genres left pane width percent
    public get genresLeftPaneWidthPercent(): number {
        return this.settings.get('genresLeftPaneWidthPercent');
    }

    public set genresLeftPaneWidthPercent(v: number) {
        this.settings.set('genresLeftPaneWidthPercent', v);
    }

    //  Genres right pane width percent
    public get genresRightPaneWidthPercent(): number {
        return this.settings.get('genresRightPaneWidthPercent');
    }

    public set genresRightPaneWidthPercent(v: number) {
        this.settings.set('genresRightPaneWidthPercent', v);
    }

    //  Playlists left pane width percent
    public get playlistsLeftPaneWidthPercent(): number {
        return this.settings.get('playlistsLeftPaneWidthPercent');
    }

    public set playlistsLeftPaneWidthPercent(v: number) {
        this.settings.set('playlistsLeftPaneWidthPercent', v);
    }

    //  Playlists right pane width percent
    public get playlistsRightPaneWidthPercent(): number {
        return this.settings.get('playlistsRightPaneWidthPercent');
    }

    public set playlistsRightPaneWidthPercent(v: number) {
        this.settings.set('playlistsRightPaneWidthPercent', v);
    }

    //  Volume
    public get volume(): number {
        return this.settings.get('volume');
    }

    public set volume(v: number) {
        this.settings.set('volume', v);
    }

    //  Selected tab
    public get selectedCollectionTab(): string {
        return this.settings.get('selectedCollectionTab');
    }

    public set selectedCollectionTab(v: string) {
        this.settings.set('selectedCollectionTab', v);
    }

    //  Folders tab opened folder
    public get foldersTabOpenedFolder(): string {
        return this.settings.get('foldersTabOpenedFolder');
    }

    public set foldersTabOpenedFolder(v: string) {
        this.settings.set('foldersTabOpenedFolder', v);
    }

    //  Folders tab opened subfolder
    public get foldersTabOpenedSubfolder(): string {
        return this.settings.get('foldersTabOpenedSubfolder');
    }

    public set foldersTabOpenedSubfolder(v: string) {
        this.settings.set('foldersTabOpenedSubfolder', v);
    }

    //  Albums tab selected album
    public get albumsTabSelectedAlbum(): string {
        return this.settings.get('albumsTabSelectedAlbum');
    }

    public set albumsTabSelectedAlbum(v: string) {
        this.settings.set('albumsTabSelectedAlbum', v);
    }

    //  Albums tab selected album order
    public get albumsTabSelectedAlbumOrder(): string {
        return this.settings.get('albumsTabSelectedAlbumOrder');
    }

    public set albumsTabSelectedAlbumOrder(v: string) {
        this.settings.set('albumsTabSelectedAlbumOrder', v);
    }

    //  Albums tab selected track order
    public get albumsTabSelectedTrackOrder(): string {
        return this.settings.get('albumsTabSelectedTrackOrder');
    }

    public set albumsTabSelectedTrackOrder(v: string) {
        this.settings.set('albumsTabSelectedTrackOrder', v);
    }

    //  Artists tab selected artist type
    public get artistsTabSelectedArtistType(): string {
        return this.settings.get('artistsTabSelectedArtistType');
    }

    public set artistsTabSelectedArtistType(v: string) {
        this.settings.set('artistsTabSelectedArtistType', v);
    }

    //  Artists tab selected artist
    public get artistsTabSelectedArtist(): string {
        return this.settings.get('artistsTabSelectedArtist');
    }

    public set artistsTabSelectedArtist(v: string) {
        this.settings.set('artistsTabSelectedArtist', v);
    }

    //  Artists tab selected artist order
    public get artistsTabSelectedArtistOrder(): string {
        return this.settings.get('artistsTabSelectedArtistOrder');
    }

    public set artistsTabSelectedArtistOrder(v: string) {
        this.settings.set('artistsTabSelectedArtistOrder', v);
    }

    //  Artists tab selected album
    public get artistsTabSelectedAlbum(): string {
        return this.settings.get('artistsTabSelectedAlbum');
    }

    public set artistsTabSelectedAlbum(v: string) {
        this.settings.set('artistsTabSelectedAlbum', v);
    }

    //  Artists tab selected album order
    public get artistsTabSelectedAlbumOrder(): string {
        return this.settings.get('artistsTabSelectedAlbumOrder');
    }

    public set artistsTabSelectedAlbumOrder(v: string) {
        this.settings.set('artistsTabSelectedAlbumOrder', v);
    }

    //  Artists tab selected track order
    public get artistsTabSelectedTrackOrder(): string {
        return this.settings.get('artistsTabSelectedTrackOrder');
    }

    public set artistsTabSelectedTrackOrder(v: string) {
        this.settings.set('artistsTabSelectedTrackOrder', v);
    }

    //  Genres tab selected genre
    public get genresTabSelectedGenre(): string {
        return this.settings.get('genresTabSelectedGenre');
    }

    public set genresTabSelectedGenre(v: string) {
        this.settings.set('genresTabSelectedGenre', v);
    }

    //  Genres tab selected album
    public get genresTabSelectedAlbum(): string {
        return this.settings.get('genresTabSelectedAlbum');
    }

    public set genresTabSelectedAlbum(v: string) {
        this.settings.set('genresTabSelectedAlbum', v);
    }

    //  Genres tab selected genre order
    public get genresTabSelectedGenreOrder(): string {
        return this.settings.get('genresTabSelectedGenreOrder');
    }

    public set genresTabSelectedGenreOrder(v: string) {
        this.settings.set('genresTabSelectedGenreOrder', v);
    }

    //  Genres tab selected album order
    public get genresTabSelectedAlbumOrder(): string {
        return this.settings.get('genresTabSelectedAlbumOrder');
    }

    public set genresTabSelectedAlbumOrder(v: string) {
        this.settings.set('genresTabSelectedAlbumOrder', v);
    }

    //  Genres tab selected track order
    public get genresTabSelectedTrackOrder(): string {
        return this.settings.get('genresTabSelectedTrackOrder');
    }

    public set genresTabSelectedTrackOrder(v: string) {
        this.settings.set('genresTabSelectedTrackOrder', v);
    }

    //  Enable Discord Rich Presence
    public get enableDiscordRichPresence(): boolean {
        return this.settings.get('enableDiscordRichPresence');
    }

    public set enableDiscordRichPresence(v: boolean) {
        this.settings.set('enableDiscordRichPresence', v);
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
            this.settings.set('downloadMissingAlbumCovers', true);
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

        if (!this.settings.has('enableDiscordRichPresence')) {
            this.settings.set('enableDiscordRichPresence', true);
        }
    }
}
