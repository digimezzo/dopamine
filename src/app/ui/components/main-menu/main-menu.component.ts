import { Component, ViewEncapsulation } from '@angular/core';
import { ProductInformation } from '../../../common/application/product-information';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { UpdateServiceBase } from '../../../services/update/update.service.base';

@Component({
    selector: 'app-main-menu',
    host: { style: 'display: block' },
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MainMenuComponent {
    public constructor(
        private navigationService: NavigationServiceBase,
        public updateService: UpdateServiceBase,
    ) {}

    public applicationName: string = ProductInformation.applicationName;

    public async goToManageCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToManageCollectionAsync();
    }

    public async goToSettingsAsync(): Promise<void> {
        await this.navigationService.navigateToSettingsAsync();
    }

    public async goToInformationAsync(): Promise<void> {
        await this.navigationService.navigateToInformationAsync();
    }

    public async downloadLatestReleaseAsync(): Promise<void> {
        await this.updateService.downloadLatestReleaseAsync();
    }
}
