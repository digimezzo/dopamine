import { Observable } from 'rxjs';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';

export abstract class BaseFolderService {
    public abstract foldersChanged$: Observable<void>;
    public abstract collectionHasFolders: boolean;
    public abstract onFoldersChanged(): void;
    public abstract addFolderAsync(path: string): Promise<void>;
    public abstract getFolders(): FolderModel[];
    public abstract getSubfoldersAsync(rootFolder: FolderModel, subfolder: SubfolderModel): Promise<SubfolderModel[]>;
    public abstract getSubfolderBreadCrumbsAsync(rootFolder: FolderModel, subfolderPath: string): Promise<SubfolderModel[]>;
    public abstract deleteFolder(folder: FolderModel): void;
    public abstract setFolderVisibility(folder: FolderModel): void;
    public abstract setAllFoldersVisible(): void;
}
