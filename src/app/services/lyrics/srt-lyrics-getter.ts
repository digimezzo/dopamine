import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { StringUtils } from '../../common/utils/string-utils';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class SrtLyricsGetter implements ILyricsGetter {
    private static readonly timestampRegex: RegExp = /(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;
    private static readonly timecodeLineRegex: RegExp = /(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/;

    public constructor(private fileAccess: FileAccessBase) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const srtFilePath: string = this.getSrtFilePath(track);

        if (StringUtils.isNullOrWhiteSpace(srtFilePath)) {
            return LyricsModel.empty(track);
        }

        const lines: string[] = await this.fileAccess.readLinesAsync(srtFilePath);
        const lyricLines: string[] = [];
        const startTimestamps: number[] = [];
        const endTimestamps: number[] = [];
        const textParts: string[] = [];

        let i = 0;

        while (i < lines.length) {
            // Skip blank lines between blocks
            while (i < lines.length && StringUtils.isNullOrWhiteSpace(lines[i])) {
                i++;
            }

            if (i >= lines.length) {
                break;
            }

            // Skip sequence number line (must be a number)
            if (/^\d+$/.test(lines[i].trim())) {
                i++;
            }

            if (i >= lines.length) {
                break;
            }

            // Parse timecode line
            const timecodeMatch = SrtLyricsGetter.timecodeLineRegex.exec(lines[i]);

            if (timecodeMatch == null) {
                i++;
                continue;
            }

            const startTime = this.parseTimestamp(timecodeMatch[1]);
            const endTime = this.parseTimestamp(timecodeMatch[2]);

            if (startTime < 0 || endTime < 0) {
                i++;
                continue;
            }

            i++;

            // Collect all text lines until next blank line or end
            const blockTextLines: string[] = [];

            while (i < lines.length && !StringUtils.isNullOrWhiteSpace(lines[i])) {
                blockTextLines.push(lines[i]);
                i++;
            }

            const blockText = blockTextLines.join(' ');

            if (!StringUtils.isNullOrWhiteSpace(blockText)) {
                lyricLines.push(blockText);
                startTimestamps.push(startTime);
                endTimestamps.push(endTime);
                textParts.push(blockText);
            }
        }

        const lyricsText = textParts.join('\n');

        if (StringUtils.isNullOrWhiteSpace(lyricsText)) {
            return LyricsModel.empty(track);
        }

        return new LyricsModel(track, '', LyricsSourceType.srt, lyricsText, lyricLines, startTimestamps, endTimestamps);
    }

    private parseTimestamp(stamp: string): number {
        const match = SrtLyricsGetter.timestampRegex.exec(stamp);

        if (match == null) {
            return -1;
        }

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const fraction = match[4];
        const fractionalSeconds = parseInt(fraction, 10) / Math.pow(10, fraction.length);

        return hours * 3600 + minutes * 60 + seconds + fractionalSeconds;
    }

    private getSrtFilePath(track: TrackModel): string {
        const trackPathWithoutExtension: string = this.fileAccess.getPathWithoutExtension(track.path);
        let possibleSrtFilePath: string = `${trackPathWithoutExtension}.srt`;

        if (this.fileAccess.pathExists(possibleSrtFilePath)) {
            return possibleSrtFilePath;
        }

        possibleSrtFilePath = `${trackPathWithoutExtension}.Srt`;

        if (this.fileAccess.pathExists(possibleSrtFilePath)) {
            return possibleSrtFilePath;
        }

        possibleSrtFilePath = `${trackPathWithoutExtension}.SRT`;

        if (this.fileAccess.pathExists(possibleSrtFilePath)) {
            return possibleSrtFilePath;
        }

        return '';
    }
}
