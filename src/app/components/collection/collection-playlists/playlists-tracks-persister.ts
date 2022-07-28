import { Injectable } from '@angular/core';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseTracksPersister } from '../base-tracks-persister';

@Injectable()
export class PlaylistsTracksPersister extends BaseTracksPersister {
    constructor(public settings: BaseSettings, public logger: Logger) {
        super(settings, logger);
    }

    public getSelectedTrackOrderFromSettings(): string {
        return this.settings.playlistsTabSelectedTrackOrder;
    }
    public saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void {
        this.settings.playlistsTabSelectedTrackOrder = selectedTrackOrderName;
    }
}
