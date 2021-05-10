import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import * as os from 'os';
import { BaseSettings } from './base-settings';

@Injectable({
    providedIn: 'root',
})
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

    // Color scheme
    public get colorScheme(): string {
        return this.settings.get('colorScheme');
    }

    public set colorScheme(v: string) {
        this.settings.set('colorScheme', v);
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
    public get selectedTab(): string {
        return this.settings.get('selectedTab');
    }

    public set selectedTab(v: string) {
        this.settings.set('selectedTab', v);
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

    // Initialize
    private initialize(): void {
        if (!this.settings.has('language')) {
            this.settings.set('language', 'en');
        }

        if (!this.settings.has('checkForUpdates')) {
            this.settings.set('checkForUpdates', true);
        }

        if (!this.settings.has('useSystemTitleBar')) {
            if (os.platform() === 'win32') {
                this.settings.set('useSystemTitleBar', false);
            } else {
                this.settings.set('useSystemTitleBar', true);
            }
        }

        if (!this.settings.has('fontSize')) {
            this.settings.set('fontSize', 13);
        }

        if (!this.settings.has('colorScheme')) {
            this.settings.set('colorScheme', 'Default');
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

        if (!this.settings.has('selectedTab')) {
            this.settings.set('selectedTab', 'explore');
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
    }
}
