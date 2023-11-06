import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { BaseTracksPersister } from '../base-tracks-persister';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Injectable()
export class ArtistsTracksPersister extends BaseTracksPersister {
    public constructor(
        public settings: SettingsBase,
        public logger: Logger,
    ) {
        super(settings, logger);
    }

    public getSelectedTrackOrderFromSettings(): string {
        return this.settings.artistsTabSelectedTrackOrder;
    }
    public saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void {
        this.settings.artistsTabSelectedTrackOrder = selectedTrackOrderName;
    }
}
