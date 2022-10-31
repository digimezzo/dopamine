import { Observable } from 'rxjs';
import { TracksColumnsOrder } from './track-columns-order';
import { TracksColumnsVisibility } from './track-columns-visibility';

export abstract class BaseTracksColumnsService {
    public abstract tracksColumnsVisibilityChanged$: Observable<TracksColumnsVisibility>;

    public abstract getTracksColumnsVisibility(): TracksColumnsVisibility;
    public abstract setTracksColumnsVisibility(tracksColumnsVisibility: TracksColumnsVisibility): void;
    public abstract setTracksColumnsOrder(tracksColumnsOrder: TracksColumnsOrder): void;
}
