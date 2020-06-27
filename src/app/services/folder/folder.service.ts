import { Injectable } from '@angular/core';
import { FolderServiceBase } from './folder-service-base';
import { FolderRepository } from '../../data/entities/folder-repository';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements FolderServiceBase {
  constructor(private folderRepository: FolderRepository, private logger: Logger) { }

  public async addNewFolderAsync(path: string): Promise<void> {
    try {
      const existingFolder: Folder = await this.folderRepository.getFolderAsync(path);

      if (!existingFolder) {
        await this.folderRepository.addFolderAsync(path);
        this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addFolderAsync');
      } else {
        this.logger.info(`Folder with path '${path}' already added`, 'FolderService', 'addFolderAsync');
      }
    } catch (error) {
      this.logger.info(`Could not add folder with path '${path}'. Error: ${error}`, 'FolderService', 'addFolderAsync');
    }
  }
}
