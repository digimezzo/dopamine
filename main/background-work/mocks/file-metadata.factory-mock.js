class FileMetadataFactoryMock {
    createCalls = [];
    createReturnValues = {};

    create(path) {
        this.createCalls.push(path);
        return this.createReturnValues[path];
    }
}

exports.FileMetadataFactoryMock = FileMetadataFactoryMock;
