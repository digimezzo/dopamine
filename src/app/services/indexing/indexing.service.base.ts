import { Observable } from 'rxjs';

export abstract class IndexingServiceBase {
    public abstract indexingFinished$: Observable<void>;
    public abstract isIndexingCollection: boolean;
    public abstract indexCollectionIfOutdated(): void;
    public abstract indexCollectionAlways(): void;
    public abstract indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void>;
    public abstract onAlbumGroupingChanged(): void;
    public abstract indexCollectionIfOptionsHaveChangedAsync(): Promise<void>;
}
