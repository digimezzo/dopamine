import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../common/scheduling/scheduler';
import { BasePlaybackInformationService } from '../../services/playback-information/base-playback-information.service';
import { PlaybackInformation } from '../../services/playback-information/playback-information';
import { TrackModel } from '../../services/track/track-model';

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
export class PlaybackInformationComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(private playbackInformationService: BasePlaybackInformationService, private scheduler: Scheduler) {}

    @Input()
    public height: number = 0;

    @Input()
    public largeFontSize: number = 0;

    @Input()
    public smallFontSize: number = 0;

    public contentAnimation: string = 'down';

    public topContentArtist: string = '';
    public topContentTitle: string = '';
    public bottomContentArtist: string = '';
    public bottomContentTitle: string = '';

    private currentArtist: string = '';
    private currentTitle: string = '';

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.switchDown(currentPlaybackInformation.track, false);

        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchUp(playbackInformation.track);
            })
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchDown(playbackInformation.track, true);
            })
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe(async (playbackInformation: PlaybackInformation) => {
                await this.switchUp(playbackInformation.track);
            })
        );
    }

    private async switchUp(track: TrackModel): Promise<void> {
        let newArtist: string = '';
        let newTitle: string = '';

        if (track != undefined) {
            newArtist = track.artists;
            newTitle = track.title;
        }

        if (this.contentAnimation !== 'down') {
            this.topContentArtist = this.currentArtist;
            this.topContentTitle = this.currentTitle;

            this.contentAnimation = 'down';
            await this.scheduler.sleepAsync(100);
        }

        this.bottomContentArtist = newArtist;
        this.bottomContentTitle = newTitle;
        this.currentArtist = newArtist;
        this.currentTitle = newTitle;

        this.contentAnimation = 'animated-up';
        await this.scheduler.sleepAsync(350);
    }

    private async switchDown(track: TrackModel, performAnimation: boolean): Promise<void> {
        let newArtist: string = '';
        let newTitle: string = '';

        if (track != undefined) {
            newArtist = track.artists;
            newTitle = track.title;
        }

        if (performAnimation) {
            if (this.contentAnimation !== 'up') {
                this.bottomContentArtist = this.currentArtist;
                this.bottomContentTitle = this.currentTitle;

                this.contentAnimation = 'up';
                await this.scheduler.sleepAsync(100);
            }
        }

        this.topContentArtist = newArtist;
        this.topContentTitle = newTitle;
        this.currentArtist = newArtist;
        this.currentTitle = newTitle;

        if (performAnimation) {
            this.contentAnimation = 'animated-down';
            await this.scheduler.sleepAsync(350);
        } else {
            this.contentAnimation = 'down';
        }
    }
}
