export abstract class Update {
    public async abstract checkForUpdatesAsync(): Promise<void>;
}
