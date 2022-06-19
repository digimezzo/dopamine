import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { BaseSearchService } from '../../services/search/base-search.service';
import { CollectionPersister } from './collection-persister';

@Component({
    selector: 'app-collection',
    host: { style: 'display: block' },
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionComponent implements OnInit {
    private _selectedIndex: number;

    constructor(
        public appearanceService: BaseAppearanceService,
        public settings: BaseSettings,
        private playbackService: BasePlaybackService,
        private searchService: BaseSearchService,
        private collectionPersister: CollectionPersister
    ) {}

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !this.searchService.isSearching) {
            this.playbackService.togglePlayback();
        }
    }

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    public set selectedIndex(v: number) {
        this._selectedIndex = v;
        this.collectionPersister.setSelectedTabFromTabIndex(v);

        // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('tab-changed'));
    }

    public ngOnInit(): void {
        this.selectedIndex = this.collectionPersister.getSelectedTabIndex();
    }
}
