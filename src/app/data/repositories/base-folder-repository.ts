import { Folder } from '../entities/folder';

export abstract class BaseFolderRepository {
    public abstract addFolder(folder: Folder): void;
    public abstract getFolders(): Folder[];
    public abstract getFolderByPath(folderPath: string): Folder;
    public abstract deleteFolder(folderId: number): void;
    public abstract setFolderShowInCollection(folderId: number, showInCollection: number): void;
    public abstract setAllFoldersShowInCollection(showInCollection: number): void;
}
