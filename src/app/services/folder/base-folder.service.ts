import { Folder } from '../../data/entities/folder';

export abstract class BaseFolderService {
    public abstract async addNewFolderAsync(path: string): Promise<void>;
    public abstract getFolders(): Folder[];
    public abstract deleteFolder(folder: Folder): void;
}
