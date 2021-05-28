export abstract class BaseUpdateService {
    public abstract isUpdateAvailable: boolean;
    public abstract latestRelease: string;
    public abstract checkForUpdatesAsync(): Promise<void>;
    public abstract downloadLatestRelease(): void;
}
