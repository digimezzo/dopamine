import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Logger } from '../../core/logger';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService {
    constructor(private settings: Settings, private logger: Logger, private overlayContainer: OverlayContainer) { }

    public setColorTheme(colorThemeName: string): void {
        this.settings.colorTheme = colorThemeName;
        this.applyTheme();
    }

    public setBackgroundTheme(useLightBackgroundTheme: boolean): void {
        this.settings.useLightBackgroundTheme = useLightBackgroundTheme;
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
}