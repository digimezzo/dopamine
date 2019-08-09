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

  // language
  public get language(): string {
    return this.settings.get('language');
  }

  public set language(v: string) {
    this.settings.set('language', v);
  }

  // theme
  public get theme(): string {
    return this.settings.get('theme');
  }

  public set theme(v: string) {
    this.settings.set('theme', v);
  }

  public initialize(): void {
    // storageDirectory and activeCollection cannot be initialized here.
    // Their value is set later, depending on user action.

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

    if (!this.settings.has('closeNotesWithEscape')) {
      this.settings.set('closeNotesWithEscape', true);
    }

    if (!this.settings.has('fontSizeInNotes')) {
      this.settings.set('fontSizeInNotes', 14);
    }

    if (!this.settings.has('showExactDatesInTheNotesList')) {
      this.settings.set('showExactDatesInTheNotesList', false);
    }
  }
}
