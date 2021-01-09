export abstract class BaseIndexingService {
    public abstract isIndexingCollection: boolean;
    public abstract indexCollectionIfOutdatedAsync(): Promise<void>;
    public abstract indexCollectionIfFoldersHaveChangedAsync(): Promise<void>;
    public abstract indexCollectionAlwaysAsync(): Promise<void>;
    public abstract indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void>;
}
