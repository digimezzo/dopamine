import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { AlbumModel } from '../../services/album/album-model';
import { AlbumOrder } from './album-order';

@Injectable()
export abstract class BaseAlbumsPersister {
    private selectedAlbumKeys: string[] = [];
    private selectedAlbumOrder: AlbumOrder;
    private selectedAlbumsChanged: Subject<string[]> = new Subject();

    constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public selectedAlbumsChanged$: Observable<string[]> = this.selectedAlbumsChanged.asObservable();

    public abstract getSelectedAlbumFromSettings(): string;
    public abstract saveSelectedAlbumToSettings(selectedAlbumKey: string): void;
    public abstract getSelectedAlbumOrderFromSettings(): string;
    public abstract saveSelectedAlbumOrderToSettings(selectedAlbumOrderName: string): void;

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
            this.logger.error(`Could not get selected albums. Error: ${e.message}`, 'BaseAlbumsPersister', 'getSelectedAlbums');
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

            this.selectedAlbumsChanged.next(this.selectedAlbumKeys);
        } catch (e) {
            this.logger.error(`Could not set selected albums. Error: ${e.message}`, 'BaseAlbumsPersister', 'setSelectedAlbums');
        }
    }

    public resetSelectedAlbums(): void {
        this.selectedAlbumKeys = [];
        this.saveSelectedAlbumToSettings('');
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
            this.logger.error(`Could not set selected album order. Error: ${e.message}`, 'BaseAlbumsPersister', 'setSelectedAlbumOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!Strings.isNullOrWhiteSpace(this.getSelectedAlbumFromSettings())) {
            this.selectedAlbumKeys = [this.getSelectedAlbumFromSettings()];
        }

        if (!Strings.isNullOrWhiteSpace(this.getSelectedAlbumOrderFromSettings())) {
            this.selectedAlbumOrder = (AlbumOrder as any)[this.getSelectedAlbumOrderFromSettings()];
        }
    }
}
