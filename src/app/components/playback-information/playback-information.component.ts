import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../common/scheduler/scheduler';
import { FormatTrackArtistsPipe } from '../../pipes/format-track-artists.pipe';
import { FormatTrackTitlePipe } from '../../pipes/format-track-title.pipe';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
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

    constructor(
        private playbackService: BasePlaybackService,
        private formatTrackArtistsPipe: FormatTrackArtistsPipe,
        private formatTrackTitlePipe: FormatTrackTitlePipe,
        private scheduler: Scheduler
    ) {}

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
        await this.switchDown(this.playbackService.currentTrack, false);

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                if (playbackStarted.isPlayingPreviousTrack) {
                    await this.switchDown(playbackStarted.currentTrack, true);
                } else {
                    await this.switchUp(playbackStarted.currentTrack);
                }
            })
        );
    }

    private async switchUp(track: TrackModel): Promise<void> {
        if (track == undefined) {
            return;
        }

        const newArtist: string = this.formatTrackArtistsPipe.transform(track.artists);
        const newTitle: string = this.formatTrackTitlePipe.transform(track.title, undefined);

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
        if (track == undefined) {
            return;
        }

        const newArtist: string = this.formatTrackArtistsPipe.transform(track.artists);
        const newTitle: string = this.formatTrackTitlePipe.transform(track.title, undefined);

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
