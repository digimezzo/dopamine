import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Settings } from '../../core/settings';
import { Constants } from '../../core/constants';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService {
    private globalEmitter = remote.getGlobal('globalEmitter');

    constructor(private settings: Settings) { }

    public setColorTheme(colorThemeName: string): void {
        this.settings.colorTheme = colorThemeName;

        // Global event because all windows need to be notified
        this.globalEmitter.emit(Constants.themeChangedEvent, colorThemeName, this.settings.useLightBackgroundTheme);
    }

    public setBackgroundTheme(useLightBackgroundTheme: boolean): void {
      this.settings.useLightBackgroundTheme = useLightBackgroundTheme;

      // Global event because all windows need to be notified
      this.globalEmitter.emit(Constants.themeChangedEvent, this.settings.colorTheme, useLightBackgroundTheme);
  }
}