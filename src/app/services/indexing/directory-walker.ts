import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { DirectoryWalkResult } from './directory-walk-result';

@Injectable({
    providedIn: 'root'
})
export class DirectoryWalker {
    constructor(private fileSystem: FileSystem) { }

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<DirectoryWalkResult> {
        const filePaths: string[] = [];
        const errors: Error[] = [];

        await this.recursivelyGetFilesinDirectoryAsync(directoryPath, filePaths, errors);

        return new DirectoryWalkResult(filePaths, errors);
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
