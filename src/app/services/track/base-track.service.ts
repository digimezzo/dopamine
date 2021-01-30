import { TrackModel } from './track-model';

export abstract class BaseTrackService {
    public abstract getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModel[]>;
}
