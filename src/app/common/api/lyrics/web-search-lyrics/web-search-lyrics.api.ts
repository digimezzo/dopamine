/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Injectable } from '@angular/core';
import { Lyrics } from '../lyrics';
import { ILyricsApi } from '../i-lyrics.api';
import { WebSearchResult } from './web-search-result';
import { WebSearchApi } from './web-search.api';
import { IWebSearchLyricsSource } from './sources/i-web-search-lyrics-source';
import { AZLyricsSource } from './sources/a-z-lyrics-source';
import { Strings } from '../../../strings';
import { HttpClient } from '@angular/common/http';
import { GeniusSource } from './sources/genius-source';
import { MusixmatchSource } from './sources/musixmatch-source';
import { LyricsSource } from './sources/lyrics-source';
import { Logger } from '../../../logger';

@Injectable()
export class WebSearchLyricsApi implements ILyricsApi {
    private cleanupRegexp: RegExp = /\s(-.+|\[.+\]|\(.+\))/g;
    private sources: Map<string, IWebSearchLyricsSource> = new Map();

    public constructor(
        private webSearchApi: WebSearchApi,
        private httpClient: HttpClient,
        private logger: Logger,
    ) {
        this.sources.set('azlyrics', new AZLyricsSource());
        this.sources.set('genius', new GeniusSource());
        this.sources.set('musixmatch', new MusixmatchSource());
        this.sources.set('lyrics', new LyricsSource());
    }

    public get sourceName(): string {
        return 'WebSearchLyrics';
    }

    public async getLyricsAsync(artist: string, title: string): Promise<Lyrics> {
        const artistAndTitle: string = `${artist} ${title}`;
        const cleanArtistAndTitle: string = artistAndTitle.replace(this.cleanupRegexp, '').trim().toLowerCase();
        const query: string = `${cleanArtistAndTitle} inurl:lyrics`;
        const webSearchResults: WebSearchResult[] = await this.webSearchApi.webSearchAsync(query);

        const possibleSites: WebSearchResult[] =
            webSearchResults.filter((x: WebSearchResult) => [...this.sources.keys()].includes(x.name)) || [];

        for (const possibleSite of possibleSites) {
            if (!Strings.isNullOrWhiteSpace(possibleSite.name)) {
                try {
                    const source: IWebSearchLyricsSource = this.sources.get(possibleSite.name)!;
                    const htmlString: string = await this.httpClient.get(possibleSite.fullUrl, { responseType: 'text' }).toPromise();
                    const lyricsText: string = source.parse(htmlString);

                    if (Strings.isNullOrWhiteSpace(lyricsText)) {
                        continue;
                    }

                    return new Lyrics(source.name, lyricsText);
                } catch (e: unknown) {
                    this.logger.error(e, `Could not get lyrics from ${possibleSite.name}`, 'WebSearchLyricsApi', 'getLyricsAsync');
                }
            }
        }

        return Lyrics.default();
    }
}
