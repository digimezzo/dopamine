export abstract class SnackbarServiceBase {
    public async abstract notifyOfNewVersionAsync(version: string): Promise<void>;
    public async abstract notifyFolderAlreadyAddedAsync(): Promise<void>;
}
