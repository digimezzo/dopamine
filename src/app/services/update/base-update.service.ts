export abstract class BaseUpdateService {
    public async abstract checkForUpdatesAsync(): Promise<void>;
}
