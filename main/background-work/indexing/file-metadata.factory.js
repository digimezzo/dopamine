const { readMetadata } = require('../../metadata/music-metadata-adapter');
class FileMetadataFactory {
    async create(path) {
        return readMetadata(path);
    }
}
exports.FileMetadataFactory = FileMetadataFactory;
