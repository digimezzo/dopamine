export abstract class BaseSnackbarService {
    public async abstract notifyFolderAlreadyAddedAsync(): Promise<void>;
}
