import { Injectable } from '@angular/core';
import { Guards } from '../../common/guards';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { DirectoryWalkResult } from './directory-walk-result';

@Injectable()
export class DirectoryWalker {
    public constructor(private fileAccess: BaseFileAccess) {}

    public async getFilesInDirectoryAsync(directoryPath: string): Promise<DirectoryWalkResult> {
        const filePaths: string[] = [];
        const errors: Error[] = [];

        await this.recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors);

        return new DirectoryWalkResult(filePaths, errors);
    }

    private async recursivelyGetFilesInDirectoryAsync(directoryPath: string, filePaths: string[], errors: Error[]): Promise<void> {
        try {
            // Process the files found in the directory
            let filePathsInDirectory: string[] | undefined;

            try {
                filePathsInDirectory = await this.fileAccess.getFilesInDirectoryAsync(directoryPath, true, errors);
            } catch (e) {
                errors.push(e);
            }

            if (Guards.isDefined(filePathsInDirectory) && filePathsInDirectory!.length > 0) {
                for (const filePath of filePathsInDirectory!) {
                    try {
                        filePaths.push(filePath);
                    } catch (e) {
                        errors.push(e);
                    }
                }
            }

            // Recurse into subdirectories in this directory
            let subdirectoryPathsInDirectory: string[] | undefined;

            try {
                subdirectoryPathsInDirectory = await this.fileAccess.getDirectoriesInDirectoryAsync(directoryPath, true, errors);
            } catch (e) {
                errors.push(e);
            }

            if (Guards.isDefined(subdirectoryPathsInDirectory) && subdirectoryPathsInDirectory!.length > 0) {
                for (const subdirectoryPath of subdirectoryPathsInDirectory!) {
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
