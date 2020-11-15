import { FolderModel } from './folder-model';

export abstract class BaseFolderService {
    public abstract async addNewFolderAsync(path: string): Promise<void>;
    public abstract getFolders(): FolderModel[];
    public abstract deleteFolder(folder: FolderModel): void;
    public abstract setFolderVisibility(folder: FolderModel): void;
    public abstract setAllFoldersVisible(): void;
}
