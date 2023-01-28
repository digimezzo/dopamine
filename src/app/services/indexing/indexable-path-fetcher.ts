import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { Folder } from '../../common/data/entities/folder';
import { BaseFolderRepository } from '../../common/data/repositories/base-folder-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { DirectoryWalkResult } from './directory-walk-result';
import { DirectoryWalker } from './directory-walker';
import { IndexablePath } from './indexable-path';

@Injectable()
export class IndexablePathFetcher {
    constructor(
        private fileAccess: BaseFileAccess,
        private directoryWalker: DirectoryWalker,
        private logger: Logger,
        private folderRepository: BaseFolderRepository
    ) {}

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
            if (this.fileAccess.pathExists(folder.path)) {
                try {
                    const indexablePathsForFolder: IndexablePath[] = await this.getIndexablePathsForSingleFolderAsync(
                        folder,
                        FileFormats.supportedAudioExtensions
                    );

                    indexablePaths.push(...indexablePathsForFolder);
                } catch (e) {
                    this.logger.error(
                        `Could not get indexable paths for folder '${folder.path}'. Error: ${e.message}`,
                        'IndexablePathFetcher',
                        'getIndexablePathsForAllFoldersAsync'
                    );
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
                    `Error occurred while getting files recursively for folder '${folder.path}'. Error ${e.message}`,
                    'IndexablePathFetcher',
                    'getIndexablePathsForSingleFolderAsync'
                );
            }

            for (const filePath of directoryWalkResult.filePaths) {
                try {
                    const fileExtension: string = this.fileAccess.getFileExtension(filePath);

                    if (validFileExtensions.includes(fileExtension.toLowerCase())) {
                        const dateModifiedInTicks: number = await this.fileAccess.getDateModifiedInTicksAsync(filePath);
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
                `An error occurred while fetching indexable paths for folder '${folder.path}'. Error ${e.message}`,
                'IndexablePathFetcher',
                'getIndexablePathsForSingleFolderAsync'
            );
        }

        return indexablePaths;
    }
}
