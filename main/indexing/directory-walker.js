const { FileAccess } = require('../common/io/file-access');
const { DirectoryWalkResult } = require('./directory-walk-result');

class DirectoryWalker {
    static async getFilesInDirectoryAsync(directoryPath) {
        const filePaths = [];
        const errors = [];

        await this.recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors);

        return new DirectoryWalkResult(filePaths, errors);
    }

    static async recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors) {
        try {
            // Process the files found in the directory
            let filePathsInDirectory = [];

            try {
                filePathsInDirectory = await FileAccess.getFilesInDirectoryAsync(directoryPath, true, errors);
            } catch (e) {
                if (e instanceof Error) {
                    errors.push(e);
                }
            }

            if (filePathsInDirectory.length > 0) {
                for (const filePath of filePathsInDirectory) {
                    try {
                        filePaths.push(filePath);
                    } catch (e) {
                        if (e instanceof Error) {
                            errors.push(e);
                        }
                    }
                }
            }

            // Recurse into subdirectories in this directory
            let subdirectoryPathsInDirectory = [];

            try {
                subdirectoryPathsInDirectory = await FileAccess.getDirectoriesInDirectoryAsync(directoryPath, true, errors);
            } catch (e) {
                if (e instanceof Error) {
                    errors.push(e);
                }
            }

            if (subdirectoryPathsInDirectory.length > 0) {
                for (const subdirectoryPath of subdirectoryPathsInDirectory) {
                    try {
                        await this.recursivelyGetFilesInDirectoryAsync(subdirectoryPath, filePaths, errors);
                    } catch (e) {
                        if (e instanceof Error) {
                            errors.push(e);
                        }
                    }
                }
            }
        } catch (e) {
            if (e instanceof Error) {
                errors.push(e);
            }
        }
    }
}

exports.DirectoryWalker = DirectoryWalker;
