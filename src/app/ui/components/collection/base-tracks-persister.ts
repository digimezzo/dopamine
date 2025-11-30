import { Injectable } from '@angular/core';
import { Logger } from '../../../common/logger';
import { StringUtils } from '../../../common/utils/string-utils';
import { TrackOrder } from './track-order';
import { SettingsBase } from '../../../common/settings/settings.base';

@Injectable()
export abstract class BaseTracksPersister {
    private selectedTrackOrder: TrackOrder;

    public constructor(
        public settings: SettingsBase,
        public logger: Logger,
    ) {
        this.initializeFromSettings();
    }

    public defaultTrackOrder: TrackOrder = TrackOrder.byAlbum;

    public abstract getSelectedTrackOrderFromSettings(): string;
    public abstract saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void;

    public getSelectedTrackOrder(): TrackOrder {
        if (this.selectedTrackOrder == undefined) {
            return this.defaultTrackOrder;
        }

        return this.selectedTrackOrder;
    }

    public setSelectedTrackOrder(selectedTrackOrder: TrackOrder): void {
        try {
            this.selectedTrackOrder = selectedTrackOrder;
            this.saveSelectedTrackOrderToSettings(TrackOrder[selectedTrackOrder]);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set selected track order', 'BaseTracksPersister', 'setSelectedTrackOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!StringUtils.isNullOrWhiteSpace(this.getSelectedTrackOrderFromSettings())) {
            this.selectedTrackOrder = TrackOrder[this.getSelectedTrackOrderFromSettings()] as TrackOrder;
        }
    }
}
