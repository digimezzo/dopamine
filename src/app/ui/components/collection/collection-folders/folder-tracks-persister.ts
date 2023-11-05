import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { BaseSettings } from '../../../../common/settings/base-settings';
import { BaseTracksPersister } from '../base-tracks-persister';

@Injectable()
export class FolderTracksPersister extends BaseTracksPersister {
    public constructor(
        public settings: BaseSettings,
        public logger: Logger,
    ) {
        super(settings, logger);
    }

    public getSelectedTrackOrderFromSettings(): string {
        return 'none';
    }
    public saveSelectedTrackOrderToSettings(): void {
        // Do nothing
    }
}
