import { AfterViewInit, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CollectionPersister } from './collection-persister';
import { TabSelectionGetter } from './tab-selection-getter';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { enterAnimation } from '../../animations/animations';

@Component({
    selector: 'app-collection',
    host: { style: 'display: block' },
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterAnimation],
})
export class CollectionComponent implements AfterViewInit {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
        private playbackService: PlaybackServiceBase,
        private searchService: SearchServiceBase,
        private collectionPersister: CollectionPersister,
        private tabSelectionGetter: TabSelectionGetter,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
    ) {
        this.page = this.tabSelectionGetter.getTabIndexForLabel(this.collectionPersister.selectedTab);
    }

    public page: number = 0;

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !this.searchService.isSearching) {
            this.playbackService.togglePlayback();
        }
    }

    public ngAfterViewInit(): void {
        this.setAudioVisualizer();
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('collectionAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }

    public setPage(page: number): void {
        this.page = page;

        this.collectionPersister.selectedTab = this.tabSelectionGetter.getTabLabelForIndex(page);

        // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('tab-changed'));
    }
}
