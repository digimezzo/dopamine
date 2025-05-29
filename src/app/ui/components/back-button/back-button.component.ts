import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { IndexingService } from '../../../services/indexing/indexing.service';

@Component({
    selector: 'app-back-button',
    host: { style: 'display: block' },
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BackButtonComponent {
    public constructor(
        public navigationService: NavigationServiceBase,
        private indexingService: IndexingService,
    ) {}

    public async goBackToCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToCollectionAsync();
        await this.indexingService.indexCollectionIfOptionsHaveChangedAsync();
    }
}
