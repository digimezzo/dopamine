import { TrackModel } from '../track/track-model';
import { LyricsModel } from './lyrics-model';

export interface ILyricsGetter {
    getLyricsAsync(track: TrackModel): Promise<LyricsModel>;
}
