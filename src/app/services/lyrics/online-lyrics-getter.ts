import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { ChartLyricsApi } from '../../common/api/lyrics/chart-lyrics.api';
import { LyricsModel } from './lyrics-model';
import { Lyrics } from '../../common/api/lyrics/lyrics';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { AZLyricsApi } from '../../common/api/lyrics/a-z-lyrics.api';

@Injectable()
export class OnlineLyricsGetter implements ILyricsGetter {
    public constructor(
        private chartLyricsApi: ChartLyricsApi,
        private azLyricsApi: AZLyricsApi,
        private logger: Logger,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        let lyrics: Lyrics = Lyrics.empty();

        if (StringUtils.isNullOrWhiteSpace(track.rawFirstArtist) || StringUtils.isNullOrWhiteSpace(track.rawTitle)) {
            return LyricsModel.empty(track);
        }

        try {
            lyrics = await this.azLyricsApi.getLyricsAsync(track.rawFirstArtist, track.rawTitle);
        } catch (e) {
            this.logger.error(e, 'Could not get lyrics from AZLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
        }

        if (StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            try {
                lyrics = await this.chartLyricsApi.getLyricsAsync(track.rawFirstArtist, track.rawTitle);
            } catch (e) {
                this.logger.error(e, 'Could not get lyrics from ChartLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
            }
        }

        if (StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            return LyricsModel.empty(track);
        }

        return new LyricsModel(track, lyrics.sourceName, LyricsSourceType.online, lyrics.text);
    }
}
