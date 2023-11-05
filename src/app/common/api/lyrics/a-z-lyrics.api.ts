/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ILyricsApi } from './i-lyrics.api';
import { Injectable } from '@angular/core';
import { Lyrics } from './lyrics';
import { HttpClient } from '@angular/common/http';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

@Injectable()
export class AZLyricsApi implements ILyricsApi {
    public constructor(private httpClient: HttpClient) {}

    public get sourceName(): string {
        return 'AZLyrics';
    }

    public async getLyricsAsync(artist: string, title: string): Promise<Lyrics> {
        const url: string = this.buildUrl(artist, title);
        const response: string = await this.httpClient.get(url, { responseType: 'text' }).toPromise();

        const cheerioAPI: CheerioAPI = cheerio.load(response);

        // @ts-ignore
        const lyricsDiv = cheerioAPI('.col-xs-12.col-lg-8.text-center')[0].children[14].children;

        let lyrics: string = '';

        for (let i: number = 2; i < lyricsDiv.length; i++) {
            // @ts-ignore
            const line: string = lyricsDiv[i].data != undefined ? `${lyricsDiv[i].data.substr(1)}\n` : ``;

            lyrics += line;
        }

        lyrics = lyrics.slice(0, -2);

        return new Lyrics(this.sourceName, lyrics);
    }

    private buildUrl(artist: string, title: string): string {
        return `https://azlyrics.com/lyrics/${this.sanitizeForLink(artist)}/${this.sanitizeForLink(title)}.html`;
    }

    private sanitizeForLink(data: string): string {
        data = data.replace(/\W/g, '');
        data = data.toLowerCase();

        return data;
    }
}
