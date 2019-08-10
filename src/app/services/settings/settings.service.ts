import { Injectable } from '@angular/core';
import * as Store from 'electron-store';
import { Constants } from '../../core/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Store<any> = new Store();

  constructor() { }

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

  // Initialize
  public initialize(): void {
    if (!this.settings.has('language')) {
      this.settings.set('language', 'en');
    }

    if (!this.settings.has('theme')) {
      this.settings.set('theme', "default-blue-theme");
    } else {
      let settingsThemeName: string = this.settings.get('theme');

      // Check if the theme which is saved in the settings still exists 
      // in the app (The themes might change between releases).
      // If not, reset the theme setting to the default theme.
      if (!Constants.themes.map(x => x.name).includes(settingsThemeName)) {
        this.settings.set('theme', "default-blue-theme");
      }
    }

    if (!this.settings.has('showWelcome')) {
      this.settings.set('showWelcome', true);
    }
  }
}
