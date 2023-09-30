import { Observable } from 'rxjs';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';

export abstract class BaseFolderService {
    public abstract foldersChanged$: Observable<void>;
    public abstract collectionHasFolders: boolean;
    public abstract onFoldersChanged(): void;
    public abstract addFolderAsync(path: string): Promise<void>;
    public abstract getFolders(): FolderModel[];
    public abstract getSubfoldersAsync(
        rootFolder: FolderModel | undefined,
        subfolder: SubfolderModel | undefined
    ): Promise<SubfolderModel[]>;
    public abstract getSubfolderBreadCrumbs(rootFolder: FolderModel, subfolderPath: string): SubfolderModel[];
    public abstract deleteFolder(folder: FolderModel): void;
    public abstract setFolderVisibility(folder: FolderModel): void;
    public abstract setAllFoldersVisible(): void;
}
