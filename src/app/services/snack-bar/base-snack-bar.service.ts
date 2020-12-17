export abstract class BaseSnackBarService {
    public abstract folderAlreadyAddedAsync(): Promise<void>;
    public abstract newVersionAvailable(version: string): Promise<void>;
    public abstract removingTracksAsync(): Promise<void>;
    public abstract updatingTracksAsync(): Promise<void>;
    public abstract addingTracksAsync(): Promise<void>;
    public abstract addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void>;
    public abstract dismissAsync(): Promise<void>;
    public abstract dismissDelayedAsync(): Promise<void>;
}
