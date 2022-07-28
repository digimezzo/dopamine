import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';

@Component({
    selector: 'app-manage-refresh',
    templateUrl: './manage-refresh.component.html',
    styleUrls: ['./manage-refresh.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageRefreshComponent implements OnInit {
    constructor(public settings: BaseSettings, private indexingService: BaseIndexingService) {}

    public ngOnInit(): void {}

    public async refreshNowAsync(): Promise<void> {
        await this.indexingService.indexCollectionAlwaysAsync();
    }
}
