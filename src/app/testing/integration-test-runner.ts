import { Injectable } from '@angular/core';
import { AZLyricsApi } from '../common/api/lyrics/a-z-lyrics.api';
import { Lyrics } from '../common/api/lyrics/lyrics';
import { ChartLyricsApi } from '../common/api/lyrics/chart-lyrics.api';

@Injectable()
export class IntegrationTestRunner {
    public constructor(
        private azLyricsApi: AZLyricsApi,
        private chartLyricsApi: ChartLyricsApi,
    ) {}

    public async executeTestsAsync(): Promise<void> {
        await this.getLyricsFromAZLyricsTestAsync();
        await this.getLyricsFromChartLyricsTestAsync();
    }

    private async getLyricsFromAZLyricsTestAsync(): Promise<void> {
        const lyrics: Lyrics = await this.azLyricsApi.getLyricsAsync('Massive Attack', 'Teardrop');
        this.assertIsTrue('getLyricsFromAZLyricsTestAsync', lyrics.text.startsWith('Love, love is a verb'));
    }

    private async getLyricsFromChartLyricsTestAsync(): Promise<void> {
        const lyrics: Lyrics = await this.chartLyricsApi.getLyricsAsync('Massive Attack', 'Teardrop');
        this.assertIsTrue('getLyricsFromChartLyricsTestAsync', lyrics.text.startsWith('Love, love is a verb'));
    }

    private assertIsTrue(testName: string, condition: boolean): void {
        if (!condition) {
            throw new Error(`${testName} FAILED`);
        }
    }
}
