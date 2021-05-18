import { Injectable } from '@angular/core';
import { BaseSettings } from '../../core/settings/base-settings';
import { CollectionTab } from './collection-tab';

@Injectable({
    providedIn: 'root',
})
export class CollectionPersister {
    private selectedTab: CollectionTab;

    constructor(private settings: BaseSettings) {
        this.initializeFromSettings();
    }

    public getSelectedTabIndex(): number {
        switch (this.selectedTab) {
            case CollectionTab.artists:
                return 0;
            case CollectionTab.genres:
                return 1;
            case CollectionTab.albums:
                return 2;
            case CollectionTab.tracks:
                return 3;
            case CollectionTab.playlists:
                return 4;
            case CollectionTab.folders:
                return 5;
            default: {
                return 0;
            }
        }
    }

    public setSelectedTabFromTabIndex(selectedIndex: number): void {
        switch (selectedIndex) {
            case 0:
                this.saveSelectedTab(CollectionTab.artists);
                break;
            case 1:
                this.saveSelectedTab(CollectionTab.genres);
                break;
            case 2:
                this.saveSelectedTab(CollectionTab.albums);
                break;
            case 3:
                this.saveSelectedTab(CollectionTab.tracks);
                break;
            case 4:
                this.saveSelectedTab(CollectionTab.playlists);
                break;
            case 5:
                this.saveSelectedTab(CollectionTab.folders);
                break;
            default: {
                this.saveSelectedTab(CollectionTab.artists);
                break;
            }
        }
    }

    private initializeFromSettings(): void {
        this.selectedTab = (CollectionTab as any)[this.settings.selectedCollectionTab];
    }

    private saveSelectedTab(selectedTab: CollectionTab): void {
        this.selectedTab = selectedTab;
        this.settings.selectedCollectionTab = CollectionTab[selectedTab];
    }
}
