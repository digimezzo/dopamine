import { Folder } from '../../data/entities/folder';
import { FileSystem } from '../../core/io/file-system';
import { IndexablePath } from './indexable-path';
import { Logger } from '../../core/logger';
import { DateTime } from '../../core/date-time';

export class IndexablePathFetcher {
    constructor(private fileSystem: FileSystem, private logger: Logger) { }
    public async getIndexAblePathsInFolderAsync(folder: Folder, validFileExtensions: string[]): Promise<IndexablePath[]> {
        const indexablePaths: IndexablePath[] = [];

        try {
            const filePaths: string[] = [];
            const errors: Error[] = [];

            await this.recursivelyGetFilesinDirectoryAsync(folder.path, filePaths, errors);

            for (const error of errors) {
                this.logger.error(
                    `Error occurred while getting files recursively. Error ${error}`,
                    'IndexablePathFetcher',
                    'getIndexAblePathsInFolderAsync'
                );
            }

            for (const filePath of filePaths) {
                try {
                    const fileExtension: string = this.fileSystem.getFileExtension(filePath);

                    if (validFileExtensions.includes(fileExtension.toLowerCase())) {
                        const dateModified: Date = await this.fileSystem.getDateModifiedAsync(filePath);
                        indexablePaths.push(new IndexablePath(filePath, DateTime.getTicks(dateModified), folder.folderID));
                    }
                } catch (error) {
                    this.logger.error(
                        `Error occurred while getting indexable path for file '${filePath}'. Error ${error}`,
                        'IndexablePathFetcher',
                        'getIndexAblePathsInFolderAsync'
                    );
                }
            }
        } catch (error) {
            this.logger.error(
                `An error occurred while fetching indexable paths. Error ${error}`,
                'IndexablePathFetcher',
                'getIndexAblePathsInFolderAsync'
            );
        }

        return indexablePaths;
    }

    private async recursivelyGetFilesinDirectoryAsync(directoryPath: string, filePaths: string[], errors: Error[]): Promise<void> {
        try {
            // Process the files found in the directory
            let filePathsInDirectory: string[];

            try {
                filePathsInDirectory = await this.fileSystem.getFilesInDirectoryAsync(directoryPath);
            } catch (error) {
                errors.push(error);
            }

            if (filePathsInDirectory !== null && filePathsInDirectory.length > 0) {
                for (const filePath of filePathsInDirectory) {
                    try {
                        filePaths.push(filePath);
                    } catch (error) {
                        errors.push(error);
                    }
                }
            }

            // Recurse into subdirectories in this directory
            let subdirectoryPathsInDirectory: string[];

            try {
                subdirectoryPathsInDirectory = await this.fileSystem.getDirectoriesInDirectoryAsync(directoryPath);
            } catch (error) {
                errors.push(error);
            }

            if (subdirectoryPathsInDirectory !== null && subdirectoryPathsInDirectory.length > 0) {
                for (const subdirectoryPath of subdirectoryPathsInDirectory) {
                    try {
                        await this.recursivelyGetFilesinDirectoryAsync(subdirectoryPath, filePaths, errors);
                    } catch (error) {
                        errors.push(error);
                    }
                }
            }
        } catch (error) {
            errors.push(error);
        }
    }
}
