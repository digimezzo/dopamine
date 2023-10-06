import { Injectable } from '@angular/core';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { TrackOrder } from './track-order';

@Injectable()
export abstract class BaseTracksPersister {
    private selectedTrackOrder: TrackOrder;

    public constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public abstract getSelectedTrackOrderFromSettings(): string;
    public abstract saveSelectedTrackOrderToSettings(selectedTrackOrderName: string): void;

    public getSelectedTrackOrder(): TrackOrder {
        if (this.selectedTrackOrder == undefined) {
            return TrackOrder.byAlbum;
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
        if (!Strings.isNullOrWhiteSpace(this.getSelectedTrackOrderFromSettings())) {
            this.selectedTrackOrder = TrackOrder[this.getSelectedTrackOrderFromSettings()] as TrackOrder;
        }
    }
}
