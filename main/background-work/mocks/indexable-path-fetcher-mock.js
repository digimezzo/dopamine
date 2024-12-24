class IndexablePathFetcherMock {
    getIndexablePathsForAllFoldersAsyncCalls = 0;
    getIndexablePathsForAllFoldersAsyncReturnValue = [];
    getIndexablePathsForSingleFolderAsyncCalls = {};
    getIndexablePathsForSingleFolderAsyncReturnValues = {};

    async getIndexablePathsForAllFoldersAsync() {
        this.getIndexablePathsForAllFoldersAsyncCalls++;

        return this.getIndexablePathsForAllFoldersAsyncReturnValue;
    }

    async getIndexablePathsForSingleFolderAsync(folder, validFileExtensions) {
        this.getIndexablePathsForSingleFolderAsyncCalls.push(`${folder};${validFileExtensions}`);

        return this.getIndexablePathsForSingleFolderAsyncReturnValues[`${folder};${validFileExtensions}`];
    }
}

exports.IndexablePathFetcherMock = IndexablePathFetcherMock;
