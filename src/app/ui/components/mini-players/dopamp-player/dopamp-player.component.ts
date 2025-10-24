import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { AudioVisualizer } from '../../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../../common/io/document-proxy';
import { enterLeftToRight, enterRightToLeft } from '../../../animations/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { Subscription } from 'rxjs';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { IpcProxyBase } from '../../../../common/io/ipc-proxy.base';

@Component({
    selector: 'app-cover-player',
    host: { style: 'display: block' },
    templateUrl: './dopamp-player.component.html',
    styleUrls: ['./dopamp-player.component.scss'],
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
                    opacity: 0.15,
                }),
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.25,
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
                    opacity: 0.15,
                }),
            ),
            state(
                'fade-in-light',
                style({
                    opacity: 0.25,
                }),
            ),
            transition('fade-out => fade-in-dark', animate('1s')),
            transition('fade-out => fade-in-light', animate('1s')),
            transition('fade-in => fade-out', animate('1s')),
        ]),
    ],
})
export class DopampPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
    private subscription: Subscription = new Subscription();
    private timerId: number = 0;

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private playbackService: PlaybackService,
        private metadataService: MetadataService,
        private audioVisualizer: AudioVisualizer,
        private documentProxy: DocumentProxy,
        private ipcProxy: IpcProxyBase,
        public settings: SettingsBase,
    ) {}

    public background1IsUsed: boolean = false;
    public background1: string = '';
    public background2: string = '';
    public background1Animation: string = 'fade-out';
    public background2Animation: string = this.appearanceService.isUsingLightTheme ? 'fade-in-light' : 'fade-in-dark';

    public controlsVisibility: string = 'visible';

    public async ngAfterViewInit(): Promise<void> {
        this.setAudioVisualizer();
        await this.setBackgroundsAsync();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
    }

    public openPlaylistWindow(): void {
        this.ipcProxy.sendToMainProcess('open-playlist-window', { playerType: 'dopamp' });
    }

    private setAudioVisualizer(): void {
        const canvas: HTMLCanvasElement = this.documentProxy.getCanvasById('dopampPlayerAudioVisualizer');
        this.audioVisualizer.connectCanvas(canvas);
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

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
}
