import { AfterViewInit, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { AnimatedPage } from '../animated-page';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { CollectionNavigationService } from '../../../services/collection-navigation/collection-navigation.service';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-collection',
    host: { style: 'display: block' },
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeftToRight, enterRightToLeft],
})
export class CollectionComponent extends AnimatedPage implements AfterViewInit {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public collectionNavigationService: CollectionNavigationService,
        public settings: SettingsBase,
        private playbackService: PlaybackService,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
    ) {
        super();
        this.page = this.collectionNavigationService.page;
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !(event.target instanceof HTMLInputElement)) {
            void this.playbackService.togglePlaybackAsync();
        }
    }

    public ngAfterViewInit(): void {
        this.setAudioVisualizer();
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('collectionAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }

    public override setPage(page: number): void {
        this.previousPage = this.page;
        this.page = page;

        this.collectionNavigationService.page = page;
    }
}
