import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseMetadataService } from '../../services/metadata/base-metadata.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseNowPlayingNavigationService } from '../../services/now-playing-navigation/base-now-playing-navigation.service';
import { NowPlayingPage } from '../../services/now-playing-navigation/now-playing-page';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { BaseSearchService } from '../../services/search/base-search.service';

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
        trigger('background1Animation', [
            state(
                'fade-out',
                style({
                    opacity: 0,
                })
            ),
            state(
                'fade-in-dark',
                style({
                    opacity: 0.05,
                })
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.15,
                })
            ),
            transition('fade-out => fade-in-dark', animate('1s')),
            transition('fade-out => fade-in-light', animate('1s')),
            transition('fade-in => fade-out', animate('1s')),
        ]),
        trigger('background2Animation', [
            state(
                'fade-out',
                style({
                    opacity: 0,
                })
            ),
            state(
                'fade-in-dark',
                style({
                    opacity: 0.05,
                })
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.15,
                })
            ),
            transition('fade-out => fade-in-dark', animate('1s')),
            transition('fade-out => fade-in-light', animate('1s')),
            transition('fade-in => fade-out', animate('1s')),
        ]),
    ],
})
export class NowPlayingComponent implements OnInit {
    private timerId: number = 0;
    private subscription: Subscription = new Subscription();

    public constructor(
        public appearanceService: BaseAppearanceService,
        private navigationService: BaseNavigationService,
        private metadataService: BaseMetadataService,
        private playbackService: BasePlaybackService,
        private searchService: BaseSearchService,
        private nowPlayingNavigationService: BaseNowPlayingNavigationService
    ) {}

    @ViewChild('stepper') public stepper: MatStepper;

    public background1IsUsed: boolean = false;
    public background1: string = '';
    public background2: string = '';
    public background1Animation: string = 'fade-out';
    public background2Animation: string = this.appearanceService.isUsingLightTheme ? 'fade-in-light' : 'fade-in-dark';

    public controlsVisibility: string = 'visible';

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !this.searchService.isSearching) {
            this.playbackService.togglePlayback();
        }
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async () => {
                await this.setBackgroundsAsync();
            })
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(async () => {
                await this.setBackgroundsAsync();
            })
        );

        this.subscription.add(
            this.nowPlayingNavigationService.navigated$.subscribe((nowPlayingPage: NowPlayingPage) => {
                this.setNowPlayingPage(nowPlayingPage);
            })
        );

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        await this.setBackgroundsAsync();

        this.resetTimer();
        this.setNowPlayingPage(this.nowPlayingNavigationService.currentNowPlayingPage);
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

    private async setBackgroundsAsync(): Promise<void> {
        const proposedBackground: string = await this.metadataService.createImageUrlAsync(this.playbackService.currentTrack);

        if (this.background1IsUsed) {
            if (proposedBackground !== this.background1) {
                this.background2 = proposedBackground;
                this.background1Animation = 'fade-out';

                if (this.appearanceService.isUsingLightTheme) {
                    this.background2Animation = 'fade-in-light';
                } else {
                    this.background2Animation = 'fade-in-dark';
                }

                this.background1IsUsed = false;
            }
        } else {
            if (proposedBackground !== this.background2) {
                this.background1 = proposedBackground;

                if (this.appearanceService.isUsingLightTheme) {
                    this.background1Animation = 'fade-in-light';
                } else {
                    this.background1Animation = 'fade-in-dark';
                }

                this.background2Animation = 'fade-out';
                this.background1IsUsed = true;
            }
        }
    }

    private setNowPlayingPage(nowPlayingPage: NowPlayingPage): void {
        this.stepper.selectedIndex = nowPlayingPage;
    }
}
