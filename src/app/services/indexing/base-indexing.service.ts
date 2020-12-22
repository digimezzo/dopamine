export abstract class BaseIndexingService {
    public abstract async indexCollectionIfOutdatedAsync(): Promise<void>;
    public abstract async indexCollectionIfFoldersHaveChangedAsync(): Promise<void>;
    public abstract async indexCollectionAlwaysAsync(): Promise<void>;
    public abstract async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void>;
}
