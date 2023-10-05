import { Component, ViewEncapsulation } from '@angular/core';
import { ProductInformation } from '../../common/application/product-information';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';

@Component({
    selector: 'app-main-menu',
    host: { style: 'display: block' },
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MainMenuComponent {
    public constructor(private navigationService: BaseNavigationService, public updateService: BaseUpdateService) {}

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
