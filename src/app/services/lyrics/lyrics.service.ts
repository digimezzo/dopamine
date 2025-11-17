import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { StringUtils } from '../../common/utils/string-utils';
import { SettingsBase } from '../../common/settings/settings.base';
import { LyricsModel } from './lyrics-model';
import { Logger } from '../../common/logger';
import { LyricsServiceBase } from './lyrics.service.base';
import { SrtLyricsGetter } from './srt-lyrics-getter';

@Injectable()
export class LyricsService implements LyricsServiceBase {
    public constructor(
        private embeddedLyricsGetter: EmbeddedLyricsGetter,
        private lrcLyricsGetter: LrcLyricsGetter,
        private onlineLyricsGetter: OnlineLyricsGetter,
        private srtLyricsGetter: SrtLyricsGetter,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public get showRichLyrics(): boolean {
        return this.settings.showRichLyrics;
    }

    public set showRichLyrics(v: boolean) {
        this.settings.showRichLyrics = v;
    }

    public get richLyricsLineCount(): number {
        return this.settings.richLyricsLineCount;
    }

    public set richLyricsLineCount(v: number) {
        this.settings.richLyricsLineCount = v;
    }

    public get richLyricsFontSize(): number {
        return this.settings.richLyricsFontSize;
    }

    public set richLyricsFontSize(v: number) {
        this.settings.richLyricsFontSize = v;
    }

    private cachedLyrics: LyricsModel | undefined;

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        let lyrics: LyricsModel = LyricsModel.empty(track);

        if (this.showRichLyrics) {
            try {
                lyrics = await this.srtLyricsGetter.getLyricsAsync(track);
            } catch (e) {
                this.logger.error(e, 'Could not get SRT lyrics', 'LyricsService', 'getLyricsAsync');
            }

            if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
                return lyrics;
            }

            try {
                lyrics = await this.lrcLyricsGetter.getLyricsAsync(track);
            } catch (e) {
                this.logger.error(e, 'Could not get LRC lyrics', 'LyricsService', 'getLyricsAsync');
            }

            if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
                return lyrics;
            }

            try {
                lyrics = await this.embeddedLyricsGetter.getLyricsAsync(track);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get embedded lyrics', 'LyricsService', 'getLyricsAsync');
            }

            if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
                return lyrics;
            }
        } else {
            try {
                lyrics = await this.embeddedLyricsGetter.getLyricsAsync(track);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get embedded lyrics', 'LyricsService', 'getLyricsAsync');
            }

            if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
                return lyrics;
            }

            try {
                lyrics = await this.lrcLyricsGetter.getLyricsAsync(track);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get LRC lyrics', 'LyricsService', 'getLyricsAsync');
            }

            if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
                return lyrics;
            }
        }

        if (this.cachedLyrics?.track != undefined && track != undefined && this.cachedLyrics.track.path === track.path) {
            return this.cachedLyrics;
        }

        if (this.settings.downloadLyricsOnline) {
            try {
                lyrics = await this.onlineLyricsGetter.getLyricsAsync(track);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get online lyrics', 'LyricsService', 'getLyricsAsync');
            }
        }

        this.cachedLyrics = lyrics;

        return lyrics;
    }
}
