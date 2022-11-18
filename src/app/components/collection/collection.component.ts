import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { BaseSearchService } from '../../services/search/base-search.service';
import { CollectionPersister } from './collection-persister';
import { TabSelectionGetter } from './tab-selection-getter';

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
        private collectionPersister: CollectionPersister,
        private tabSelectionGetter: TabSelectionGetter
    ) {}

    public get artistsTabLabel(): string {
        return Constants.artistsTabLabel;
    }

    public get genresTabLabel(): string {
        return Constants.genresTabLabel;
    }

    public get albumsTabLabel(): string {
        return Constants.albumsTabLabel;
    }

    public get tracksTabLabel(): string {
        return Constants.tracksTabLabel;
    }

    public get playlistsTabLabel(): string {
        return Constants.playlistsTabLabel;
    }

    public get foldersTabLabel(): string {
        return Constants.foldersTabLabel;
    }

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
        this.collectionPersister.selectedTab = this.tabSelectionGetter.getTabLabelForIndex(v);

        // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('tab-changed'));
    }

    public ngOnInit(): void {
        this.selectedIndex = this.tabSelectionGetter.getTabIndexForLabel(this.collectionPersister.selectedTab);
    }
}
