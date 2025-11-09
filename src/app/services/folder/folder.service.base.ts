import { Observable } from 'rxjs';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';

export abstract class FolderServiceBase {
    public abstract foldersChanged$: Observable<void>;
    public abstract collectionHasFolders: boolean;
    public abstract onFoldersChangedAsync(): Promise<void>;
    public abstract addFolderAsync(path: string): Promise<void>;
    public abstract getFoldersAsync(): Promise<FolderModel[]>;
    public abstract getSubfoldersAsync(
        rootFolder: FolderModel | undefined,
        subfolder: SubfolderModel | undefined,
    ): Promise<SubfolderModel[]>;
    public abstract getSubfolderBreadcrumbs(rootFolder: FolderModel, subfolderPath: string): SubfolderModel[];
    public abstract deleteFolderAsync(folder: FolderModel): Promise<void>;
    public abstract setFolderVisibilityAsync(folder: FolderModel): Promise<void>;
    public abstract setAllFoldersVisibleAsync(): Promise<void>;
}
