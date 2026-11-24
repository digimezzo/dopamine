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
    private readonly pendingDownloads = new Map<string, Promise<Lyrics>>();

    public constructor(
        private chartLyricsApi: ChartLyricsApi,
        private azLyricsApi: AZLyricsApi,
        private logger: Logger,
    ) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const artist = track.rawFirstArtist;
        const title = track.rawTitle;

        if (StringUtils.isNullOrWhiteSpace(artist) || StringUtils.isNullOrWhiteSpace(title)) {
            return LyricsModel.empty(track);
        }

        const key = JSON.stringify([artist, title]);
        let pendingDownload = this.pendingDownloads.get(key);

        if (pendingDownload === undefined) {
            pendingDownload = this.downloadLyricsAsync(artist, title).finally(() => this.pendingDownloads.delete(key));
            this.pendingDownloads.set(key, pendingDownload);
        }

        const lyrics = await pendingDownload;

        if (StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            return LyricsModel.empty(track);
        }

        return LyricsModel.plain(track, lyrics.sourceName, LyricsSourceType.online, lyrics.text);
    }

    private async downloadLyricsAsync(artist: string, title: string): Promise<Lyrics> {
        let lyrics = Lyrics.empty();

        try {
            lyrics = await this.azLyricsApi.getLyricsAsync(artist, title);
        } catch (e) {
            this.logger.error(e, 'Could not get lyrics from AZLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
        }

        if (StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            try {
                lyrics = await this.chartLyricsApi.getLyricsAsync(artist, title);
            } catch (e) {
                this.logger.error(e, 'Could not get lyrics from ChartLyrics', 'OnlineLyricsGetter', 'getLyricsAsync');
            }
        }

        return lyrics;
    }
}
