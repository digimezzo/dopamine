const fs = require('fs-extra');
const path = require('path');

class FileAccess {
    #pathSeparator = path.sep;

    constructor(dateTime) {
        this.dateTime = dateTime;
    }

    pathExists(pathToCheck) {
        return fs.existsSync(pathToCheck);
    }

    getFileExtension(fileNameOrPath) {
        return path.extname(fileNameOrPath);
    }

    getDateModifiedInTicks(fileOrDirectory) {
        const stat = fs.statSync(fileOrDirectory);
        const dateModified = stat.mtime;

        return this.dateTime.convertDateToTicks(dateModified);
    }

    getDateCreatedInTicks(fileOrDirectory) {
        const stat = fs.statSync(fileOrDirectory);
        const dateCreated = stat.birthtime;

        return this.dateTime.convertDateToTicks(dateCreated);
    }

    combinePath(pathPieces) {
        if (pathPieces === undefined || pathPieces === null || pathPieces.length === 0) {
            return '';
        }

        if (pathPieces.length === 1) {
            return pathPieces[0];
        }

        return pathPieces.join(this.#pathSeparator);
    }

    async getFilesInDirectoryAsync(directoryPath, continueOnError, errors) {
        const possibleFileNames = await fs.readdir(directoryPath);
        const confirmedFilePaths = [];

        for (const possibleFileName of possibleFileNames) {
            const possibleFilePath = this.combinePath([directoryPath, possibleFileName]);

            try {
                if (fs.lstatSync(possibleFilePath).isFile()) {
                    confirmedFilePaths.push(possibleFilePath);
                }
            } catch (e) {
                if (continueOnError === undefined || continueOnError === null || !continueOnError) {
                    throw e;
                }

                if (errors !== undefined && errors !== null) {
                    if (e instanceof Error) {
                        errors.push(e);
                    }
                }
            }
        }

        return confirmedFilePaths;
    }

    async getDirectoriesInDirectoryAsync(directoryPath, continueOnError, errors) {
        const possibleDirectoryNames = await fs.readdir(directoryPath);
        const confirmedDirectoryPaths = [];

        for (const possibleDirectoryName of possibleDirectoryNames) {
            const possibleDirectoryPath = this.combinePath([directoryPath, possibleDirectoryName]);

            try {
                if (fs.lstatSync(possibleDirectoryPath).isDirectory()) {
                    confirmedDirectoryPaths.push(possibleDirectoryPath);
                }
            } catch (e) {
                if (continueOnError === undefined || continueOnError === null || !continueOnError) {
                    throw e;
                }

                if (errors !== undefined && errors !== null) {
                    if (e instanceof Error) {
                        errors.push(e);
                    }
                }
            }
        }

        return confirmedDirectoryPaths;
    }

    getFileSizeInBytes(filePath) {
        const stats = fs.statSync(filePath);
        return stats.size;
    }

    getFileName(fileNameOrPath) {
        return path.basename(fileNameOrPath);
    }

    getFileNameWithoutExtension(fileNameOrPath) {
        const extension = path.extname(fileNameOrPath);
        return path.basename(fileNameOrPath, extension);
    }

    async deleteFileIfExistsAsync(filePath) {
        if (fs.existsSync(filePath)) {
            await fs.unlink(filePath);
        }
    }

    async getFileContentAsBufferAsync(filePath) {
        return await fs.readFile(filePath);
    }

    getDirectoryPath(directoryOrFilePath) {
        return path.dirname(directoryOrFilePath);
    }
}

exports.FileAccess = FileAccess;
