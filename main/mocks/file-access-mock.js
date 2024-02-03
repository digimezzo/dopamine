class FileAccessMock {
    combinePathCalls = [];
    combinePathReturnValue = '';
    getFileNameReturnValues = {};
    getDirectoryPathReturnValues = {};
    getFilesInDirectoryAsyncReturnValues = {};
    getFileNameWithoutExtensionReturnValues = {};
    getFileSizeInBytesReturnValues = {};
    getDateModifiedInTicksReturnValues = {};
    getDirectoriesInDirectoryAsyncReturnValues = {};

    reset() {
        this.combinePathCalls = [];
        this.combinePathReturnValue = '';
        this.getFileNameReturnValues = {};
        this.getDirectoryPathReturnValues = {};
        this.getFilesInDirectoryAsyncReturnValues = {};
        this.getFileNameWithoutExtensionReturnValues = {};
        this.getFileSizeInBytesReturnValues = {};
        this.getDateModifiedInTicksReturnValues = {};
        this.getDirectoriesInDirectoryAsyncReturnValues = {};
    }

    pathExists(pathToCheck) {
        return '';
    }

    getFileExtension(fileNameOrPath) {
        return '';
    }

    getDateModifiedInTicks(fileOrDirectory) {
        return this.getDateModifiedInTicksReturnValues[fileOrDirectory];
    }

    getDateCreatedInTicks(fileOrDirectory) {
        return 0;
    }

    combinePath(pathPieces) {
        this.combinePathCalls.push(pathPieces);
        return this.combinePathReturnValue;
    }

    async getFilesInDirectoryAsync(directoryPath, continueOnError, errors) {
        if (this.getFilesInDirectoryAsyncReturnValues[directoryPath] === 'throw') {
            throw new Error('Error');
        }

        return this.getFilesInDirectoryAsyncReturnValues[directoryPath];
    }

    async getDirectoriesInDirectoryAsync(directoryPath, continueOnError, errors) {
        return this.getDirectoriesInDirectoryAsyncReturnValues[directoryPath];
    }

    getFileSizeInBytes(filePath) {
        return this.getFileSizeInBytesReturnValues[filePath];
    }

    getFileName(fileNameOrPath) {
        return this.getFileNameReturnValues[fileNameOrPath];
    }

    getFileNameWithoutExtension(fileNameOrPath) {
        return this.getFileNameWithoutExtensionReturnValues[fileNameOrPath];
    }

    async deleteFileIfExistsAsync(filePath) {}

    async getFileContentAsBufferAsync(filePath) {
        return Buffer.from([]);
    }

    getDirectoryPath(directoryOrFilePath) {
        return this.getDirectoryPathReturnValues[directoryOrFilePath];
    }
}

exports.FileAccessMock = FileAccessMock;
