import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../common/scheduling/scheduler';
import { BasePlaybackInformationService } from '../../services/playback-information/base-playback-information.service';
import { PlaybackInformation } from '../../services/playback-information/playback-information';

@Component({
    selector: 'app-playback-cover-art',
    host: { style: 'display: block' },
    templateUrl: './playback-cover-art.component.html',
    styleUrls: ['./playback-cover-art.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('contentAnimation', [
            state(
                'down',
                style({
                    transform: 'translateY(0px)',
                })
            ),
            state(
                'animated-down',
                style({
                    transform: 'translateY(0px)',
                })
            ),
            state(
                'up',
                style({
                    transform: 'translateY(-100%)',
                })
            ),
            state(
                'animated-up',
                style({
                    transform: 'translateY(-100%)',
                })
            ),
            transition('down => animated-up', animate('350ms ease-out')),
            transition('up => animated-down', animate('350ms ease-out')),
        ]),
    ],
})
export class PlaybackCoverArtComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(private playbackInformationService: BasePlaybackInformationService, private scheduler: Scheduler) {}

    public contentAnimation: string = 'down';

    @Input()
    public size: number = 0;

    public topImageUrl: string = '';
    public bottomImageUrl: string = '';

    private currentImageUrl: string = '';

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.switchDown(currentPlaybackInformation.imageUrl, false);

        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchUp(playbackInformation.imageUrl);
            })
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchDown(playbackInformation.imageUrl, true);
            })
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchUp(playbackInformation.imageUrl);
            })
        );
    }

    private async switchUp(newImage: string): Promise<void> {
        if (this.contentAnimation !== 'down') {
            this.topImageUrl = this.currentImageUrl;

            this.contentAnimation = 'down';
            await this.scheduler.sleepAsync(100);
        }

        this.bottomImageUrl = newImage;
        this.currentImageUrl = newImage;
        this.contentAnimation = 'animated-up';
        await this.scheduler.sleepAsync(350);
    }

    private async switchDown(newImage: string, performAnimation: boolean): Promise<void> {
        if (performAnimation) {
            if (this.contentAnimation !== 'up') {
                this.bottomImageUrl = this.currentImageUrl;

                this.contentAnimation = 'up';
                await this.scheduler.sleepAsync(100);
            }
        }

        this.topImageUrl = newImage;
        this.currentImageUrl = newImage;

        if (performAnimation) {
            this.contentAnimation = 'animated-down';
            await this.scheduler.sleepAsync(350);
        } else {
            this.contentAnimation = 'down';
        }
    }
}
