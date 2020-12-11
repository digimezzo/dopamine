export abstract class BaseSnackBarService {
    public async abstract folderAlreadyAddedAsync(): Promise<void>;
    public async abstract newVersionAvailable(version: string): Promise<void>;
    public async abstract removingSongsAsync(): Promise<void>;
    public async abstract updatingSongsAsync(): Promise<void>;
    public async abstract addedSongsAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void>;
    public async abstract dismissAsync(): Promise<void>;
}
