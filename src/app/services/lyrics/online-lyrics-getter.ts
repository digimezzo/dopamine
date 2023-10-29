import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { ChartLyricsApi } from '../../common/api/lyrics/chart-lyrics-api';
import { LyricsModel } from './lyrics-model';
import { Lyrics } from '../../common/api/lyrics/lyrics';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';

@Injectable()
export class OnlineLyricsGetter implements ILyricsGetter {
    public constructor(private chartLyricsApi: ChartLyricsApi) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const lyrics: Lyrics = await this.chartLyricsApi.getLyricsAsync(track.rawFirstArtist, track.title);

        return new LyricsModel(lyrics.sourceName, LyricsSourceType.online, lyrics.text);
    }
}
