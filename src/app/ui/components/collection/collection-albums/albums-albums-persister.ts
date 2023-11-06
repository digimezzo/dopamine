import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Injectable()
export class AlbumsAlbumsPersister extends BaseAlbumsPersister {
    public constructor(
        public settings: SettingsBase,
        public logger: Logger,
    ) {
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
