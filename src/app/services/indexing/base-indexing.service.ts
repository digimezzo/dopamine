export abstract class BaseIndexingService {
    public abstract async indexCollectionIfNeeded(): Promise<void>;
}
