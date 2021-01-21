import { TrackModel } from '../playback/track-model';

export abstract class BaseTrackService {
    public abstract getTracksInDirectoryAsync(directoryPath: string): Promise<TrackModel[]>;
}
