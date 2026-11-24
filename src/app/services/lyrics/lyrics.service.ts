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
import { LyricsCache } from './lyrics-cache';
import { ILyricsGetter } from './i-lyrics-getter';

@Injectable()
export class LyricsService implements LyricsServiceBase {
    public constructor(
        private embeddedLyricsGetter: EmbeddedLyricsGetter,
        private lrcLyricsGetter: LrcLyricsGetter,
        private srtLyricsGetter: SrtLyricsGetter,
        private onlineLyricsGetter: OnlineLyricsGetter,
        private settings: SettingsBase,
        private logger: Logger,
        private lyricsCache: LyricsCache,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        if (this.settings.showRichLyrics) {
            const srtLyrics = await this.tryGetLyricsAsync(track, this.srtLyricsGetter, 'SRT');

            if (!StringUtils.isNullOrWhiteSpace(srtLyrics.plainText)) {
                return srtLyrics;
            }

            const lrcLyrics = await this.tryGetLyricsAsync(track, this.lrcLyricsGetter, 'LRC');

            if (!StringUtils.isNullOrWhiteSpace(lrcLyrics.plainText)) {
                return lrcLyrics;
            }
        }

        const embeddedLyrics = await this.tryGetLyricsAsync(track, this.embeddedLyricsGetter, 'embedded');

        if (!StringUtils.isNullOrWhiteSpace(embeddedLyrics.plainText)) {
            return embeddedLyrics;
        }

        const cachedLyrics = await this.lyricsCache.getLyricsAsync(track);

        if (!StringUtils.isNullOrWhiteSpace(cachedLyrics.plainText)) {
            return cachedLyrics;
        }

        if (this.settings.downloadLyricsOnline) {
            const onlineLyrics = await this.tryGetLyricsAsync(track, this.onlineLyricsGetter, 'online');
            await this.lyricsCache.saveLyricsAsync(track, onlineLyrics);

            return onlineLyrics;
        }

        return LyricsModel.empty(track);
    }

    private async tryGetLyricsAsync(track: TrackModel, getter: ILyricsGetter, source: string): Promise<LyricsModel> {
        try {
            return (await getter.getLyricsAsync(track)) ?? LyricsModel.empty(track);
        } catch (e: unknown) {
            this.logger.error(e, `Could not get ${source} lyrics`, 'LyricsService', 'getLyricsAsync');

            return LyricsModel.empty(track);
        }
    }
}
