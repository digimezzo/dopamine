import { Component, ViewEncapsulation } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';

@Component({
    selector: 'app-manage-refresh',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './manage-refresh.component.html',
    styleUrls: ['./manage-refresh.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageRefreshComponent {
    public constructor(
        public settings: SettingsBase,
        private indexingService: IndexingService,
    ) {}

    public refreshNow(): void {
        this.indexingService.indexCollectionAlways();
    }
}
