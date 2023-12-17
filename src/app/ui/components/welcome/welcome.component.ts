import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { WelcomeServiceBase } from '../../../services/welcome/welcome.service.base';

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        private welcomeService: WelcomeServiceBase,
        private navigationService: NavigationServiceBase,
    ) {}

    public currentPage: number = 0;
    public totalPages: number = 7;

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
        this.welcomeService.isLoaded = true;

        if (this.canGoForward) {
            this.currentPage++;
        }
    }

    public async finishAsync(): Promise<void> {
        await this.navigationService.navigateToLoadingAsync();
    }
}
