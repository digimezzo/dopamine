import { Observable } from 'rxjs';
import { FolderModel } from './folder-model';

export abstract class BaseFolderService {
    public abstract foldersChanged$: Observable<void>;
    public abstract onFoldersChanged(): void;
    public abstract async addFolderAsync(path: string): Promise<void>;
    public abstract getFolders(): FolderModel[];
    public abstract deleteFolder(folder: FolderModel): void;
    public abstract setFolderVisibility(folder: FolderModel): void;
    public abstract setAllFoldersVisible(): void;
}
