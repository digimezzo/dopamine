export abstract class UpdateServiceBase {
    public abstract isUpdateAvailable: boolean;
    public abstract latestRelease: string;
    public abstract checkForUpdatesAsync(): Promise<void>;
    public abstract downloadLatestReleaseAsync(): Promise<void>;
}
