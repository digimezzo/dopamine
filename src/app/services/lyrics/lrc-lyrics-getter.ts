import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';

@Injectable()
export class LrcLyricsGetter implements ILyricsGetter {
    // eslint-disable-next-line @typescript-eslint/require-await
    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        return new LyricsModel('', LyricsSourceType.lrc, '');
    }
}
