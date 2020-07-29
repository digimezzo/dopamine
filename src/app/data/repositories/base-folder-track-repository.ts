import { FolderTrack } from '../entities/folder-track';

export abstract class BaseFolderTrackRepository {
    public abstract addFolderTrack(folderTrack: FolderTrack): void;
    public abstract deleteFolderTrackByFolderId(folderId: number): void;
    public abstract deleteOrphanedFolderTracks(): void;
}
