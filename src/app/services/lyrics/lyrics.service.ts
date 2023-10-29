import { Injectable } from '@angular/core';
import { BaseLyricsService } from './base-lyrics.service';
import { TrackModel } from '../track/track-model';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { Strings } from '../../common/strings';
import { BaseSettings } from '../../common/settings/base-settings';
import { LyricsModel } from './lyrics-model';

@Injectable()
export class LyricsService implements BaseLyricsService {
    public constructor(
        private embeddedLyricsGetter: EmbeddedLyricsGetter,
        private lrcLyricsGetter: LrcLyricsGetter,
        private onlineLyricsGetter: OnlineLyricsGetter,
        private settings: BaseSettings,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        let lyrics: LyricsModel = await this.embeddedLyricsGetter.getLyricsAsync(track);

        if (!Strings.isNullOrWhiteSpace(lyrics.text)) {
            return lyrics;
        }

        lyrics = await this.lrcLyricsGetter.getLyricsAsync(track);

        if (!Strings.isNullOrWhiteSpace(lyrics.text)) {
            return lyrics;
        }

        if (this.settings.downloadLyricsOnline) {
            lyrics = await this.onlineLyricsGetter.getLyricsAsync(track);
        }

        if (!Strings.isNullOrWhiteSpace(lyrics.text)) {
            return lyrics;
        }

        return LyricsModel.default();
    }
}
