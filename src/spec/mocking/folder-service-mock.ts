import { Observable, Subject } from 'rxjs';
import { BaseFolderService } from '../../app/services/folder/base-folder.service';
import { FolderModel } from '../../app/services/folder/folder-model';

export class FolderServiceMock implements BaseFolderService {
    private foldersChanged: Subject<void> = new Subject();
    public foldersChanged$: Observable<void> = this.foldersChanged.asObservable();

    public onFoldersChanged(): void {
        this.foldersChanged.next();
    }

    public async addFolderAsync(path: string): Promise<void> {
    }

    public getFolders(): FolderModel[] {
        return [];
    }

    public deleteFolder(folder: FolderModel): void {
    }

    public setFolderVisibility(folder: FolderModel): void {
    }

    public setAllFoldersVisible(): void {
    }
}
