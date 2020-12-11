export abstract class BaseSnackbarService {
    public async abstract folderAlreadyAddedAsync(): Promise<void>;
    public async abstract newVersionAvailable(version: string): Promise<void>;
}
