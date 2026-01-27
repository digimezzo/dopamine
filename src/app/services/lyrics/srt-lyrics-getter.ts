import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { StringUtils } from '../../common/utils/string-utils';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class SrtLyricsGetter implements ILyricsGetter {
    public constructor(private fileAccess: FileAccessBase) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const srtFilePath: string = this.getSrtFilePath(track);

        if (StringUtils.isNullOrWhiteSpace(srtFilePath)) {
            return LyricsModel.empty(track);
        }

        const lines: string[] = await this.fileAccess.readLinesAsync(srtFilePath);
        let lyricsText: string = '';
        const lyricLines: string[] = [];
        const timeStamps: number[] = [];
        const timeEnds: number[] = [];
        let count = 0;

        for (let i = 0; i < lines.length; i++) {
            if (count == 0) count++;
            else if (count == 3) count=0;
            else if (count == 1) {
                count++;
                const times = lines[i].split(' --> ');

                const startString = times[0];
                const endString = times[1];

                const startList = startString.split(':');
                const endList = endString.split(':');

                const startTime = (Number(startList[0]) * 3600) + (Number(startList[1]) * 60) + (Number(startList[2].replace(',', '')) / 1000);
                const endTime = (Number(endList[0]) * 3600) + (Number(endList[1]) * 60) + (Number(endList[2].replace(',', '')) / 1000);

                timeStamps.push(startTime);
                timeEnds.push(endTime);
            } else {
                lyricLines.push(lines[i]);
                lyricsText += lines[i] + '\n';
                count++;
            }
        }

        if (StringUtils.isNullOrWhiteSpace(lyricsText)) {
            return LyricsModel.empty(track);
        }

        return new LyricsModel(track, '', LyricsSourceType.srt, lyricsText, lyricLines, timeStamps, timeEnds);
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
