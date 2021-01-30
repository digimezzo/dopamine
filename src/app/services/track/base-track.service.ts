import { TrackModels } from './track-models';

export abstract class BaseTrackService {
    public abstract getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels>;
}
