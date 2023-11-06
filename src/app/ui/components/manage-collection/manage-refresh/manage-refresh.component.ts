import { Component, ViewEncapsulation } from '@angular/core';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-manage-refresh',
    templateUrl: './manage-refresh.component.html',
    styleUrls: ['./manage-refresh.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageRefreshComponent {
    public constructor(
        public settings: SettingsBase,
        private indexingService: IndexingServiceBase,
    ) {}

    public async refreshNowAsync(): Promise<void> {
        await this.indexingService.indexCollectionAlwaysAsync();
    }
}
