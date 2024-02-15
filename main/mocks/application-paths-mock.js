class ApplicationPathsMock {
    getCoverArtCacheFullPathCalls = 0;
    getCoverArtCacheFullPathReturnValue = '';

    getCoverArtCacheFullPath() {
        this.getCoverArtCacheFullPathCalls++;
        return this.getCoverArtCacheFullPathReturnValue;
    }
}

exports.ApplicationPathsMock = ApplicationPathsMock;
