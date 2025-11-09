import { Folder } from '../entities/folder';

export abstract class FolderRepositoryBase {
    public abstract addFolderAsync(folder: Folder): Promise<void>;
    public abstract getFoldersAsync(): Promise<Folder[] | undefined>;
    public abstract getFolderByPathAsync(folderPath: string): Promise<Folder | undefined>;
    public abstract deleteFolderAsync(folderId: number): Promise<void>;
    public abstract setFolderShowInCollectionAsync(folderId: number, showInCollection: number): Promise<void>;
    public abstract setAllFoldersShowInCollectionAsync(showInCollection: number): Promise<void>;
}
