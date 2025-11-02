import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { TrackModel } from '../../../../services/track/track-model';
import { LyricsModel } from '../../../../services/lyrics/lyrics-model';
import { LyricsSourceType } from '../../../../common/api/lyrics/lyrics-source-type';
import { PlaybackInformation } from '../../../../services/playback-information/playback-information';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { LyricsServiceBase } from '../../../../services/lyrics/lyrics.service.base';
import { StringUtils } from '../../../../common/utils/string-utils';
import { PlaybackInformationService } from '../../../../services/playback-information/playback-information.service';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-now-playing-lyrics',
    host: { style: 'display: block; width: 100%; height: 100%;' },
    templateUrl: './now-playing-lyrics.component.html',
    styleUrls: ['./now-playing-lyrics.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingLyricsComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private _lyrics: LyricsModel | undefined;
    private previousTrackPath: string = '';
    private _isBusy: boolean = false;

    public constructor(
        private appearanceService: AppearanceServiceBase,
        private playbackInformationService: PlaybackInformationService,
        private lyricsService: LyricsServiceBase,
        public settings: SettingsBase,
    ) {}

    public lyricsSourceTypeEnum: typeof LyricsSourceType = LyricsSourceType;

    public largeFontSize: number = this.appearanceService.selectedFontSize * 1.7;
    public smallFontSize: number = this.appearanceService.selectedFontSize;

    public get isBusy(): boolean {
        return this._isBusy;
    }

    public get hasLyrics(): boolean {
        return this._lyrics != undefined && !StringUtils.isNullOrWhiteSpace(this._lyrics.text);
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
        await this.showLyricsAsync(currentPlaybackInformation.track);
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showLyricsAsync(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showLyricsAsync(playbackInformation.track));
            }),
        );

        this.subscription.add(
            this.playbackInformationService.playingNoTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                PromiseUtils.noAwait(this.showLyricsAsync(playbackInformation.track));
            }),
        );
    }

    private destroySubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private async showLyricsAsync(track: TrackModel | undefined): Promise<void> {
        if (track == undefined) {
            this._lyrics = undefined;
            return;
        }

        if (this.previousTrackPath === track.path && this._lyrics != undefined) {
            return;
        }

        this._isBusy = true;
        this._lyrics = await this.lyricsService.getLyricsAsync(track);
        this._isBusy = false;

        this.previousTrackPath = track.path;
    }
}
