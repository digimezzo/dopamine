import { Injectable } from '@angular/core';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAlbumsPersister } from '../base-albums-persister';

@Injectable()
export class ArtistsAlbumsPersister extends BaseAlbumsPersister {
    constructor(public settings: BaseSettings, public logger: Logger) {
        super(settings, logger);
    }

    public getSelectedAlbumFromSettings(): string {
        return this.settings.artistsTabSelectedAlbum;
    }

    public saveSelectedAlbumToSettings(selectedAlbumKey: string): void {
        this.settings.artistsTabSelectedAlbum = selectedAlbumKey;
    }

    public getSelectedAlbumOrderFromSettings(): string {
        return this.settings.artistsTabSelectedAlbumOrder;
    }

    public saveSelectedAlbumOrderToSettings(selectedAlbumOrderName: string): void {
        this.settings.artistsTabSelectedAlbumOrder = selectedAlbumOrderName;
    }
}
