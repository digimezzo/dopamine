import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../../common/scheduling/scheduler';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { BaseLyricsService } from '../../../services/lyrics/base-lyrics.service';
import { LyricsModel } from '../../../services/lyrics/lyrics-model';

@Component({
    selector: 'app-now-playing-lyrics',
    host: { style: 'display: block' },
    templateUrl: './now-playing-lyrics.component.html',
    styleUrls: ['./now-playing-lyrics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('contentAnimation', [
            state('fade-out', style({ opacity: 0 })),
            state('fade-in', style({ opacity: 1 })),
            transition('fade-in => fade-out', animate('150ms ease-out')),
            transition('fade-out => fade-in', animate('500ms ease-out')),
        ]),
    ],
})
export class NowPlayingLyricsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private _title: string = '';
    private _artists: string = '';
    private _lyrics: LyricsModel | undefined;

    public constructor(
        public appearanceService: BaseAppearanceService,
        private playbackService: BasePlaybackService,
        private lyricsService: BaseLyricsService,
        private scheduler: Scheduler,
    ) {}

    private previousTrackPath: string = '';
    private _contentAnimation: string = 'fade-in';

    public get contentAnimation(): string {
        return this._contentAnimation;
    }

    public get title(): string {
        return this._title;
    }

    public get artists(): string {
        return this._artists;
    }

    public get lyrics(): LyricsModel | undefined {
        return this._lyrics;
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }
    public async ngOnInit(): Promise<void> {
        this.initializeSubscriptions();
        await this.showTrackInfoAsync(this.playbackService.currentTrack);
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) =>
                PromiseUtils.noAwait(this.showTrackInfoAsync(playbackStarted.currentTrack)),
            ),
        );
    }

    private destroySubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private async showTrackInfoAsync(track: TrackModel | undefined): Promise<void> {
        if (this.previousTrackPath === track?.path ?? '') {
            return;
        }

        this._contentAnimation = 'fade-out';
        await this.scheduler.sleepAsync(150);

        this._title = track?.title ?? '';
        this._artists = track?.artists ?? '';
        this._lyrics = track != undefined ? await this.lyricsService.getLyricsAsync(track) : undefined;

        this.previousTrackPath = track?.path ?? '';

        this._contentAnimation = 'fade-in';
        await this.scheduler.sleepAsync(250);
    }
}
