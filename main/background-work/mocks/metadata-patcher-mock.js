class MetadataPatcherMock {
    joinUnsplittableMetadataCalls = 0;
    joinUnsplittableMetadataReturnValues = {};

    joinUnsplittableMetadata(possiblySplittedMetadata) {
        this.joinUnsplittableMetadataCalls++;
        return this.joinUnsplittableMetadataReturnValues[possiblySplittedMetadata.join(',')];
    }
}

exports.MetadataPatcherMock = MetadataPatcherMock;
