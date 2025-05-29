import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { NowPlayingPage } from '../../../services/now-playing-navigation/now-playing-page';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { MetadataService } from '../../../services/metadata/metadata.service';
import { PlaybackService } from '../../../services/playback/playback.service';
import { NowPlayingNavigationServiceBase } from '../../../services/now-playing-navigation/now-playing-navigation.service.base';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { AnimatedPage } from '../animated-page';
import { SettingsBase } from '../../../common/settings/settings.base';

@Component({
    selector: 'app-now-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss'],
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
        trigger('background1Animation', [
            state(
                'fade-out',
                style({
                    opacity: 0,
                }),
            ),
            state(
                'fade-in-dark',
                style({
                    opacity: 0.05,
                }),
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.15,
                }),
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
                }),
            ),
            state(
                'fade-in-dark',
                style({
                    opacity: 0.05,
                }),
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.15,
                }),
            ),
            transition('fade-out => fade-in-dark', animate('1s')),
            transition('fade-out => fade-in-light', animate('1s')),
            transition('fade-in => fade-out', animate('1s')),
        ]),
    ],
})
export class NowPlayingComponent extends AnimatedPage implements OnInit, AfterViewInit {
    private timerId: number = 0;
    private subscription: Subscription = new Subscription();

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private navigationService: NavigationServiceBase,
        private metadataService: MetadataService,
        private playbackService: PlaybackService,
        private nowPlayingNavigationService: NowPlayingNavigationServiceBase,
        private scheduler: SchedulerBase,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
        private settings: SettingsBase,
    ) {
        super();
    }

    public background1IsUsed: boolean = false;
    public background1: string = '';
    public background2: string = '';
    public background1Animation: string = 'fade-out';
    public background2Animation: string = this.appearanceService.isUsingLightTheme ? 'fade-in-light' : 'fade-in-dark';

    public pageSwitchAnimation: string = 'fade-out';
    public controlsVisibility: string = 'visible';

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !(event.target instanceof HTMLInputElement)) {
            this.playbackService.togglePlayback();
        }
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(() => {
                PromiseUtils.noAwait(this.setBackgroundsAsync());
            }),
        );

        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                PromiseUtils.noAwait(this.setBackgroundsAsync());
            }),
        );

        this.subscription.add(
            this.nowPlayingNavigationService.navigated$.subscribe((nowPlayingPage: NowPlayingPage) => {
                this.setNowPlayingPage(nowPlayingPage);
            }),
        );

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
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

    private async setBackgroundsAsync(): Promise<void> {
        const proposedBackground: string = await this.metadataService.createAlbumImageUrlAsync(this.playbackService.currentTrack, 0);

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
        this.page = nowPlayingPage;
    }

    public async ngAfterViewInit(): Promise<void> {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.setNowPlayingPage(this.nowPlayingNavigationService.currentNowPlayingPage);
            this.pageSwitchAnimation = 'fade-in';
        }, 0);

        this.setAudioVisualizer();

        await this.scheduler.sleepAsync(500);
        await this.setBackgroundsAsync();
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('nowPlayingAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }
}
