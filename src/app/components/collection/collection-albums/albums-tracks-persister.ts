import { Injectable } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseTracksPersister } from '../base-tracks-persister';

@Injectable({
    providedIn: 'root',
})
export class AlbumsTracksPersister extends BaseTracksPersister {
    constructor(public settings: BaseSettings, public logger: Logger) {
        super(settings, logger);
    }

    public getSelectedTrackOrderFromSettings(): string {
        return this.settings.albumsTabSelectedTrackOrder;
    }
    public saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void {
        this.settings.albumsTabSelectedTrackOrder = selectedTrackOrderName;
    }
}
