import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Desktop } from '../../common/io/desktop';
import { WindowSize } from '../../common/io/window-size';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';

@Component({
    selector: 'app-now-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('controlsVisibility', [
            state(
                'visible',
                style({
                    opacity: 1,
                })
            ),
            state(
                'hidden',
                style({
                    opacity: 0,
                })
            ),
            transition('hidden => visible', animate('.25s')),
            transition('visible => hidden', animate('1s')),
        ]),
    ],
})
export class NowPlayingComponent implements OnInit {
    private timerId: number = 0;
    constructor(
        public appearanceService: BaseAppearanceService,
        private navigationService: BaseNavigationService,
        private playbackService: BasePlaybackService,
        private desktop: Desktop
    ) {}

    public coverArtSize: number = 0;
    public playbackInformationHeight: number = 0;
    public playbackInformationLargeFontSize: number = 0;
    public playbackInformationSmallFontSize: number = 0;
    public controlsVisibility: string = 'visible';

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ') {
            this.playbackService.togglePlayback();
        }
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event: any): void {
        this.setSizes();
    }

    public ngOnInit(): void {
        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        this.resetTimer();
        this.setSizes();
    }

    public goBackToCollection(): void {
        this.navigationService.navigateToCollection();
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

        this.timerId = window.setTimeout(() => {
            this.controlsVisibility = 'hidden';
        }, 5000);
    }

    private setSizes(): void {
        const applicationWindowSize: WindowSize = this.desktop.getApplicationWindowSize();
        const playbackControlsHeight: number = 70;
        const windowControlsHeight: number = 46;
        const horizontalMargin: number = 100;

        const availableWidth: number = applicationWindowSize.width - horizontalMargin;
        const availableHeight: number = applicationWindowSize.height - (playbackControlsHeight + windowControlsHeight);

        const proposedCoverArtSize: number = availableHeight / 2;

        if (proposedCoverArtSize * 3 > availableWidth) {
            this.coverArtSize = availableWidth / 3;
        } else {
            this.coverArtSize = proposedCoverArtSize;
        }

        this.playbackInformationHeight = this.coverArtSize / 2;
        this.playbackInformationLargeFontSize = this.playbackInformationHeight / 2.5;
        this.playbackInformationSmallFontSize = this.playbackInformationLargeFontSize / 2;
    }
}
