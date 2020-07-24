import { Folder } from '../entities/folder';

export abstract class BaseFolderRepository {
    public abstract addFolder(folderPath: string): void;
    public abstract getFolders(): Folder[];
    public abstract getFolder(folderPath: string): Folder;
    public abstract deleteFolder(folderId: number): void;
}
