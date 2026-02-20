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

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const lrcFilePath: string = this.getLrcFilePath(track);

        if (StringUtils.isNullOrWhiteSpace(lrcFilePath)) {
            return LyricsModel.empty(track);
        }

        const lines: string[] = await this.fileAccess.readLinesAsync(lrcFilePath);
        let lyricsText: string = '';
        const lyricLines: string[] = [];
        const timeStamps: number[] = [];

        for (let i = 0; i < lines.length; i++) {
            const lineParts = lines[i].replace('[', '').split(']');
            const lineWithoutTimestamp: string = lineParts[1];
            const timeStamp: string = lineParts[0];

            const timeList = timeStamp.split(':');

            const startTime = (Number(timeList[0]) * 60) + (Number(timeList[1].replace('.', '')) / 100);

            lyricLines.push(lineWithoutTimestamp);
            timeStamps.push(startTime);

            if (!StringUtils.isNullOrWhiteSpace(lineWithoutTimestamp)) {
                lyricsText += `${lineWithoutTimestamp}`;

                if (i < lines.length - 1) {
                    lyricsText += '\n';
                }
            }
        }

        if (StringUtils.isNullOrWhiteSpace(lyricsText)) {
            return LyricsModel.empty(track);
        }

        return LyricsModel.createWithoutEnds(track, '', LyricsSourceType.lrc, lyricsText, lyricLines, timeStamps);
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
