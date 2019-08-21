import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import { Constants } from './constants';
import { SettingsInterface } from './settingsInterface';

@Injectable({
  providedIn: 'root'
})
export class Settings implements SettingsInterface {
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

  // Theme
  public get colorTheme(): string {
    return this.settings.get('colorTheme');
  }

  public set colorTheme(v: string) {
    this.settings.set('colorTheme', v);
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

    if (!this.settings.has('colorTheme')) {
      this.settings.set('colorTheme', "default-blue-theme");
    } else {
      let settingsColorThemeName: string = this.settings.get('colorTheme');

      // Check if the color theme which is saved in the settings still exists 
      // in the app (The color themes might change between releases).
      // If not, reset the color theme setting to the default color theme.
      if (!Constants.colorThemes.map(x => x.name).includes(settingsColorThemeName)) {
        this.settings.set('colorTheme', "default-blue-theme");
      }
    }

    if (!this.settings.has('showWelcome')) {
      this.settings.set('showWelcome', true);
    }

    if (!this.settings.has('useLightBackgroundTheme')) {
      this.settings.set('useLightBackgroundTheme', false);
    }
  }
}
