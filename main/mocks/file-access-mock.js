class FileAccessMock {
    combinePathCalls = [];
    combinePathReturnValue = '';
    getFileNameReturnValues = {};
    getDirectoryPathReturnValues = {};
    getFilesInDirectoryAsyncReturnValues = {};
    getFileNameWithoutExtensionReturnValues = {};

    reset() {
        this.combinePathCalls = [];
        this.combinePathReturnValue = '';
        this.getFileNameReturnValues = {};
        this.getDirectoryPathReturnValues = {};
        this.getFilesInDirectoryAsyncReturnValues = {};
    }

    pathExists(pathToCheck) {
        return '';
    }

    getFileExtension(fileNameOrPath) {
        return '';
    }

    getDateModifiedInTicks(fileOrDirectory) {
        return 0;
    }

    getDateCreatedInTicks(fileOrDirectory) {
        return 0;
    }

    combinePath(pathPieces) {
        this.combinePathCalls.push(pathPieces);
        return this.combinePathReturnValue;
    }

    async getFilesInDirectoryAsync(directoryPath, continueOnError, errors) {
        return this.getFilesInDirectoryAsyncReturnValues[directoryPath];
    }

    async getDirectoriesInDirectoryAsync(directoryPath, continueOnError, errors) {
        return [];
    }

    getFileSizeInBytes(filePath) {
        return 0;
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
