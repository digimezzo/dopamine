import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { TrackModel } from '../../../services/track/track-model';
import { MetadataService } from '../../../services/metadata/metadata.service';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { Constants } from '../../../common/application/constants';
import { PlaybackInformationService } from '../../../services/playback-information/playback-information.service';
import { IndexingService } from '../../../services/indexing/indexing.service';

@Component({
    selector: 'app-playback-information',
    host: { style: 'display: block' },
    templateUrl: './playback-information.component.html',
    styleUrls: ['./playback-information.component.scss'],
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
export class PlaybackInformationComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playbackInformationService: PlaybackInformationService,
        private indexingService: IndexingService,
        private metadataService: MetadataService,
        private scheduler: SchedulerBase,
    ) {}

    @Input()
    public highContrast: boolean = false;

    @Input()
    public position: string = 'bottom';

    @Input()
    public showRating: boolean = false;

    @Input()
    public showLove: boolean = false;

    @Input()
    public height: number = 0;

    @Input()
    public largeFontSize: number = 0;

    @Input()
    public smallFontSize: number = 0;

    public contentAnimation: string = 'down';

    public topContentTrack: TrackModel | undefined;
    public bottomContentTrack: TrackModel | undefined;

    private currentTrack: TrackModel | undefined;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public get flexJustifyClass(): string {
        switch (this.position) {
            case 'top': {
                return 'justify-content-flex-start';
            }
            case 'center': {
                return 'justify-content-center';
            }
            case 'bottom': {
                return 'justify-content-flex-end';
            }
            default: {
                return 'justify-content-flex-end';
            }
        }
    }

    public get largeFontClasses(): string {
        switch (this.position) {
            case 'top': {
                return `ellipsis-two-lines ${this.getLargeFontWeightClass()}`.trim();
            }
            case 'center': {
                return `ellipsis ${this.getLargeFontWeightClass()}`.trim();
            }
            case 'bottom': {
                return `ellipsis-two-lines ${this.getLargeFontWeightClass()}`.trim();
            }
            default: {
                return `ellipsis ${this.getLargeFontWeightClass()}`.trim();
            }
        }
    }

    public get smallFontClasses(): string {
        return this.getSmallFontWeightClass();
    }

    private getLargeFontWeightClass(): string {
        if (this.largeFontSize >= 20) {
            return 'thinner';
        }

        return '';
    }

    private getSmallFontWeightClass(): string {
        if (this.smallFontSize >= 20) {
            return 'thinner';
        }

        return '';
    }

    public async ngOnInit(): Promise<void> {
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.switchDown(currentPlaybackInformation.track, false);

        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchUp(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchDown(playbackInformation.track, true));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchUp(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.metadataService.ratingSaved$.subscribe((track: TrackModel) => {
                this.setRating(track);
            }),
        );

        this.subscription.add(
            this.metadataService.loveSaved$.subscribe((track: TrackModel) => {
                this.setLove(track);
            }),
        );

        this.subscription.add(
            this.indexingService.indexingFinished$.subscribe(async (_) => {
                const currentPlaybackInformation: PlaybackInformation =
                    await this.playbackInformationService.getCurrentPlaybackInformationAsync();
                await this.switchDown(currentPlaybackInformation.track, false);
            }),
        );
    }

    private setRating(track: TrackModel): void {
        if (this.currentTrack != undefined && this.currentTrack.path === track.path) {
            this.currentTrack.rating = track.rating;
        }
    }

    private setLove(track: TrackModel): void {
        if (this.currentTrack != undefined && this.currentTrack.path === track.path) {
            this.currentTrack.love = track.love;
        }
    }

    private async switchUp(track: TrackModel | undefined): Promise<void> {
        let newTrack: TrackModel | undefined;

        if (track != undefined) {
            newTrack = track;
        }

        if (this.contentAnimation !== 'down') {
            this.topContentTrack = this.currentTrack;

            this.contentAnimation = 'down';
            await this.scheduler.sleepAsync(100);
        }

        this.bottomContentTrack = newTrack;
        this.currentTrack = newTrack;

        this.contentAnimation = 'animated-up';
        await this.scheduler.sleepAsync(Constants.playbackInfoSwitchAnimationMilliseconds);
    }

    private async switchDown(track: TrackModel | undefined, performAnimation: boolean): Promise<void> {
        let newTrack: TrackModel | undefined;

        if (track != undefined) {
            newTrack = track;
        }

        if (performAnimation) {
            if (this.contentAnimation !== 'up') {
                this.bottomContentTrack = this.currentTrack;

                this.contentAnimation = 'up';
                await this.scheduler.sleepAsync(100);
            }
        }

        this.topContentTrack = newTrack;
        this.currentTrack = newTrack;

        if (performAnimation) {
            this.contentAnimation = 'animated-down';
            await this.scheduler.sleepAsync(Constants.playbackInfoSwitchAnimationMilliseconds);
        } else {
            this.contentAnimation = 'down';
        }
    }
}
