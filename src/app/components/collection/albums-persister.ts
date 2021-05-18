import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { StringCompare } from '../../core/string-compare';
import { AlbumModel } from '../../services/album/album-model';
import { AlbumOrder } from './album-order';
import { CollectionTab } from './collection-tab';

@Injectable({
    providedIn: 'root',
})
export class AlbumsPersister {
    private collectionTab: CollectionTab;
    private selectedAlbumKeys: string[] = [];
    private selectedAlbumOrder: AlbumOrder;

    private isInitialized: boolean = false;

    constructor(private settings: BaseSettings, private logger: Logger) {}

    public initialize(collectionTab: CollectionTab): void {
        if (!this.isInitialized) {
            this.collectionTab = collectionTab;
            this.initializeFromSettings();
            this.isInitialized = true;
        }
    }

    public getSelectedAlbums(availableAlbums: AlbumModel[]): AlbumModel[] {
        if (this.collectionTab == undefined) {
            return [];
        }

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
        if (this.collectionTab == undefined) {
            return;
        }

        try {
            if (selectedAlbums != undefined && selectedAlbums.length > 0) {
                this.selectedAlbumKeys = selectedAlbums.map((x) => x.albumKey);
            } else {
                this.selectedAlbumKeys = [];
            }

            if (this.selectedAlbumKeys.length > 0) {
                this.setSelectedAlbumSetting(this.selectedAlbumKeys[0]);
            } else {
                this.setSelectedAlbumSetting('');
            }
        } catch (e) {
            this.logger.error(`Could not set selected albums. Error: ${e.message}`, 'AlbumsPersister', 'setSelectedAlbums');
        }
    }

    public getSelectedAlbumOrder(): AlbumOrder {
        if (this.collectionTab == undefined) {
            return AlbumOrder.byAlbumTitleAscending;
        }

        if (this.selectedAlbumOrder == undefined) {
            return AlbumOrder.byAlbumTitleAscending;
        }

        return this.selectedAlbumOrder;
    }

    public setSelectedAlbumOrder(selectedAlbumOrder: AlbumOrder): void {
        if (this.collectionTab == undefined) {
            return;
        }

        try {
            this.selectedAlbumOrder = selectedAlbumOrder;
            this.setSelectedAlbumOrderSetting(selectedAlbumOrder);
        } catch (e) {
            this.logger.error(`Could not set selected album order. Error: ${e.message}`, 'AlbumsPersister', 'setSelectedAlbumOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!StringCompare.isNullOrWhiteSpace(this.getSelectedAlbumSetting())) {
            this.selectedAlbumKeys = [this.getSelectedAlbumSetting()];
        }

        if (!StringCompare.isNullOrWhiteSpace(this.getSelectedAlbumOrderSetting())) {
            this.selectedAlbumOrder = (AlbumOrder as any)[this.getSelectedAlbumOrderSetting()];
        }
    }

    private getSelectedAlbumSetting(): string {
        switch (this.collectionTab) {
            case CollectionTab.artists:
                return this.settings.albumsTabSelectedAlbum;
            case CollectionTab.genres:
                return this.settings.albumsTabSelectedAlbum;
            case CollectionTab.albums:
                return this.settings.albumsTabSelectedAlbum;
            default: {
                return this.settings.albumsTabSelectedAlbum;
            }
        }
    }

    private setSelectedAlbumSetting(albumKey: string): void {
        switch (this.collectionTab) {
            case CollectionTab.artists:
                this.settings.albumsTabSelectedAlbum = albumKey;
                break;
            case CollectionTab.genres:
                this.settings.albumsTabSelectedAlbum = albumKey;
                break;
            case CollectionTab.albums:
                this.settings.albumsTabSelectedAlbum = albumKey;
                break;
            default: {
                // Do nothing
            }
        }
    }

    private getSelectedAlbumOrderSetting(): string {
        switch (this.collectionTab) {
            case CollectionTab.artists:
                return this.settings.albumsTabSelectedAlbumOrder;
            case CollectionTab.genres:
                return this.settings.albumsTabSelectedAlbumOrder;
            case CollectionTab.albums:
                return this.settings.albumsTabSelectedAlbumOrder;
            default: {
                return this.settings.albumsTabSelectedAlbumOrder;
            }
        }
    }

    private setSelectedAlbumOrderSetting(selectedAlbumOrder: AlbumOrder): void {
        switch (this.collectionTab) {
            case CollectionTab.artists:
                this.settings.albumsTabSelectedAlbumOrder = AlbumOrder[selectedAlbumOrder];
                break;
            case CollectionTab.genres:
                this.settings.albumsTabSelectedAlbumOrder = AlbumOrder[selectedAlbumOrder];
                break;
            case CollectionTab.albums:
                this.settings.albumsTabSelectedAlbumOrder = AlbumOrder[selectedAlbumOrder];
                break;
            default: {
                // Do nothing
            }
        }
    }
}
