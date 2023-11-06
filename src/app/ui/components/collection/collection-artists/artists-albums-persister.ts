import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Injectable()
export class ArtistsAlbumsPersister extends BaseAlbumsPersister {
    public constructor(
        public settings: SettingsBase,
        public logger: Logger,
    ) {
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
