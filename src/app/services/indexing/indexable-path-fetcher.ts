import { Injectable } from '@angular/core';
import { FileFormats } from '../../core/base/file-formats';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseFolderRepository } from '../../data/repositories/base-folder-repository';
import { BaseIndexablePathFetcher } from './base-indexable-path-fetcher';
import { DirectoryWalkResult } from './directory-walk-result';
import { DirectoryWalker } from './directory-walker';
import { IndexablePath } from './indexable-path';

@Injectable()
export class IndexablePathFetcher implements BaseIndexablePathFetcher {
    constructor(
        private fileSystem: FileSystem,
        private directoryWalker: DirectoryWalker,
        private logger: Logger,
        private folderRepository: BaseFolderRepository) { }

    public async getIndexablePathsForAllFoldersAsync(): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];
        let folders: Folder[] = [];

        try {
            folders = this.folderRepository.getFolders();
        } catch (e) {
            this.logger.error(
                `An error occurred while getting folders. Error ${e.message}`,
                'IndexablePathFetcher',
                'getIndexablePathsForAllFoldersAsync'
            );
        }

        for (const folder of folders) {
            if (this.fileSystem.pathExists(folder.path)) {
                try {
                    const indexablePathsForFolder: IndexablePath[] = await this.getIndexablePathsForSingleFolderAsync(
                        folder,
                        FileFormats.supportedAudioExtensions);

                    indexablePaths.push(...indexablePathsForFolder);
                } catch (e) {
                    this.logger.error(
                        `Could not get indexable paths for folder '${folder.path}'. Error: ${e.message}`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForAllFoldersAsync');
                }
            }
        }

        return indexablePaths;
    }

    private async getIndexablePathsForSingleFolderAsync(folder: Folder, validFileExtensions: string[]): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        try {
            const directoryWalkResult: DirectoryWalkResult = await this.directoryWalker.getFilesInDirectoryAsync(folder.path);

            for (const e of directoryWalkResult.errors) {
                this.logger.error(
                    `Error occurred while getting files recursively. Error ${e.message}`,
                    'IndexablePathFetcher',
                    'getIndexablePathsForSingleFolderAsync'
                );
            }

            for (const filePath of directoryWalkResult.filePaths) {
                try {
                    const fileExtension: string = this.fileSystem.getFileExtension(filePath);

                    if (validFileExtensions.includes(fileExtension.toLowerCase())) {
                        const dateModifiedInTicks: number = await this.fileSystem.getDateModifiedInTicksAsync(filePath);
                        indexablePaths.push(new IndexablePath(filePath, dateModifiedInTicks, folder.folderId));
                    }
                } catch (e) {
                    this.logger.error(
                        `Error occurred while getting indexable path for file '${filePath}'. Error ${e.message}`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForSingleFolderAsync'
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                `An error occurred while fetching indexable paths for single folder. Error ${e.message}`,
                'IndexablePathFetcher',
                'getIndexablePathsForSingleFolderAsync'
            );
        }

        return indexablePaths;
    }
}
