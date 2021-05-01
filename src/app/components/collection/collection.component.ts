import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-collection',
    host: { style: 'display: block' },
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionComponent implements OnInit {
    private _selectedIndex: number;

    constructor(public appearanceService: BaseAppearanceService, private settings: BaseSettings) {}

    public get selectedIndex(): number {
        return this._selectedIndex;
    }
    public set selectedIndex(v: number) {
        this._selectedIndex = v;
        this.saveSelectedTabToSettings();

        // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('tab-changed'));
    }

    public ngOnInit(): void {
        this.setSelectedTabFromSettings();
    }

    private setSelectedTabFromSettings(): void {
        switch (this.settings.selectedTab) {
            case 'artists':
                this.selectedIndex = 0;
                break;
            case 'genres':
                this.selectedIndex = 1;
                break;
            case 'albums':
                this.selectedIndex = 2;
                break;
            case 'tracks':
                this.selectedIndex = 3;
                break;
            case 'playlists':
                this.selectedIndex = 4;
                break;
            case 'folders':
                this.selectedIndex = 5;
                break;
            default: {
                this.selectedIndex = 0;
                break;
            }
        }
    }

    private saveSelectedTabToSettings(): void {
        switch (this.selectedIndex) {
            case 0:
                this.settings.selectedTab = 'artists';
                break;
            case 1:
                this.settings.selectedTab = 'genres';
                break;
            case 2:
                this.settings.selectedTab = 'albums';
                break;
            case 3:
                this.settings.selectedTab = 'tracks';
                break;
            case 4:
                this.settings.selectedTab = 'playlists';
                break;
            case 5:
                this.settings.selectedTab = 'folders';
                break;
            default: {
                this.settings.selectedTab = 'artists';
                break;
            }
        }
    }
}
