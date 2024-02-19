class FolderRepositoryMock {
    getFoldersCalls = 0;
    getFoldersReturnValues = [];

    getFolders() {
        this.getFoldersCalls++;
        return this.getFoldersReturnValues;
    }
}

exports.FolderRepositoryMock = FolderRepositoryMock;
