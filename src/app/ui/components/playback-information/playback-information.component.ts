import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { PlaybackInformation } from '../../../services/playback-information/playback-information';
import { TrackModel } from '../../../services/track/track-model';
import { PlaybackInformationServiceBase } from '../../../services/playback-information/playback-information.service.base';
import { MetadataServiceBase } from '../../../services/metadata/metadata.service.base';
import { SchedulerBase } from '../../../common/scheduling/scheduler.base';
import { Constants } from '../../../common/application/constants';

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
export class PlaybackInformationComponent implements OnInit, AfterViewInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playbackInformationService: PlaybackInformationServiceBase,
        private metadataService: MetadataServiceBase,
        private scheduler: SchedulerBase,
    ) {}

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

    public get ellipsisClass(): string {
        switch (this.position) {
            case 'top': {
                return 'ellipsis-two-lines';
            }
            case 'center': {
                return 'ellipsis';
            }
            case 'bottom': {
                return 'ellipsis-two-lines';
            }
            default: {
                return 'ellipsis';
            }
        }
    }

    public async ngOnInit(): Promise<void> {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchUp(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.switchDown(playbackInformation.track));
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
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.playbackInfoInitDelayMilliseconds);
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.switchUp(currentPlaybackInformation.track);
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

    private async switchDown(track: TrackModel | undefined): Promise<void> {
        let newTrack: TrackModel | undefined;

        if (track != undefined) {
            newTrack = track;
        }

        if (this.contentAnimation !== 'up') {
            this.bottomContentTrack = this.currentTrack;

            this.contentAnimation = 'up';
            await this.scheduler.sleepAsync(100);
        }

        this.topContentTrack = newTrack;
        this.currentTrack = newTrack;

        this.contentAnimation = 'animated-down';
        await this.scheduler.sleepAsync(Constants.playbackInfoSwitchAnimationMilliseconds);
    }
}
