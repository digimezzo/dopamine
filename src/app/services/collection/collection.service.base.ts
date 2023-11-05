import { Observable } from 'rxjs';
import { TrackModel } from '../track/track-model';

export abstract class CollectionServiceBase {
    public abstract collectionChanged$: Observable<void>;
    public abstract deleteTracksAsync(tracks: TrackModel[]): Promise<boolean>;
}
