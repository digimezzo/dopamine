const { TagLibFileMetadata } = require('./tag-lib-file-metadata');

class FileMetadataFactory {
    create(path) {
        return new TagLibFileMetadata(path);
    }
}

exports.FileMetadataFactory = FileMetadataFactory;
