import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../core/scheduler/scheduler';
import { FormatTrackArtistsPipe } from '../../pipes/format-track-artists.pipe';
import { FormatTrackTitlePipe } from '../../pipes/format-track-title.pipe';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

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
                    transform: 'translateY(-70px)',
                })
            ),
            state(
                'animated-up',
                style({
                    transform: 'translateY(-70px)',
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
        public playbackService: BasePlaybackService,
        private translatorService: BaseTranslatorService,
        private scheduler: Scheduler
    ) {}

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
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                const formatTrackArtistsPipe: FormatTrackArtistsPipe = new FormatTrackArtistsPipe(this.translatorService);
                const formatTrackTitlePipe: FormatTrackTitlePipe = new FormatTrackTitlePipe(this.translatorService);

                const newArtist: string = formatTrackArtistsPipe.transform(playbackStarted.currentTrack.artists);
                const newTitle: string = formatTrackTitlePipe.transform(playbackStarted.currentTrack.title, undefined);

                if (playbackStarted.isPlayingPreviousTrack) {
                    if (this.contentAnimation !== 'up') {
                        this.contentAnimation = 'up';
                        this.bottomContentArtist = this.currentArtist;
                        this.bottomContentTitle = this.currentTitle;
                        await this.scheduler.sleepAsync(100);
                    }

                    this.topContentArtist = newArtist;
                    this.topContentTitle = newTitle;
                    this.contentAnimation = 'animated-down';
                } else {
                    if (this.contentAnimation !== 'down') {
                        this.contentAnimation = 'down';
                        this.topContentArtist = this.currentArtist;
                        this.topContentTitle = this.currentTitle;
                        await this.scheduler.sleepAsync(100);
                    }

                    this.bottomContentArtist = newArtist;
                    this.bottomContentTitle = newTitle;
                    this.contentAnimation = 'animated-up';
                }

                this.currentArtist = newArtist;
                this.currentTitle = newTitle;
                await this.scheduler.sleepAsync(350);
            })
        );
    }
}
