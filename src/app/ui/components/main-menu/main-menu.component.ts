import { Component, ViewEncapsulation } from '@angular/core';
import { ProductInformation } from '../../../common/application/product-information';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { UpdateServiceBase } from '../../../services/update/update.service.base';
import { DesktopBase } from '../../../common/io/desktop.base';
import { ContactInformation } from '../../../common/application/contact-information';
import { IndexingService } from '../../../services/indexing/indexing.service';

@Component({
    selector: 'app-main-menu',
    host: { style: 'display: block' },
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class MainMenuComponent {
    public constructor(
        private navigationService: NavigationServiceBase,
        public updateService: UpdateServiceBase,
        private desktop: DesktopBase,
        private indexingService: IndexingService,
    ) {}

    public applicationName: string = ProductInformation.applicationName;

    public async goToManageCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToManageCollectionAsync();
    }

    public async refreshCollectionNowAsync(): Promise<void> {
        await this.indexingService.indexCollectionAlwaysAsync();
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

    public async browseToDonateLinkAsync(): Promise<void> {
        await this.desktop.openLinkAsync(ContactInformation.donateUrl);
    }
}
