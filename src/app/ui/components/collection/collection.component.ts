import { AfterViewInit, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CollectionPersister } from './collection-persister';
import { TabSelectionGetter } from './tab-selection-getter';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Constants } from '../../../common/application/constants';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';

@Component({
    selector: 'app-collection',
    host: { style: 'display: block' },
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('pageSwitchAnimation', [
            state('fade-out', style({ opacity: 0 })),
            state('fade-in', style({ opacity: 1 })),
            transition('fade-in => fade-out', animate('10ms ease-out')),
            transition('fade-out => fade-in', animate(`${Constants.pageSwitchAnimationMilliseconds}ms ease-out`)),
        ]),
    ],
})
export class CollectionComponent implements AfterViewInit {
    private _selectedIndex: number;
    private previousSelectedIndex: number = 99;

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
        this.selectedIndex = this.tabSelectionGetter.getTabIndexForLabel(this.collectionPersister.selectedTab);
    }

    public pageSwitchAnimation: string = 'fade-out';

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
        // previousSelectedIndex ensures selected tab is changed only once
        if (v !== this.previousSelectedIndex) {
            this.previousSelectedIndex = v;
            this._selectedIndex = v;
            this.collectionPersister.selectedTab = this.tabSelectionGetter.getTabLabelForIndex(v);

            // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
            // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
            // selected tab is changed.
            window.dispatchEvent(new Event('tab-changed'));
        }
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.pageSwitchAnimation = 'fade-in';
        }, 0);

        this.setAudioVisualizer();
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('collectionAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }
}
