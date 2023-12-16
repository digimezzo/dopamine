import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { ContactInformation } from '../../../common/application/contact-information';
import { SettingsBase } from '../../../common/settings/settings.base';
import { enterAnimation } from '../../animations/animations';

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterAnimation],
})
export class WelcomeComponent {
    private _isLoaded: boolean;

    public constructor(
        private navigationService: NavigationServiceBase,
        public translatorService: TranslatorServiceBase,
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
    ) {}

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
            this.currentPage--;
        }
    }

    public goForward(): void {
        this._isLoaded = true;

        if (this.canGoForward) {
            this.currentPage++;
        }
    }

    public async finishAsync(): Promise<void> {
        await this.navigationService.navigateToLoadingAsync();
    }
}
