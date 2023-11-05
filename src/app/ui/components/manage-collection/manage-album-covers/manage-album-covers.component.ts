import { Component, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../../common/settings/base-settings';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';

@Component({
    selector: 'app-manage-album-covers',
    templateUrl: './manage-album-covers.component.html',
    styleUrls: ['./manage-album-covers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageAlbumCoversComponent {
    public constructor(
        public settings: BaseSettings,
        private indexingService: IndexingServiceBase,
    ) {}

    public async refreshAllCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(false);
    }

    public async refreshMissingCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(true);
    }
}
