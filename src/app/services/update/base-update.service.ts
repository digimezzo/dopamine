export abstract class BaseUpdateService {
    public abstract checkForUpdatesAsync(): Promise<void>;
}
