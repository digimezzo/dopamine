import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import * as os from 'os';

@Injectable({
  providedIn: 'root'
})
export class Settings {
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

  // Use custom title bar
  public get useCustomTitleBar(): boolean {
    return this.settings.get('useCustomTitleBar');
  }

  public set useCustomTitleBar(v: boolean) {
    this.settings.set('useCustomTitleBar', v);
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

  // Use light theme
  public get useLightBackgroundTheme(): boolean {
    return this.settings.get('useLightBackgroundTheme');
  }

  public set useLightBackgroundTheme(v: boolean) {
    this.settings.set('useLightBackgroundTheme', v);
  }

  // Initialize
  private initialize(): void {
    if (!this.settings.has('language')) {
      this.settings.set('language', 'en');
    }

    if (!this.settings.has('useCustomTitleBar')) {
      if (os.platform() === 'win32') {
        this.settings.set('useCustomTitleBar', true);
      } else {
        this.settings.set('useCustomTitleBar', false);
      }
    }

    if (!this.settings.has('colorScheme')) {
      this.settings.set('colorScheme', 'Default');
    }

    if (!this.settings.has('showWelcome')) {
      this.settings.set('showWelcome', true);
    }

    if (!this.settings.has('useLightBackgroundTheme')) {
      this.settings.set('useLightBackgroundTheme', false);
    }
  }
}
