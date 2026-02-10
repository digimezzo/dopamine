import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { PlaybackService } from '../../../../services/playback/playback.service';
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
    private currentLyric: number = 0;
    private linesOutsideMain: number = 2;
    private lyricChanger: NodeJS.Timeout;
    public cText: string = '';
    public nText: string = '';
    public pText: string = '';
    public mainRichLyricSize = 2;
    public sideRichLyricSize = 2;

    public constructor(
        private appearanceService: AppearanceServiceBase,
        private playbackService: PlaybackService,
        private playbackInformationService: PlaybackInformationService,
        private lyricsService: LyricsServiceBase,
        private cd: ChangeDetectorRef,
        public settings: SettingsBase,
    ) {}

    public lyricsSourceTypeEnum: typeof LyricsSourceType = LyricsSourceType;

    public largeFontSize: number = this.appearanceService.selectedFontSize * 1.7;
    public smallFontSize: number = this.appearanceService.selectedFontSize;

    public widthPercent: number = 0;

    public get isBusy(): boolean {
        return this._isBusy;
    }

    public get hasLyrics(): boolean {
        return this._lyrics != undefined && !StringUtils.isNullOrWhiteSpace(this._lyrics.text);
    }

    public get hasRichLyrics(): boolean {
        return this._lyrics != null && this._lyrics.lyricList != undefined && this._lyrics.lyricList.length > 0 && this._lyrics.timeStamps != undefined && this._lyrics.timeStamps.length == this._lyrics.lyricList.length;
    }

    public get hasTimeEnds(): boolean {
        return this._lyrics != null && this._lyrics.timeStampEnds != undefined;
    }

    public get showRichLyrics(): boolean {
        return this.lyricsService.showRichLyrics;
    }

    public get mainRichLyricFontSize(): number {
        return this.mainRichLyricSize;
    }

    public get sideRichLyricFontSize(): number {
        return this.sideRichLyricSize;
    }

    public get lyrics(): LyricsModel | undefined {
        return this._lyrics;
    }

    public get percentage(): string {
        return String(this.widthPercent);
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public async ngOnInit(): Promise<void> {
        this.setRichLyricsLineCount();
        this.setRichLyricSize();
        this.initializeSubscriptions();
        const currentPlaybackInformation: PlaybackInformation = await this.playbackInformationService.getCurrentPlaybackInformationAsync();
        await this.showLyricsAsync(currentPlaybackInformation.track);
        if (this.showRichLyrics) {
            setInterval(() => {
                if (this.hasRichLyrics) {
                    this.cText = this.currentRichLyric();
                    this.nText = this.nextLyrics();
                    this.pText = this.previousLyrics();
                    this.calculateFontSize();
                }
                this.cd.detectChanges();
            }, 250);
            setInterval(() => {
                if (this.hasTimeEnds) {
                    this.calculatePercentage();
                }
            }, 10);
        }
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
        this.subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.currentLyric = 0;
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

        this.currentLyric = 0;
        this.widthPercent = 0;
    }

    private previousLyrics(): string {
        if (this._lyrics == undefined || this._lyrics.lyricList == undefined) {
            return '\n';
        }

        let back = this.linesOutsideMain;
        while (this.currentLyric - back < 0) {
            back--;
        }

        if (back < 1) {
            return '\n';
        }

        let prevLyrics = '';

        for (let i = 1; i <= back; i++) {
            prevLyrics += this._lyrics.lyricList[this.currentLyric - i] + "\n";
        }

        return prevLyrics;
    }

     private nextLyrics(): string {
        if (this._lyrics == undefined || this._lyrics.lyricList == undefined) {
            return '\n';
        }

        let forward = this.linesOutsideMain;
        while (this.currentLyric + forward >= this._lyrics.lyricList.length) {
            forward--;
        }

        if (forward < 1) {
            return '\n';
        }

        let nextLyrics = '';

        for (let i = 1; i <= forward; i++) {
            nextLyrics += this._lyrics.lyricList[this.currentLyric + i] + "\n";
        }

        return nextLyrics;
    }

     private currentRichLyric(): string {
        const lyrics = this._lyrics;

        if (lyrics == null || lyrics.lyricList == undefined || lyrics.timeStamps == undefined) {
            return '';
        } else if (this.currentLyric + 1 >= lyrics.lyricList.length) {
            return lyrics.lyricList[this.currentLyric];
        }

        const currentTime = this.playbackService.getCurrentProgress().progressSeconds;
        let nextTime = lyrics.timeStamps[this.currentLyric + 1];

        while (currentTime >= nextTime) {
            this.currentLyric += 1;
            this.setRichLyricSize();
            if (this.currentLyric + 1 < lyrics.lyricList.length) {
                nextTime = lyrics.timeStamps[this.currentLyric + 1];
            } else {
                break;
            }
        }

        return lyrics.lyricList[this.currentLyric];
    }

    private calculatePercentage() {
        const lyrics = this._lyrics;

        if (lyrics == null || lyrics.lyricList == undefined || lyrics.timeStamps == undefined) {
            return;
        }

        if (lyrics.timeStampEnds != null) {
            const currentTime = this.playbackService.getCurrentProgress().progressSeconds;
            const gap = lyrics.timeStampEnds[this.currentLyric] - lyrics.timeStamps[this.currentLyric];
            const current = currentTime - lyrics.timeStamps[this.currentLyric];
            let percent = (current / gap) * 100;
            percent = percent;
            percent = percent < 100 ? percent : 100;

            this.widthPercent = percent;
        }
    }

    private setRichLyricsLineCount() {
        this.linesOutsideMain = this.lyricsService.richLyricsLineCount;
    }

    private setRichLyricSize() {
        this.mainRichLyricSize = this.lyricsService.richLyricsFontSize;
        this.sideRichLyricSize = this.lyricsService.richLyricsFontSize;
    }

    private calculateFontSize() {
        const lyrics = this._lyrics;

        if (lyrics == null || lyrics.lyricList == undefined) {
            return;
        }

        let main = document.getElementsByClassName("rich-main")[0] as (HTMLElement);
        let parent = document.getElementsByClassName("rich-contain")[0];

        if (main != undefined && parent != undefined) {
            while (main.offsetWidth < main.scrollWidth) {
                this.mainRichLyricSize -= 0.05;
                this.cd.detectChanges();
            }
        }
    }
}
