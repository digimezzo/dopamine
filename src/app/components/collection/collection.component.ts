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

        // Manually trigger a window resize event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('resize'));
    }

    public async ngOnInit(): Promise<void> {
        this.setSelectedTabFromSettings();
    }

    private setSelectedTabFromSettings(): void {
        switch (this.settings.selectedTab) {
            case 'explore':
                this.selectedIndex = 0;
                break;
            case 'tracks':
                this.selectedIndex = 1;
                break;
            case 'playlists':
                this.selectedIndex = 2;
                break;
            case 'folders':
                this.selectedIndex = 3;
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
                this.settings.selectedTab = 'explore';
                break;
            case 1:
                this.settings.selectedTab = 'tracks';
                break;
            case 2:
                this.settings.selectedTab = 'playlists';
                break;
            case 3:
                this.settings.selectedTab = 'folders';
                break;
            default: {
                this.settings.selectedTab = 'explore';
                break;
            }
        }
    }
}
