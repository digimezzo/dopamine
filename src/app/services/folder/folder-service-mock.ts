import { Observable, Subject } from 'rxjs';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';
import { FolderServiceBase } from './folder.service.base';

export class FolderServiceMock implements FolderServiceBase {
    private foldersChanged: Subject<void> = new Subject();
    public collectionHasFolders: boolean = false;
    public foldersChanged$: Observable<void> = this.foldersChanged.asObservable();

    public async onFoldersChangedAsync(): Promise<void> {
        this.foldersChanged.next();
    }

    public async addFolderAsync(path: string): Promise<void> {}

    public async getFoldersAsync(): Promise<FolderModel[]> {
        return [];
    }

    public async getSubfoldersAsync(rootFolder: FolderModel, subfolder: SubfolderModel): Promise<SubfolderModel[]> {
        return Promise.resolve([]);
    }

    public getSubfolderBreadcrumbs(rootFolder: FolderModel, openedSubfolderPath: string): SubfolderModel[] {
        return [];
    }

    public async deleteFolderAsync(folder: FolderModel): Promise<void> {}

    public async setFolderVisibilityAsync(folder: FolderModel): Promise<void> {}

    public async setAllFoldersVisibleAsync(): Promise<void> {}
}
