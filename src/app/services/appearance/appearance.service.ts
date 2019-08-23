import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
    providedIn: 'root',
})
export class AppearanceService {
    constructor(private settings: Settings, private overlayContainer: OverlayContainer) { }

    public setColorTheme(colorThemeName: string): void {
        this.settings.colorTheme = colorThemeName;
        this.applySelectedTheme();
    }

    public setBackgroundTheme(useLightBackgroundTheme: boolean): void {
        this.settings.useLightBackgroundTheme = useLightBackgroundTheme;
        this.applySelectedTheme();
    }

    public applySelectedTheme(): void {
        let theNameWithBackground: string = `${this.settings.colorTheme}-${this.settings.useLightBackgroundTheme ? "light" : "dark"}`;

        // Apply theme to components in the overlay container: https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
        let overlayContainerClasses: DOMTokenList = this.overlayContainer.getContainerElement().classList;
        let overlayContainerClassesToRemove: string[] = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme-'));

        if (overlayContainerClassesToRemove.length) {
            overlayContainerClasses.remove(...overlayContainerClassesToRemove);
        }

        overlayContainerClasses.add(theNameWithBackground);

        // Apply theme to body
        let bodyClasses: DOMTokenList = document.body.classList;
        let bodyClassesToRemove: string[] = Array.from(bodyClasses).filter((item: string) => item.includes('-theme-'));

        if (bodyClassesToRemove.length) {
            bodyClasses.remove(...bodyClassesToRemove);
        }

        document.body.classList.add(theNameWithBackground);
    }
}