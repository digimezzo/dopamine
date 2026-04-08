import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { StringUtils } from '../../common/utils/string-utils';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class LrcLyricsGetter implements ILyricsGetter {
    public constructor(private fileAccess: FileAccessBase) {}

    private static readonly timestampRegex: RegExp = /\[(\d{1,3}):(\d{2})[.:](\d{2,3})\]/g;

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const lrcFilePath: string = this.getLrcFilePath(track);

        if (StringUtils.isNullOrWhiteSpace(lrcFilePath)) {
            return LyricsModel.empty(track);
        }

        const lines: string[] = await this.fileAccess.readLinesAsync(lrcFilePath);
        let lyricsText: string = '';
        const lyricLines: string[] = [];
        const timeStamps: number[] = [];

        for (const line of lines) {
            const timestamps: number[] = this.parseTimestamps(line);

            if (timestamps.length === 0) {
                continue;
            }

            const textContent: string = line.replace(LrcLyricsGetter.timestampRegex, '');

            for (const ts of timestamps) {
                lyricLines.push(textContent);
                timeStamps.push(ts);
            }

            if (!StringUtils.isNullOrWhiteSpace(textContent)) {
                if (lyricsText.length > 0) {
                    lyricsText += '\n';
                }

                lyricsText += textContent;
            }
        }

        if (StringUtils.isNullOrWhiteSpace(lyricsText)) {
            return LyricsModel.empty(track);
        }

        return LyricsModel.timed(track, '', LyricsSourceType.lrc, lyricsText, lyricLines, timeStamps);
    }

    private parseTimestamps(line: string): number[] {
        const timestamps: number[] = [];
        let match: RegExpExecArray | null;

        LrcLyricsGetter.timestampRegex.lastIndex = 0;

        while ((match = LrcLyricsGetter.timestampRegex.exec(line)) !== null) {
            const minutes: number = parseInt(match[1], 10);
            const seconds: number = parseInt(match[2], 10);
            const fraction: string = match[3];
            const fractionalSeconds: number = parseInt(fraction, 10) / Math.pow(10, fraction.length);

            timestamps.push(minutes * 60 + seconds + fractionalSeconds);
        }

        return timestamps;
    }

    private getLrcFilePath(track: TrackModel): string {
        const trackPathWithoutExtension: string = this.fileAccess.getPathWithoutExtension(track.path);
        let possibleLrcFilePath: string = `${trackPathWithoutExtension}.lrc`;

        if (this.fileAccess.pathExists(possibleLrcFilePath)) {
            return possibleLrcFilePath;
        }

        possibleLrcFilePath = `${trackPathWithoutExtension}.Lrc`;

        if (this.fileAccess.pathExists(possibleLrcFilePath)) {
            return possibleLrcFilePath;
        }

        possibleLrcFilePath = `${trackPathWithoutExtension}.LRC`;

        if (this.fileAccess.pathExists(possibleLrcFilePath)) {
            return possibleLrcFilePath;
        }

        return '';
    }
}
