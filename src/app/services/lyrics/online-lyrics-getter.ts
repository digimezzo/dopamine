import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { ChartLyricsApi } from '../../common/api/lyrics/chart-lyrics-api';
import { LyricsModel } from './lyrics-model';
import { Lyrics } from '../../common/api/lyrics/lyrics';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { AZLyricsApi } from '../../common/api/lyrics/a-z-lyrics';
import { Logger } from '../../common/logger';
import { Strings } from '../../common/strings';

@Injectable()
export class OnlineLyricsGetter implements ILyricsGetter {
    public constructor(
        private chartLyricsApi: ChartLyricsApi,
        private azLyricsApi: AZLyricsApi,
        private logger: Logger,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        let lyrics: Lyrics = Lyrics.default();

        try {
            lyrics = await this.chartLyricsApi.getLyricsAsync(track.rawFirstArtist, track.title);
        } catch (e) {
            this.logger.error(e, 'Could not get lyrics from ChartLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
        }

        if (Strings.isNullOrWhiteSpace(lyrics.text)) {
            try {
                lyrics = await this.azLyricsApi.getLyricsAsync(track.rawFirstArtist, track.title);
            } catch (e) {
                this.logger.error(e, 'Could not get lyrics from AZLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
            }
        }

        return new LyricsModel(lyrics.sourceName, LyricsSourceType.online, lyrics.text);
    }
}
