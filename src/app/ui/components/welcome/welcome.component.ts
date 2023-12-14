import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { ContactInformation } from '../../../common/application/contact-information';
import { SettingsBase } from '../../../common/settings/settings.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../common/application/constants';

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({ 'margin-left': '{{marginLeft}}', 'margin-right': '{{marginRight}}', opacity: 0 }),
                animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
            ]),
        ]),
    ],
})
export class WelcomeComponent {
    private _isLoaded: boolean;

    public constructor(
        private navigationService: NavigationServiceBase,
        public translatorService: TranslatorServiceBase,
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
    ) {}

    public marginLeft: string = '0px';
    public marginRight: string = '0px';

    public currentPage: number = 0;
    public totalPages: number = 7;
    public donateUrl: string = ContactInformation.donateUrl;

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public get canGoBack(): boolean {
        return this.currentPage > 0 && this.currentPage < this.totalPages - 1;
    }

    public get canGoForward(): boolean {
        return this.currentPage < this.totalPages - 1;
    }

    public get canFinish(): boolean {
        return this.currentPage === this.totalPages - 1;
    }

    public goBack(): void {
        if (this.canGoBack) {
            this.applyMargins(true);
            this.currentPage--;
        }
    }

    public goForward(): void {
        this._isLoaded = true;

        if (this.canGoForward) {
            this.applyMargins(false);
            this.currentPage++;
        }
    }

    public async finishAsync(): Promise<void> {
        await this.navigationService.navigateToLoadingAsync();
    }

    private applyMargins(goBack: boolean): void {
        let marginToApply: number = Constants.screenEaseMarginPixels;

        if (goBack) {
            marginToApply = -Constants.screenEaseMarginPixels;
        }

        this.marginLeft = `${marginToApply}px`;
        this.marginRight = `${-marginToApply}px`;
    }
}
