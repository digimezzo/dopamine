export abstract class BaseCollectionChecker {
    public abstract async isCollectionOutdatedAsync(): Promise<boolean>;
}
