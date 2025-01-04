class ExternalArtworkPathGetterMock {
    getExternalArtworkPathAsyncReturnValues = {};

    async getExternalArtworkPathAsync(audioFilePath) {
        return this.getExternalArtworkPathAsyncReturnValues[audioFilePath];
    }
}

exports.ExternalArtworkPathGetterMock = ExternalArtworkPathGetterMock;
