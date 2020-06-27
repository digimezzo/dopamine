export abstract class SnackbarServiceBase {
    public async abstract notifyOfNewVersionAsync(version: string): Promise<void>;
}
