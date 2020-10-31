import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import * as os from 'os';
import { BaseSettings } from './base-settings';

@Injectable({
  providedIn: 'root'
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

  // Use light theme
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

  // Ignore removed files
  public get ignoreRemovedFiles(): boolean {
    return this.settings.get('ignoreRemovedFiles');
  }

  public set ignoreRemovedFiles(v: boolean) {
    this.settings.set('ignoreRemovedFiles', v);
  }

  // Download missing album covers
  public get downloadMissingAlbumCovers(): boolean {
    return this.settings.get('downloadMissingAlbumCovers');
  }

  public set downloadMissingAlbumCovers(v: boolean) {
    this.settings.set('downloadMissingAlbumCovers', v);
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

    if (!this.settings.has('ignoreRemovedFiles')) {
      this.settings.set('ignoreRemovedFiles', false);
    }

    if (!this.settings.has('downloadMissingAlbumCovers')) {
      this.settings.set('downloadMissingAlbumCovers', true);
    }
  }
}
