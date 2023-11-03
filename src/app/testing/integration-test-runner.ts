import { Injectable } from '@angular/core';
import { AZLyricsApi } from '../common/api/lyrics/a-z-lyrics-api';
import { Lyrics } from '../common/api/lyrics/lyrics';
import { ChartLyricsApi } from '../common/api/lyrics/chart-lyrics-api';
import { WebSearchLyricsApi } from '../common/api/lyrics/web-search-lyrics/web-search-lyrics-api';
import { WebSearchApi } from '../common/api/lyrics/web-search-lyrics/web-search-api';

@Injectable()
export class IntegrationTestRunner {
    public constructor(
        private azLyricsApi: AZLyricsApi,
        private chartLyricsApi: ChartLyricsApi,
        private duckDuckGoApi: WebSearchApi,
        private webSearchLyricsApi: WebSearchLyricsApi,
    ) {}

    public async executeTestsAsync(): Promise<void> {
        await this.getLyricsFromAZLyricsTestAsync();
        await this.getLyricsFromChartLyricsTestAsync();
        await this.getLyricsFromWebSearchLyricsTestAsync();
    }

    private async getLyricsFromChartLyricsTestAsync(): Promise<void> {
        const lyrics: Lyrics = await this.chartLyricsApi.getLyricsAsync('Massive Attack', 'Teardrop');
        this.assertIsTrue('getLyricsFromChartLyricsTestAsync', lyrics.text.startsWith('Love, love is a verb'));
    }

    private async getLyricsFromAZLyricsTestAsync(): Promise<void> {
        const lyrics: Lyrics = await this.azLyricsApi.getLyricsAsync('Massive Attack', 'Teardrop');
        this.assertIsTrue('getLyricsFromAZLyricsTestAsync', lyrics.text.startsWith('Love, love is a verb'));
    }

    private async getLyricsFromWebSearchLyricsTestAsync(): Promise<void> {
        const lyrics: Lyrics = await this.webSearchLyricsApi.getLyricsAsync('Massive Attack', 'Teardrop');
        this.assertIsTrue('getLyricsFromWebSearchLyricsTestAsync', lyrics.text.startsWith('Love, love is a verb'));
    }

    private assertIsTrue(testName: string, condition: boolean): void {
        if (!condition) {
            throw new Error(`${testName} FAILED`);
        }
    }
}
