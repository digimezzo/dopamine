export abstract class SnackBar {
    public async abstract notifyOfNewVersionAsync(version: string): Promise<void>;
}
