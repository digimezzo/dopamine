import { Component, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import {IndexingServiceBase} from "../../../services/indexing/indexing.service.base";

@Component({
    selector: 'app-manage-refresh',
    templateUrl: './manage-refresh.component.html',
    styleUrls: ['./manage-refresh.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageRefreshComponent {
    public constructor(public settings: BaseSettings, private indexingService: IndexingServiceBase) {}

    public async refreshNowAsync(): Promise<void> {
        await this.indexingService.indexCollectionAlwaysAsync();
    }
}
