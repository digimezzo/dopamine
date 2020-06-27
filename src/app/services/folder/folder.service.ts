import { Injectable } from '@angular/core';
import { FolderServiceBase } from './folder-service-base';
import { FolderRepository } from '../../data/entities/folder-repository';

@Injectable({
  providedIn: 'root'
})
export class FolderService implements FolderServiceBase {
  constructor(private folderRepository: FolderRepository) { }

  public async addFolderAsync(path: string): Promise<void> {
    await this.folderRepository.addFolderAsync(path);
  }
}
