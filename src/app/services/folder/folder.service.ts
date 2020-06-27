import { Injectable } from '@angular/core';
import { FolderServiceBase } from './folder-service-base';
import { FolderRepository } from '../../data/entities/folder-repository';
import { Logger } from '../../core/logger';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements FolderServiceBase {
  constructor(private folderRepository: FolderRepository, private logger: Logger) { }

  public async addFolderAsync(path: string): Promise<void> {
    try {
      await this.folderRepository.addFolderAsync(path);
      this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addFolderAsync');
    } catch (error) {
      this.logger.info(`Could not add folder with path '${path}'. Error: ${error}`, 'FolderService', 'addFolderAsync');
    }
  }
}
