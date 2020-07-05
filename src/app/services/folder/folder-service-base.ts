import { Folder } from '../../data/entities/folder';

export abstract class FolderServiceBase {
    public abstract addNewFolderAsync(path: string): Promise<void>;
    public abstract getFoldersAsync(): Promise<Folder[]>;
    public abstract deleteFolderAsync(folder: Folder): Promise<void>;
}
