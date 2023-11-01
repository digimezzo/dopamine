import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Strings } from '../../common/strings';

@Injectable()
export class LrcLyricsGetter implements ILyricsGetter {
    public constructor(private fileAccess: BaseFileAccess) {}

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        const lrcFilePath: string = this.getLrcFilePath(track);

        if (Strings.isNullOrWhiteSpace(lrcFilePath)) {
            return LyricsModel.default();
        }

        const lines: string[] = await this.fileAccess.readLinesAsync(lrcFilePath);
        let lyricsText: string = '';

        for (let i = 0; i < lines.length; i++) {
            const lineParts: string[] = lines[i].split(']');
            const lineWithoutTimestamp: string = lineParts.length > 1 ? lineParts[1] : lineParts[0];

            if (!Strings.isNullOrWhiteSpace(lineWithoutTimestamp) && !lineWithoutTimestamp.startsWith('[')) {
                lyricsText += `${lineWithoutTimestamp}`;

                if (i < lines.length - 1) {
                    lyricsText += '\n';
                }
            }
        }

        return new LyricsModel('', LyricsSourceType.lrc, lyricsText);
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
