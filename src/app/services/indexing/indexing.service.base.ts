import { Observable } from 'rxjs';

export abstract class IndexingServiceBase {
    public abstract indexingFinished$: Observable<void>;
    public abstract isIndexingCollection: boolean;
    public abstract indexCollectionIfOutdated(): void;
    public abstract indexCollectionAlways(): void;
    public abstract indexAlbumArtworkOnly(onlyWhenHasNoCover: boolean): void;
    public abstract onAlbumGroupingChanged(): void;
    public abstract indexCollectionIfOptionsHaveChanged(): void;
}
