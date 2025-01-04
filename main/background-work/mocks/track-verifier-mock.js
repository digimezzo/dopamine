class TrackVerifierMock {
    isTrackOutOfDateCalls = [];
    isTrackOutOfDateReturnValues = {};

    doesTrackNeedIndexingCalls = [];
    doesTrackNeedIndexingReturnValues = {};

    isTrackOutOfDate(track) {
        this.isTrackOutOfDateCalls.push(track.path);
        return this.isTrackOutOfDateReturnValues[track.path];
    }

    doesTrackNeedIndexing(track) {
        this.doesTrackNeedIndexingCalls.push(track.path);
        return this.doesTrackNeedIndexingReturnValues[track.path];
    }
}

exports.TrackVerifierMock = TrackVerifierMock;
