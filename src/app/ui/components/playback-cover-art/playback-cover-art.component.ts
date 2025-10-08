import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { Constants } from '../../../common/application/constants';
import { PlaybackInformationService } from '../../../services/playback-information/playback-information.service';
import { IndexingService } from '../../../services/indexing/indexing.service';

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
                }),
            ),
            state(
                'animated-down',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            state(
                'up',
                style({
                    transform: 'translateY(-100%)',
                }),
            ),
            state(
                'animated-up',
                style({
                    transform: 'translateY(-100%)',
                }),
            ),
            transition('down => animated-up', animate(`${Constants.playbackInfoSwitchAnimationMilliseconds}ms ease-out`)),
            transition('up => animated-down', animate(`${Constants.playbackInfoSwitchAnimationMilliseconds}ms ease-out`)),
        ]),
    ],
})
export class PlaybackCoverArtComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private currentImageUrl: string = '';

    public constructor(
        private playbackInformationService: PlaybackInformationService,
        private scheduler: SchedulerBase,
        private indexingService: IndexingService,
    ) {}

    public contentAnimation: string = 'down';

    @Input()
    public size: number = 0;

    @Input()
    public borderRadius: number = 0;

    public topImageUrl: string = '';
    public bottomImageUrl: string = '';

    public get topImageBackgroundClass(): string {
        if (this.topImageUrl !== Constants.emptyImage) {
            return 'app-playback-cover-art__content-background';
        }

        return '';
    }

    public get bottomImageBackgroundClass(): string {
        if (this.bottomImageUrl !== Constants.emptyImage) {
            return 'app-playback-cover-art__content-background';
        }

        return '';
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.switchDown(currentPlaybackInformation.imageUrl, false);

        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchUp(playbackInformation.imageUrl));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchDown(playbackInformation.imageUrl, true));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchUp(playbackInformation.imageUrl));
            }),
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(async (_) => {
                const currentPlaybackInformation: PlaybackInformation =
                    await this.playbackInformationService.getCurrentPlaybackInformationAsync();
                await this.switchDown(currentPlaybackInformation.imageUrl, false);
            }),
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
        await this.scheduler.sleepAsync(Constants.playbackInfoSwitchAnimationMilliseconds);
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
            await this.scheduler.sleepAsync(Constants.playbackInfoSwitchAnimationMilliseconds);
        } else {
            this.contentAnimation = 'down';
        }
    }
}
