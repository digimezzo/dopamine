export abstract class BaseIndexingService {
    public abstract async indexCollectionIfNeededAsync(): Promise<void>;
    public abstract async indexCollectionAsync(): Promise<void>;
    public abstract async indexAlbumArtworkOnlyAsync(onlyWhenHasNoCover: boolean): Promise<void>;
}
