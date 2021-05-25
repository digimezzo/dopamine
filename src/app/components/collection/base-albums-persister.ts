import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { StringCompare } from '../../core/string-compare';
import { AlbumModel } from '../../services/album/album-model';
import { AlbumOrder } from './album-order';

@Injectable()
export abstract class BaseAlbumsPersister {
    private selectedAlbumKeys: string[] = [];
    private selectedAlbumOrder: AlbumOrder;

    constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public getSelectedAlbums(availableAlbums: AlbumModel[]): AlbumModel[] {
        if (availableAlbums == undefined) {
            return [];
        }

        if (availableAlbums.length === 0) {
            return [];
        }

        try {
            return availableAlbums.filter((x) => this.selectedAlbumKeys.includes(x.albumKey));
        } catch (e) {
            this.logger.error(`Could not get selected albums. Error: ${e.message}`, 'AlbumsPersister', 'getSelectedAlbums');
        }

        return [];
    }

    public setSelectedAlbums(selectedAlbums: AlbumModel[]): void {
        try {
            if (selectedAlbums != undefined && selectedAlbums.length > 0) {
                this.selectedAlbumKeys = selectedAlbums.map((x) => x.albumKey);
            } else {
                this.selectedAlbumKeys = [];
            }

            if (this.selectedAlbumKeys.length > 0) {
                this.saveSelectedAlbumToSettings(this.selectedAlbumKeys[0]);
            } else {
                this.saveSelectedAlbumToSettings('');
            }
        } catch (e) {
            this.logger.error(`Could not set selected albums. Error: ${e.message}`, 'AlbumsPersister', 'setSelectedAlbums');
        }
    }

    public getSelectedAlbumOrder(): AlbumOrder {
        if (this.selectedAlbumOrder == undefined) {
            return AlbumOrder.byAlbumTitleAscending;
        }

        return this.selectedAlbumOrder;
    }

    public setSelectedAlbumOrder(selectedAlbumOrder: AlbumOrder): void {
        try {
            this.selectedAlbumOrder = selectedAlbumOrder;
            this.saveSelectedAlbumOrderToSettings(AlbumOrder[selectedAlbumOrder]);
        } catch (e) {
            this.logger.error(`Could not set selected album order. Error: ${e.message}`, 'AlbumsPersister', 'setSelectedAlbumOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!StringCompare.isNullOrWhiteSpace(this.getSelectedAlbumFromSettings())) {
            this.selectedAlbumKeys = [this.getSelectedAlbumFromSettings()];
        }

        if (!StringCompare.isNullOrWhiteSpace(this.getSelectedAlbumOrderFromSettings())) {
            this.selectedAlbumOrder = (AlbumOrder as any)[this.getSelectedAlbumOrderFromSettings()];
        }
    }

    public abstract getSelectedAlbumFromSettings(): string;
    public abstract saveSelectedAlbumToSettings(selectedAlbumKey: string): void;
    public abstract getSelectedAlbumOrderFromSettings(): string;
    public abstract saveSelectedAlbumOrderToSettings(selectedAlbumOrderName: string): void;
}
