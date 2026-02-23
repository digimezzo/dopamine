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

        for (let i = 0; i < lines.length; i++) {
            const lineParts: string[] = lines[i].split(']');
            const lineWithoutTimestamp: string = lineParts.length > 1 ? lineParts[1] : lineParts[0];

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

        return new LyricsModel(track, '', LyricsSourceType.lrc, lyricsText);
    }

    private getLrcFilePath(track: TrackModel): string {
        const trackPath: string = this.fileAccess.getDirectoryPath(track.path);
        const trackFileNameWithoutExtension: string = this.fileAccess.getFileNameWithoutExtension(track.path);
        const lrcExtensions: string[] = ['.lrc', '.Lrc', '.LRC']
        const possibleFolders: string[] = [`${trackPath}`, `${trackPath}\\lyrics`, `${trackPath}\\Lyrics`, `${trackPath}\\LYRICS`]

        for (var folder of possibleFolders) {
            for (var ext of lrcExtensions) {
                let possibleLrcFilePath: string = `${folder}\\${trackFileNameWithoutExtension}${ext}`;

                if (this.fileAccess.pathExists(possibleLrcFilePath)) {
                    return possibleLrcFilePath;
                }
            }
        }

        return '';
    }
}
