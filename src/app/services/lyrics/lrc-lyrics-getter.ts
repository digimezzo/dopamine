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
        const timeStamps: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const regex = new RegExp('(\\[\\d+:)((\\d+:?)+)?(\\.\\d+\\])');
            const lineWithoutTimestamp: string = lines[i].replace(regex, '');
            const timeStamp: string = lines[i].replace('[', '').split(']')[0];

            lyricLines.push(lineWithoutTimestamp);
            timeStamps.push(timeStamp);

            if (!StringUtils.isNullOrWhiteSpace(lineWithoutTimestamp) && !lineWithoutTimestamp.startsWith('[')) {
                lyricsText += `${lineWithoutTimestamp}`;

                if (i < lines.length - 1) {
                    lyricsText += '\n';
                }
            }
        }

        if (StringUtils.isNullOrWhiteSpace(lyricsText)) {
            return LyricsModel.empty(track);
        }

        return new LyricsModel(track, '', LyricsSourceType.lrc, lyricsText, lyricLines, timeStamps);
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
