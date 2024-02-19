class LastfmApiMock {
    getAlbumInfoAsyncReturnValues = {};
    getAlbumInfoAsyncThrowsError = false;

    async getAlbumInfoAsync(artist, album, autoCorrect, languageCode) {
        if (this.getAlbumInfoAsyncThrowsError) {
            throw new Error('Error while getting album info');
        } else {
            return this.getAlbumInfoAsyncReturnValues[`${artist};${album};${autoCorrect};${languageCode}`];
        }
    }
}

exports.LastfmApiMock = LastfmApiMock;
