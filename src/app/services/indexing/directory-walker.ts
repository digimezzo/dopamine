import { Injectable } from '@angular/core';
import { DirectoryWalkResult } from './directory-walk-result';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class DirectoryWalker {
    public constructor(private fileAccess: FileAccessBase) {}

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<DirectoryWalkResult> {
        const filePaths: string[] = [];
        const errors: Error[] = [];

        await this.recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors);

        return new DirectoryWalkResult(filePaths, errors);
    }

    private async recursivelyGetFilesInDirectoryAsync(directoryPath: string, filePaths: string[], errors: Error[]): Promise<void> {
        try {
            // Process the files found in the directory
            let filePathsInDirectory: string[] = [];

            try {
                filePathsInDirectory = await this.fileAccess.getFilesInDirectoryAsync(directoryPath, true, errors);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    errors.push(e);
                }
            }

            if (filePathsInDirectory.length > 0) {
                for (const filePath of filePathsInDirectory) {
                    try {
                        filePaths.push(filePath);
                    } catch (e: unknown) {
                        if (e instanceof Error) {
                            errors.push(e);
                        }
                    }
                }
            }

            // Recurse into subdirectories in this directory
            let subdirectoryPathsInDirectory: string[] = [];

            try {
                subdirectoryPathsInDirectory = await this.fileAccess.getDirectoriesInDirectoryAsync(directoryPath, true, errors);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    errors.push(e);
                }
            }

            if (subdirectoryPathsInDirectory.length > 0) {
                for (const subdirectoryPath of subdirectoryPathsInDirectory) {
                    try {
                        await this.recursivelyGetFilesInDirectoryAsync(subdirectoryPath, filePaths, errors);
                    } catch (e: unknown) {
                        if (e instanceof Error) {
                            errors.push(e);
                        }
                    }
                }
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                errors.push(e);
            }
        }
    }
}
