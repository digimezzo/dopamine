import { TrackModel } from '../track/track-model';

export abstract class BaseMetadataService {
    public abstract createImageUrlAsync(track: TrackModel): Promise<string>;
}
