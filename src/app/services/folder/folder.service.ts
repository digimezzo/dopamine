import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseFolderRepository } from '../../data/repositories/base-folder-repository';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { BaseFolderService } from './base-folder.service';
import { FolderModel } from './folder-model';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements BaseFolderService {
  private foldersChanged: Subject<void> = new Subject();

  constructor(
    private folderRepository: BaseFolderRepository,
    private logger: Logger,
    private snackBarService: BaseSnackBarService) { }

  public foldersChanged$: Observable<void> = this.foldersChanged.asObservable();

  public onFoldersChanged(): void {
    this.foldersChanged.next();
  }

  public async addFolderAsync(path: string): Promise<void> {
    const existingFolder: Folder = this.folderRepository.getFolderByPath(path);

    if (existingFolder == undefined) {
      const newFolder: Folder = new Folder(path);
      await this.folderRepository.addFolder(newFolder);
      this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
      this.onFoldersChanged();
    } else {
      await this.snackBarService.folderAlreadyAddedAsync();
      this.logger.info(`Folder with path '${path}' was already added`, 'FolderService', 'addNewFolderAsync');
    }
  }

  public getFolders(): FolderModel[] {
    const folders: Folder[] = this.folderRepository.getFolders();

    if (folders != undefined) {
      return folders.map(x => new FolderModel(x));
    }

    return [];
  }
  public deleteFolder(folder: FolderModel): void {
    this.folderRepository.deleteFolder(folder.folderId);
    this.logger.info(`Deleted folder with path '${folder.path}'`, 'FolderService', 'deleteFolder');
    this.onFoldersChanged();
  }

  public setFolderVisibility(folder: FolderModel): void {
    const showInCollection: number = folder.showInCollection ? 1 : 0;
    this.folderRepository.setFolderShowInCollection(folder.folderId, showInCollection);
    this.logger.info(`Set folder visibility: folderId=${folder.folderId}, path '${folder.path}', showInCollection=${showInCollection}`,
      'FolderService',
      'setFolderVisibility');
  }

  public setAllFoldersVisible(): void {
    this.folderRepository.setAllFoldersShowInCollection(1);
    this.logger.info('Set all folders visible',
      'FolderService',
      'setAllFoldersVisible');
  }
}
