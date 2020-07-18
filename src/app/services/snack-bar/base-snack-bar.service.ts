export abstract class BaseSnackbarService {
    public async abstract notifyOfNewVersionAsync(version: string): Promise<void>;
    public async abstract notifyFolderAlreadyAddedAsync(): Promise<void>;
}
