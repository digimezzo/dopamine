export abstract class BaseCollectionChecker {
    public abstract async collectionNeedsIndexingAsync(): Promise<boolean>;
}
