const { StringUtils } = require('../common/utils/string-utils');

class ExternalAlbumArtworkGetterMock {
    getExternalArtworkAsyncReturnValues = {};

    async getExternalArtworkAsync(fileMetadata) {
        return this.getExternalArtworkAsyncReturnValues[fileMetadata.path];
    }
}

exports.ExternalAlbumArtworkGetterMock = ExternalAlbumArtworkGetterMock;
