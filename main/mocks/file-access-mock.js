class FileAccessMock {
    combinePathCalls = [];
    combinePathReturnValue = '';

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

    combinePath(...args) {
        this.combinePathCalls.push(args);
        return this.combinePathReturnValue;
    }

    async getFilesInDirectoryAsync(directoryPath, continueOnError, errors) {
        return [];
    }

    async getDirectoriesInDirectoryAsync(directoryPath, continueOnError, errors) {
        return [];
    }

    getFileSizeInBytes(filePath) {
        return 0;
    }

    getFileName(fileNameOrPath) {
        return '';
    }

    getFileNameWithoutExtension(fileNameOrPath) {
        return '';
    }

    async deleteFileIfExistsAsync(filePath) {}

    async getFileContentAsBufferAsync(filePath) {
        return Buffer.from([]);
    }

    getDirectoryPath(directoryOrFilePath) {
        return '';
    }
}

exports.FileAccessMock = FileAccessMock;
