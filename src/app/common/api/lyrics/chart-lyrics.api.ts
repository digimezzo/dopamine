/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ILyricsApi } from './i-lyrics.api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Lyrics } from './lyrics';

@Injectable()
export class ChartLyricsApi implements ILyricsApi {
    public constructor(private httpClient: HttpClient) {}

    public get sourceName(): string {
        return 'ChartLyrics';
    }

    public async getLyricsAsync(artist: string, title: string): Promise<Lyrics> {
        const url: string = `http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`;
        const response: string = await this.httpClient.get(url, { responseType: 'text' }).toPromise();
        const parser: XMLParser = new XMLParser();
        const jsonResponse: any = parser.parse(response);

        return new Lyrics(this.sourceName, jsonResponse.GetLyricResult.Lyric as string);
    }
}
