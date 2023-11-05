/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { WebSearchResult } from './web-search-result';
import { Strings } from '../../../strings';

@Injectable()
export class WebSearchApi {
    private vqdRegex: RegExp = /vqd=([\d-]+)/;
    private searchRegex: RegExp = /DDG\.pageLayout\.load\('d',(\[.+\])\);DDG\.duckbar\.load\('images'/;

    public constructor(private httpClient: HttpClient) {}

    public async webSearchAsync(query: string): Promise<WebSearchResult[]> {
        const vqd: string = await this.getVqdAsync(query);

        if (Strings.isNullOrWhiteSpace(vqd)) {
            throw new Error(`Failed to get the VQD for query "${query}".`);
        }

        const requestUrl: string = `https://links.duckduckgo.com/d.js?${this.getSearchRequestParams(query, vqd).toString()}`;
        const responseString: string = await this.performGetRequestAsync(requestUrl);

        if (Strings.isNullOrWhiteSpace(responseString)) {
            return [];
        }

        const matches: RegExpExecArray | null = this.searchRegex.exec(responseString);

        if (matches == undefined || matches.length < 2) {
            return [];
        }

        const rawSearchResults: string = matches[1].replace(/\\t/g, ' ');

        if (Strings.isNullOrWhiteSpace(rawSearchResults)) {
            return [];
        }

        const parsedRawSearchResults: { c: string; i: string }[] = JSON.parse(rawSearchResults) as {
            c: string;
            i: string;
        }[];

        return parsedRawSearchResults.map((x: { c: string; i: string }) => new WebSearchResult(x.c, x.i));
    }

    private async getVqdAsync(query: string): Promise<string> {
        const vqdRequestUrl: URL = new URL(`https://duckduckgo.com/?${this.getVqdRequestParams(query).toString()}`);

        const html: string = await this.performGetRequestAsync(vqdRequestUrl.toString());
        const matches: RegExpExecArray | null = this.vqdRegex.exec(html);

        if (matches == undefined || matches.length < 2) {
            return '';
        }

        return matches[1];
    }

    private async performGetRequestAsync(url: string): Promise<string> {
        return await this.httpClient.get(url, { responseType: 'text' }).toPromise();
    }

    private getVqdRequestParams(query: string): URLSearchParams {
        return new URLSearchParams({
            q: query,
            ia: 'web',
        });
    }

    private getSearchRequestParams(query: string, vqd: string): URLSearchParams {
        return new URLSearchParams({
            q: query,
            vqd,
            kl: 'wt-wt',
            l: 'en-us',
            dl: 'en',
            ct: 'US',
            sp: '1',
            df: 'a',
            ss_mkt: 'us',
            s: '0',
            bpa: '1',
            biaexp: 'b',
            msvrtexp: 'b',
            nadse: 'b',
            eclsexp: 'b',
            tjsexp: 'b',
        });
    }
}
