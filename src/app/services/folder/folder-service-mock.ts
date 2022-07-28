import { Observable, Subject } from 'rxjs';
import { BaseFolderService } from './base-folder.service';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';

export class FolderServiceMock implements BaseFolderService {
    private foldersChanged: Subject<void> = new Subject();
    public collectionHasFolders: boolean = false;
    public foldersChanged$: Observable<void> = this.foldersChanged.asObservable();

    public onFoldersChanged(): void {
        this.foldersChanged.next();
    }

    public async addFolderAsync(path: string): Promise<void> {}

    public getFolders(): FolderModel[] {
        return [];
    }

    public async getSubfoldersAsync(rootFolder: FolderModel, subfolder: SubfolderModel): Promise<SubfolderModel[]> {
        return [];
    }

    public async getSubfolderBreadCrumbsAsync(rootFolder: FolderModel, openedSubfolderPath: string): Promise<SubfolderModel[]> {
        return [];
    }

    public deleteFolder(folder: FolderModel): void {}

    public setFolderVisibility(folder: FolderModel): void {}

    public setAllFoldersVisible(): void {}
}
