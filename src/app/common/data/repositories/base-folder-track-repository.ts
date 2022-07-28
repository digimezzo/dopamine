import { FolderTrack } from '../entities/folder-track';

export abstract class BaseFolderTrackRepository {
    public abstract addFolderTrack(folderTrack: FolderTrack): void;
    public abstract getNumberOfFolderTracksForInexistingTracks(): number;
    public abstract deleteFolderTracksForInexistingTracks(): number;
}
