export abstract class BaseSnackBarService {
    public async abstract folderAlreadyAddedAsync(): Promise<void>;
    public async abstract newVersionAvailable(version: string): Promise<void>;
    public async abstract removingTracksAsync(): Promise<void>;
    public async abstract updatingTracksAsync(): Promise<void>;
    public async abstract addingTracksAsync(): Promise<void>;
    public async abstract addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void>;
    public async abstract dismissAsync(): Promise<void>;
}
