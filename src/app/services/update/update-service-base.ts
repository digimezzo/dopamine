export abstract class UpdateServiceBase {
    public async abstract checkForUpdatesAsync(): Promise<void>;
}
