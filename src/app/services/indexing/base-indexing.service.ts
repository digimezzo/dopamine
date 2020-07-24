export abstract class BaseIndexingService {
    public abstract async indexCollectionIfNeededAsync(): Promise<void>;
}
