import { Folder } from '../entities/folder';

export abstract class FolderRepositoryBase {
    public abstract addFolder(folder: Folder): void;
    public abstract getFolders(): Folder[] | undefined;
    public abstract getFolderByPath(folderPath: string): Folder | undefined;
    public abstract deleteFolder(folderId: number): void;
    public abstract setFolderShowInCollection(folderId: number, showInCollection: number): void;
    public abstract setAllFoldersShowInCollection(showInCollection: number): void;
}
