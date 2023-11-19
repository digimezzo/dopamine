import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { TrackModel } from '../../../../services/track/track-model';
import { LyricsModel } from '../../../../services/lyrics/lyrics-model';
import { LyricsSourceType } from '../../../../common/api/lyrics/lyrics-source-type';
import { PlaybackInformation } from '../../../../services/playback-information/playback-information';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { PlaybackInformationServiceBase } from '../../../../services/playback-information/playback-information.service.base';
import { LyricsServiceBase } from '../../../../services/lyrics/lyrics.service.base';

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
    private _lyrics: LyricsModel | undefined;
    private previousTrackPath: string = '';
    private _contentAnimation: string = 'fade-out';

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private playbackInformationService: PlaybackInformationServiceBase,
        private lyricsService: LyricsServiceBase,
        private scheduler: Scheduler,
    ) {}

    public lyricsSourceTypeEnum: typeof LyricsSourceType = LyricsSourceType;

    public get contentAnimation(): string {
        return this._contentAnimation;
    }

    public get lyrics(): LyricsModel | undefined {
        return this._lyrics;
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }
    public async ngOnInit(): Promise<void> {
        this.initializeSubscriptions();
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.showTrackInfoAsync(currentPlaybackInformation.track);
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showTrackInfoAsync(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showTrackInfoAsync(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showTrackInfoAsync(playbackInformation.track));
            }),
        );
    }

    private destroySubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private async showTrackInfoAsync(track: TrackModel | undefined): Promise<void> {
        if (track == undefined) {
            if (this._contentAnimation !== 'fade-out') {
                this._contentAnimation = 'fade-out';
                await this.scheduler.sleepAsync(150);
            }
            this._lyrics = undefined;
            return;
        }

        if (this.previousTrackPath === track.path && this._lyrics != undefined) {
            return;
        }

        if (this._contentAnimation !== 'fade-out') {
            this._contentAnimation = 'fade-out';
            await this.scheduler.sleepAsync(150);
        }

        this._lyrics = await this.lyricsService.getLyricsAsync(track);

        this.previousTrackPath = track.path;

        this._contentAnimation = 'fade-in';
        await this.scheduler.sleepAsync(250);
    }
}
