class DirectoryWalkerMock {
    getFilesInDirectoryAsyncCalls = [];
    getFilesInDirectoryAsyncReturnValues = {};

    recursivelyGetFilesInDirectoryAsyncCalls = [];
    recursivelyGetFilesInDirectoryAsyncReturnValues = {};

    async getFilesInDirectoryAsync(directoryPath) {
        this.getFilesInDirectoryAsyncCalls.push(directoryPath);
        return this.getFilesInDirectoryAsyncReturnValues[directoryPath];
    }

    async recursivelyGetFilesInDirectoryAsync(directoryPath, filePaths, errors) {
        this.recursivelyGetFilesInDirectoryAsyncCalls.push({ directoryPath });
        return this.recursivelyGetFilesInDirectoryAsyncReturnValues[directoryPath];
    }
}

exports.DirectoryWalkerMock = DirectoryWalkerMock;
