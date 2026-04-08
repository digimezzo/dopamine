import { LyricsModel } from '../../../../../services/lyrics/lyrics-model';

export class RichLyricsCalculator {
    private currentLyricIndex: number = 0;
    private widthPercent: number = 0;

    public get currentIndex(): number {
        return this.currentLyricIndex;
    }

    public get percentage(): number {
        return this.widthPercent;
    }

    public reset(): void {
        this.currentLyricIndex = 0;
        this.widthPercent = 0;
    }

    public updateCurrentLyric(lyrics: LyricsModel, currentTimeSeconds: number): void {
        if (lyrics.textLines == undefined || lyrics.startTimeStamps == undefined) {
            return;
        }

        if (this.currentLyricIndex + 1 >= lyrics.textLines.length) {
            return;
        }

        let nextTime = lyrics.startTimeStamps[this.currentLyricIndex + 1];

        while (currentTimeSeconds >= nextTime) {
            this.currentLyricIndex += 1;

            if (this.currentLyricIndex + 1 < lyrics.textLines.length) {
                nextTime = lyrics.startTimeStamps[this.currentLyricIndex + 1];
            } else {
                break;
            }
        }
    }

    public calculatePercentage(lyrics: LyricsModel, currentTimeSeconds: number): void {
        if (lyrics.startTimeStamps == undefined || lyrics.endTimeStamps == undefined) {
            return;
        }

        if (lyrics.endTimeStamps.length === 0) {
            this.widthPercent = 0;
            return;
        }

        const start = lyrics.startTimeStamps[this.currentLyricIndex];
        const end = lyrics.endTimeStamps[this.currentLyricIndex];
        const gap = end - start;

        if (gap <= 0) {
            this.widthPercent = 0;
            return;
        }

        const elapsed = currentTimeSeconds - start;
        const percent = (elapsed / gap) * 100;
        this.widthPercent = Math.min(Math.max(percent, 0), 100);
    }

    public getCurrentText(lyrics: LyricsModel): string {
        if (lyrics.textLines == undefined || lyrics.textLines.length === 0) {
            return '';
        }

        return lyrics.textLines[this.currentLyricIndex] ?? '';
    }

    public getPreviousLines(lyrics: LyricsModel, count: number): string {
        if (lyrics.textLines == undefined) {
            return '';
        }

        let back = Math.min(count, this.currentLyricIndex);

        if (back < 1) {
            return '';
        }

        let result = '';

        for (let i = back; i >= 1; i--) {
            result += lyrics.textLines[this.currentLyricIndex - i] + '\n';
        }

        return result;
    }

    public getNextLines(lyrics: LyricsModel, count: number): string {
        if (lyrics.textLines == undefined) {
            return '';
        }

        const remaining = lyrics.textLines.length - 1 - this.currentLyricIndex;
        let forward = Math.min(count, remaining);

        if (forward < 1) {
            return '';
        }

        let result = '';

        for (let i = 1; i <= forward; i++) {
            result += lyrics.textLines[this.currentLyricIndex + i] + '\n';
        }

        return result;
    }
}
