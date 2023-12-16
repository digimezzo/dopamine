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
        trigger('enterAnimation', [
            transition(':enter', [
                style({ 'margin-left': '{{marginLeft}}', 'margin-right': '{{marginRight}}', opacity: 0 }),
                animate(`${Constants.screenEaseSpeedMilliseconds}ms ease-out`, style({ 'margin-left': 0, 'margin-right': 0, opacity: 1 })),
            ]),
        ]),
    ],
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

    public pageSwitchAnimation: string = 'fade-out';
    public page: number = 0;
    public marginLeft: string = '0px';
    public marginRight: string = '0px';

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !this.searchService.isSearching) {
            this.playbackService.togglePlayback();
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

    public setPage(page: number): void {
        let marginToApply: number = Constants.screenEaseMarginPixels;

        if (this.page < page) {
            marginToApply = -Constants.screenEaseMarginPixels;
        }

        this.marginLeft = `${marginToApply}px`;
        this.marginRight = `${-marginToApply}px`;

        this.page = page;

        this.collectionPersister.selectedTab = this.tabSelectionGetter.getTabLabelForIndex(page);

        // Manually trigger a custom event. Together with CdkVirtualScrollViewportPatchDirective,
        // this will ensure that CdkVirtualScrollViewport triggers a viewport size check when the
        // selected tab is changed.
        window.dispatchEvent(new Event('tab-changed'));
    }
}
