import { Component, ViewEncapsulation } from '@angular/core';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-manage-album-covers',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './manage-album-covers.component.html',
    styleUrls: ['./manage-album-covers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageAlbumCoversComponent {
    public constructor(
        public settings: SettingsBase,
        private indexingService: IndexingServiceBase,
    ) {}

    public refreshAllCovers(): void {
        this.indexingService.indexAlbumArtworkOnly(false);
    }

    public refreshMissingCovers(): void {
        this.indexingService.indexAlbumArtworkOnly(true);
    }
}
