import { Observable } from 'rxjs';
import { TracksColumnsOrder } from './tracks-columns-order';
import { TracksColumnsOrderColumn } from './tracks-columns-order-column';
import { TracksColumnsVisibility } from './tracks-columns-visibility';

export abstract class BaseTracksColumnsService {
    public abstract tracksColumnsVisibilityChanged$: Observable<TracksColumnsVisibility>;
    public abstract tracksColumnsOrderChanged$: Observable<TracksColumnsOrder>;

    public abstract getTracksColumnsVisibility(): TracksColumnsVisibility;
    public abstract setTracksColumnsVisibility(tracksColumnsVisibility: TracksColumnsVisibility): void;
    public abstract getTracksColumnsOrder(): TracksColumnsOrder;
    public abstract setTracksColumnsOrder(tracksColumnsOrder: TracksColumnsOrderColumn): void;
}
