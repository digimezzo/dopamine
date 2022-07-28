import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';

@Component({
    selector: 'app-manage-album-covers',
    templateUrl: './manage-album-covers.component.html',
    styleUrls: ['./manage-album-covers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageAlbumCoversComponent implements OnInit {
    constructor(public settings: BaseSettings, private indexingService: BaseIndexingService) {}

    public ngOnInit(): void {}

    public async refreshAllCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(false);
    }

    public async refreshMissingCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(true);
    }
}
