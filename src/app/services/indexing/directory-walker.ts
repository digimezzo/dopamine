import { Injectable } from '@angular/core';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { DirectoryWalkResult } from './directory-walk-result';

@Injectable()
export class DirectoryWalker {
    constructor(private fileSystem: BaseFileSystem) {}

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<DirectoryWalkResult> {
        const filePaths: string[] = [];
        const errors: Error[] = [];

        await this.recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors);

        return new DirectoryWalkResult(filePaths, errors);
    }

    private async recursivelyGetFilesInDirectoryAsync(directoryPath: string, filePaths: string[], errors: Error[]): Promise<void> {
        try {
            // Process the files found in the directory
            let filePathsInDirectory: string[];

            try {
                filePathsInDirectory = await this.fileSystem.getFilesInDirectoryAsync(directoryPath);
            } catch (e) {
                errors.push(e);
            }

            if (filePathsInDirectory != undefined && filePathsInDirectory.length > 0) {
                for (const filePath of filePathsInDirectory) {
                    try {
                        filePaths.push(filePath);
                    } catch (e) {
                        errors.push(e);
                    }
                }
            }

            // Recurse into subdirectories in this directory
            let subdirectoryPathsInDirectory: string[];

            try {
                subdirectoryPathsInDirectory = await this.fileSystem.getDirectoriesInDirectoryAsync(directoryPath);
            } catch (e) {
                errors.push(e);
            }

            if (subdirectoryPathsInDirectory != undefined && subdirectoryPathsInDirectory.length > 0) {
                for (const subdirectoryPath of subdirectoryPathsInDirectory) {
                    try {
                        await this.recursivelyGetFilesInDirectoryAsync(subdirectoryPath, filePaths, errors);
                    } catch (e) {
                        errors.push(e);
                    }
                }
            }
        } catch (e) {
            errors.push(e);
        }
    }
}
