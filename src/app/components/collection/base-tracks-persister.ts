import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { TrackOrder } from './track-order';

@Injectable()
export abstract class BaseTracksPersister {
    private selectedTrackOrder: TrackOrder;

    constructor(public settings: BaseSettings, public logger: Logger) {}

    public getSelectedTrackOrder(): TrackOrder {
        if (this.selectedTrackOrder == undefined) {
            return TrackOrder.byTrackTitleAscending;
        }

        return this.selectedTrackOrder;
    }

    public setSelectedTrackOrder(selectedTrackOrder: TrackOrder): void {
        try {
            this.selectedTrackOrder = selectedTrackOrder;
            this.saveSelectedTrackOrderToSettings(TrackOrder[selectedTrackOrder]);
        } catch (e) {
            this.logger.error(`Could not set selected track order. Error: ${e.message}`, 'BaseTracksPersister', 'setSelectedTrackOrder');
        }
    }

    public abstract getSelectedTrackOrderFromSettings(): string;
    public abstract saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void;
}
