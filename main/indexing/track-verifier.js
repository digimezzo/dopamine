class TrackVerifier {
    constructor(fileAccess) {
        this.fileAccess = fileAccess;
    }

    isTrackOutOfDate(track) {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== this.fileAccess.getFileSizeInBytes(track.path)) {
            return true;
        }

        return track.dateFileModified !== this.fileAccess.getDateModifiedInTicks(track.path);
    }

    doesTrackNeedIndexing(track) {
        if (track.needsIndexing === undefined || track.needsIndexing === null) {
            return true;
        }

        if (Number.isNaN(track.needsIndexing)) {
            return true;
        }

        return track.needsIndexing === 1;
    }
}

exports.TrackVerifier = TrackVerifier;
