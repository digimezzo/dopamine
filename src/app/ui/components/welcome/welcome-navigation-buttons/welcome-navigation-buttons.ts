import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WelcomeServiceBase } from '../../../../services/welcome/welcome.service.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';

@Component({
    selector: 'app-welcome-navigation-buttons',
    host: { style: 'display: block;' },
    templateUrl: './welcome-navigation-buttons.html',
    styleUrls: ['./welcome-navigation-buttons.scss'],
})
export class WelcomeNavigationButtonsComponent {
    public constructor(
        private welcomeService: WelcomeServiceBase,
        private navigationService: NavigationServiceBase,
    ) {}

    @Input()
    public page: number = 0;
    @Input()
    public totalPages: number = 0;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter<number>();

    public get canGoBack(): boolean {
        return this.page > 0 && this.page < this.totalPages - 1;
    }

    public get canGoForward(): boolean {
        return this.page < this.totalPages - 1;
    }

    public get canFinish(): boolean {
        return this.page === this.totalPages - 1;
    }

    public goBack(): void {
        if (this.canGoBack) {
            this.page--;
            this.pageChange.emit(this.page);
        }
    }

    public goForward(): void {
        this.welcomeService.isLoaded = true;

        if (this.canGoForward) {
            this.page++;
            this.pageChange.emit(this.page);
        }
    }

    public async finishAsync(): Promise<void> {
        await this.navigationService.navigateToLoadingAsync();
    }
}
