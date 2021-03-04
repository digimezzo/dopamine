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

    //  Folders left pane with percent
    public get foldersLeftPaneWithPercent(): number {
        return this.settings.get('foldersLeftPaneWithPercent');
    }

    public set foldersLeftPaneWithPercent(v: number) {
        this.settings.set('foldersLeftPaneWithPercent', v);
    }

    //  Volume
    public get volume(): number {
        return this.settings.get('volume');
    }

    public set volume(v: number) {
        this.settings.set('volume', v);
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

        if (!this.settings.has('foldersLeftPaneWithPercent')) {
            this.settings.set('foldersLeftPaneWithPercent', 30);
        }

        if (!this.settings.has('volume')) {
            this.settings.set('volume', 0.5);
        }
    }
}
