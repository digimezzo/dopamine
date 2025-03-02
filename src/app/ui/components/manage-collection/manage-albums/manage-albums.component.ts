import { Component, ViewEncapsulation } from '@angular/core';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { IndexingService } from '../../../../services/indexing/indexing.service';

@Component({
    selector: 'app-manage-albums',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './manage-albums.component.html',
    styleUrls: ['./manage-albums.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageAlbumsComponent {
    public constructor(
        public settings: SettingsBase,
        private indexingService: IndexingService,
    ) {}

    public get albumsDefinedByTitleAndArtist(): boolean {
        return this.settings.albumsDefinedByTitleAndArtist;
    }

    public set albumsDefinedByTitleAndArtist(value: boolean) {
        this.settings.albumsDefinedByTitleAndArtist = value;

        if (value) {
            this.albumsDefinedByFolders = false;
            this.albumsDefinedByTitle = false;
        }

        this.indexingService.onAlbumGroupingChanged();

        setTimeout(() => {
            if (this.allAlbumGroupingSettingsAreDisabled()) {
                this.albumsDefinedByTitle = true;
            }
        });
    }

    public get albumsDefinedByTitle(): boolean {
        return this.settings.albumsDefinedByTitle;
    }

    public set albumsDefinedByTitle(value: boolean) {
        this.settings.albumsDefinedByTitle = value;

        if (value) {
            this.albumsDefinedByFolders = false;
            this.albumsDefinedByTitleAndArtist = false;
        }

        this.indexingService.onAlbumGroupingChanged();

        setTimeout(() => {
            if (this.allAlbumGroupingSettingsAreDisabled()) {
                this.albumsDefinedByTitleAndArtist = true;
            }
        });
    }

    public get albumsDefinedByFolders(): boolean {
        return this.settings.albumsDefinedByFolders;
    }

    public set albumsDefinedByFolders(value: boolean) {
        this.settings.albumsDefinedByFolders = value;

        if (value) {
            this.albumsDefinedByTitleAndArtist = false;
            this.albumsDefinedByTitle = false;
        }

        this.indexingService.onAlbumGroupingChanged();

        setTimeout(() => {
            if (this.allAlbumGroupingSettingsAreDisabled()) {
                this.albumsDefinedByTitleAndArtist = true;
            }
        });
    }

    public async refreshAllCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(false);
    }

    public async refreshMissingCoversAsync(): Promise<void> {
        await this.indexingService.indexAlbumArtworkOnlyAsync(true);
    }

    private allAlbumGroupingSettingsAreDisabled(): boolean {
        return !this.settings.albumsDefinedByTitleAndArtist && !this.settings.albumsDefinedByTitle && !this.settings.albumsDefinedByFolders;
    }
}
