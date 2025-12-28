import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AnimatedPage } from '../animated-page';
import { AlbumServiceBase } from '../../../services/album/album-service.base';
import { AlbumModel } from '../../../services/album/album-model';
import { PlaybackService } from '../../../services/playback/playback.service';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';

@Component({
    selector: 'app-highlights',
    host: { style: 'display: block' },
    templateUrl: './highlights.component.html',
    styleUrls: ['./highlights.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        enterLeftToRight,
        enterRightToLeft,
        trigger('controlsVisibility', [
            state(
                'visible',
                style({
                    opacity: 1,
                }),
            ),
            state(
                'hidden',
                style({
                    opacity: 0,
                }),
            ),
            transition('hidden => visible', animate('.25s')),
            transition('visible => hidden', animate('1s')),
        ]),
    ],
})
export class HighlightsComponent extends AnimatedPage implements OnInit, AfterViewInit {
    private timerId: number = 0;
    public mostPlayedAlbums: AlbumModel[] = [];
    public animationDelays: number[] = [];

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private navigationService: NavigationServiceBase,
        private playbackService: PlaybackService,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
        private settings: SettingsBase,
        private albumService: AlbumServiceBase,
    ) {
        super();
    }

    public controlsVisibility: string = 'visible';

    public ngOnInit(): void {
        this.loadMostPlayedAlbums();
        this.generateRandomDelays();

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
    }

    public ngAfterViewInit(): void {
        this.setAudioVisualizer();
    }

    private loadMostPlayedAlbums(): void {
        this.mostPlayedAlbums = this.albumService.getMostPlayedAlbums(12);
    }

    private generateRandomDelays(): void {
        this.animationDelays = [];
        for (let i = 0; i < 12; i++) {
            // Generate random delay between 0 and 0.6 seconds
            const delay = Math.random() * 0.6;
            this.animationDelays.push(delay);
        }
    }

    public async goBackToCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToCollectionAsync();
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

        if (this.settings.keepPlaybackControlsVisibleOnNowPlayingPage) {
            return;
        }

        this.timerId = window.setTimeout(() => {
            this.controlsVisibility = 'hidden';
        }, 5000);
    }

    public async onAlbumClickAsync(album: AlbumModel | undefined): Promise<void> {
        if (!album) {
            return;
        }

        await this.playbackService.enqueueAndPlayAlbumAsync(album);
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('highlightsAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }
}
