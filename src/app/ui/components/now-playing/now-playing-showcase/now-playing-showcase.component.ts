import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { WindowSize } from '../../../../common/io/window-size';
import { ApplicationBase } from '../../../../common/io/application.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { PlaybackInformationService } from '../../../../services/playback-information/playback-information.service';
import { PlaybackInformation } from '../../../../services/playback-information/playback-information';
import { Constants } from '../../../../common/application/constants';

@Component({
    selector: 'app-now-playing-showcase',
    host: { style: 'display: block; width: 100%; height: 100%;' },
    templateUrl: './now-playing-showcase.component.html',
    styleUrls: ['./now-playing-showcase.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('overlayAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                group([
                    animate('200ms ease-out', style({ opacity: 1 })),
                    query('@overlayImageAnimation', animateChild(), { optional: true }),
                ]),
            ]),
            transition(':leave', [
                group([
                    animate('250ms ease-in', style({ opacity: 0 })),
                    query('@overlayImageAnimation', animateChild(), { optional: true }),
                ]),
            ]),
        ]),
        trigger('overlayImageAnimation', [
            transition(':enter', [
                style({ transform: 'scale(0.15)', opacity: 0 }),
                animate('400ms cubic-bezier(0.2, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 })),
            ]),
            transition(':leave', [animate('250ms ease-in', style({ transform: 'scale(0.15)', opacity: 0 }))]),
        ]),
    ],
})
export class NowPlayingShowcaseComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        public settings: SettingsBase,
        private application: ApplicationBase,
        private playbackInformationService: PlaybackInformationService,
    ) {}

    public coverArtSize: number = 0;
    public playbackInformationHeight: number = 0;
    public playbackInformationLargeFontSize: number = 0;
    public playbackInformationSmallFontSize: number = 0;
    public coverArtOverlayVisible: boolean = false;
    public currentCoverArtUrl: string = '';

    @HostListener('window:resize')
    public onResize(): void {
        this.setSizes();
    }

    @HostListener('document:keydown.escape')
    public onEscapeKey(): void {
        this.closeCoverArtOverlay();
    }

    public async ngOnInit(): Promise<void> {
        this.setSizes();

        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        this.currentCoverArtUrl = currentPlaybackInformation.imageUrl;

        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((info: PlaybackInformation) => {
                this.currentCoverArtUrl = info.imageUrl;
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((info: PlaybackInformation) => {
                this.currentCoverArtUrl = info.imageUrl;
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe((info: PlaybackInformation) => {
                this.currentCoverArtUrl = info.imageUrl;
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public get hasCoverArt(): boolean {
        return this.currentCoverArtUrl !== '' && this.currentCoverArtUrl !== Constants.emptyImage;
    }

    public openCoverArtOverlay(): void {
        if (this.hasCoverArt) {
            this.coverArtOverlayVisible = true;
        }
    }

    public closeCoverArtOverlay(): void {
        this.coverArtOverlayVisible = false;
    }

    private setSizes(): void {
        const applicationWindowSize: WindowSize = this.application.getWindowSize();
        const playbackControlsHeight: number = 70;
        const windowControlsHeight: number = 46;
        const horizontalMargin: number = 100;

        const availableWidth: number = applicationWindowSize.width - horizontalMargin;
        const availableHeight: number = applicationWindowSize.height - (playbackControlsHeight + windowControlsHeight);

        const meanSize = Math.sqrt(availableWidth * availableHeight);
        this.coverArtSize = meanSize / 3; // Tweak divisor to taste

        this.playbackInformationHeight = this.coverArtSize;
        this.playbackInformationLargeFontSize = this.playbackInformationHeight / 8;
        this.playbackInformationSmallFontSize = this.playbackInformationLargeFontSize / 1.5;
    }
}
