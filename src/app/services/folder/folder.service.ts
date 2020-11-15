import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseFolderRepository } from '../../data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from '../../data/repositories/base-folder-track-repository';
import { BaseSnackbarService } from '../snack-bar/base-snack-bar.service';
import { BaseFolderService } from './base-folder.service';
import { FolderModel } from './folder-model';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements BaseFolderService {
  constructor(
    private folderRepository: BaseFolderRepository,
    private folderTrackRepository: BaseFolderTrackRepository,
    private logger: Logger,
    private snackbarService: BaseSnackbarService) { }

  public async addNewFolderAsync(path: string): Promise<void> {
    const existingFolder: Folder = this.folderRepository.getFolderByPath(path);

    if (existingFolder == undefined) {
      const newFolder: Folder = new Folder(path);
      await this.folderRepository.addFolder(newFolder);
      this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
    } else {
      await this.snackbarService.notifyFolderAlreadyAddedAsync();
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
    this.folderTrackRepository.deleteFolderTrackByFolderId(folder.folderId);
    this.logger.info(`Deleted folder with path '${folder.path}'`, 'FolderService', 'deleteFolder');
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
