import { Injectable } from '@angular/core';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseFolderRepository } from '../../data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from '../../data/repositories/base-folder-track-repository';
import { BaseSnackbarService } from '../snack-bar/base-snack-bar.service';
import { BaseFolderService } from './base-folder.service';

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
    try {
      const existingFolder: Folder = this.folderRepository.getFolderByPath(path);

      if (!existingFolder) {
        const newFolder: Folder = new Folder(path);
        await this.folderRepository.addFolder(newFolder);
        this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
      } else {
        await this.snackbarService.notifyFolderAlreadyAddedAsync();
        this.logger.info(`Folder with path '${path}' was already added`, 'FolderService', 'addNewFolderAsync');
      }
    } catch (error) {
      this.logger.info(`Could not add folder with path '${path}'. Error: ${error}`, 'FolderService', 'addNewFolderAsync');
    }
  }

  public getFolders(): Folder[] {
    return this.folderRepository.getFolders();
  }
  public deleteFolder(folder: Folder): void {
    this.folderRepository.deleteFolder(folder.folderId);
    this.folderTrackRepository.deleteFolderTrackByFolderId(folder.folderId);
  }
}
