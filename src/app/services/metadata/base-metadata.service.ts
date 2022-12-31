import { Observable } from 'rxjs';
import { TrackModel } from '../track/track-model';

export abstract class BaseMetadataService {
    public abstract ratingSaved$: Observable<TrackModel>;
    public abstract loveSaved$: Observable<TrackModel>;
    public abstract createImageUrlAsync(track: TrackModel): Promise<string>;
    public abstract saveTrackRatingAsync(track: TrackModel): Promise<void>;
    public abstract saveTrackLoveAsync(track: TrackModel): Promise<void>;
}
