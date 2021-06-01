import { Injectable } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseAlbumsPersister } from '../base-albums-persister';

@Injectable({
    providedIn: 'root',
})
export class AlbumsAlbumsPersister extends BaseAlbumsPersister {
    constructor(public settings: BaseSettings, public logger: Logger) {
        super(settings, logger);
    }

    public getSelectedAlbumFromSettings(): string {
        return this.settings.albumsTabSelectedAlbum;
    }

    public saveSelectedAlbumToSettings(selectedAlbumKey: string): void {
        this.settings.albumsTabSelectedAlbum = selectedAlbumKey;
    }

    public getSelectedAlbumOrderFromSettings(): string {
        return this.settings.albumsTabSelectedAlbumOrder;
    }

    public saveSelectedAlbumOrderToSettings(selectedAlbumOrderName: string): void {
        this.settings.albumsTabSelectedAlbumOrder = selectedAlbumOrderName;
    }
}
