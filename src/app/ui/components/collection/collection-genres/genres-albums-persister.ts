import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { BaseAlbumsPersister } from '../base-albums-persister';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Injectable()
export class GenresAlbumsPersister extends BaseAlbumsPersister {
    public constructor(
        public settings: SettingsBase,
        public logger: Logger,
    ) {
        super(settings, logger);
    }

    public getSelectedAlbumFromSettings(): string {
        return this.settings.genresTabSelectedAlbum;
    }

    public saveSelectedAlbumToSettings(selectedAlbumKey: string): void {
        this.settings.genresTabSelectedAlbum = selectedAlbumKey;
    }

    public getSelectedAlbumOrderFromSettings(): string {
        return this.settings.genresTabSelectedAlbumOrder;
    }

    public saveSelectedAlbumOrderToSettings(selectedAlbumOrderName: string): void {
        this.settings.genresTabSelectedAlbumOrder = selectedAlbumOrderName;
    }
}
