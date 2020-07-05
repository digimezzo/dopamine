import { Injectable } from '@angular/core';
import { FolderServiceBase } from './folder-service-base';
import { FolderRepository } from '../../data/entities/folder-repository';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { SnackbarServiceBase } from '../snack-bar/snack-bar-service-base';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements FolderServiceBase {
  constructor(private folderRepository: FolderRepository, private logger: Logger, private snackbarService: SnackbarServiceBase) { }

  public async addNewFolderAsync(path: string): Promise<void> {
    try {
      const existingFolder: Folder = await this.folderRepository.getFolderAsync(path);

      if (!existingFolder) {
        await this.folderRepository.addFolderAsync(path);
        this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
      } else {
        await this.snackbarService.notifyFolderAlreadyAddedAsync();
        this.logger.info(`Folder with path '${path}' was already added`, 'FolderService', 'addNewFolderAsync');
      }
    } catch (error) {
      this.logger.info(`Could not add folder with path '${path}'. Error: ${error}`, 'FolderService', 'addNewFolderAsync');
    }
  }

  public async getFoldersAsync(): Promise<Folder[]> {
    return await this.folderRepository.getFoldersAsync();
  }
  public async deleteFolderAsync(folder: Folder): Promise<void> {
    await this.folderRepository.deleteFolderAsync(folder.path);
  }
}
