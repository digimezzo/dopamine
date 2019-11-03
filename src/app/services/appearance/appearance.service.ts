import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Logger } from '../../core/logger';
import { ColorTheme } from '../../core/colorTheme';
import { Constants } from '../../core/constants';
import { AppearanceServiceInterface } from './appearanceServiceInterface';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService implements AppearanceServiceInterface {
    private _selectedColorTheme: ColorTheme;

    constructor(private settings: Settings, private logger: Logger, private overlayContainer: OverlayContainer) {
        this.initialize();
    }

    public colorThemes: ColorTheme[] = Constants.colorThemes;

    public get useLightBackgroundTheme(): boolean {
        return this.settings.useLightBackgroundTheme;
    }

    public set useLightBackgroundTheme(v: boolean) {
        this.settings.useLightBackgroundTheme = v;
        this.applyTheme();
    }

    public get selectedColorTheme(): ColorTheme {
        return this._selectedColorTheme;
    }

    public set selectedColorTheme(v: ColorTheme) {
        this._selectedColorTheme = v;
        this.settings.colorTheme = v.name;

        this.applyTheme();
    }

    public applyTheme(): void {
        let themeNameWithBackground: string = `${this.settings.colorTheme}-${this.settings.useLightBackgroundTheme ? "light" : "dark"}`;

        // Apply theme to components in the overlay container: https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
        let overlayContainerClasses: DOMTokenList = this.overlayContainer.getContainerElement().classList;
        let overlayContainerClassesToRemove: string[] = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme-'));

        if (overlayContainerClassesToRemove.length) {
            overlayContainerClasses.remove(...overlayContainerClassesToRemove);
        }

        overlayContainerClasses.add(themeNameWithBackground);

        // Apply theme to body
        let bodyClasses: DOMTokenList = document.body.classList;
        let bodyClassesToRemove: string[] = Array.from(bodyClasses).filter((item: string) => item.includes('-theme-'));

        if (bodyClassesToRemove.length) {
            bodyClasses.remove(...bodyClassesToRemove);
        }

        document.body.classList.add(themeNameWithBackground);

        this.logger.info(`Applied theme '${themeNameWithBackground}'`, "AppearanceService", "applyTheme");
    }

    private initialize(): void {
        this._selectedColorTheme = this.colorThemes.find(x => x.name === this.settings.colorTheme);
        this.applyTheme();
    }
}