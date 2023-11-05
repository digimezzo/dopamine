import { TrackModel } from '../track/track-model';
import { ILyricsGetter } from './i-lyrics-getter';
import { LyricsModel } from './lyrics-model';

export abstract class LyricsServiceBase implements ILyricsGetter {
    public abstract getLyricsAsync(track: TrackModel): Promise<LyricsModel>;
}
