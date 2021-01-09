export abstract class BaseCollectionChecker {
    public abstract isCollectionOutdatedAsync(): Promise<boolean>;
}
