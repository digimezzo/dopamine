import { Observable } from 'rxjs';
import { TrackModel } from '../track/track-model';

export abstract class MetadataServiceBase {
    public abstract ratingSaved$: Observable<TrackModel>;
    public abstract loveSaved$: Observable<TrackModel>;
    public abstract createImageUrlAsync(track: TrackModel | undefined): Promise<string>;
    public abstract saveTrackRatingAsync(track: TrackModel): Promise<void>;
    public abstract saveTrackLove(track: TrackModel): void;
}
