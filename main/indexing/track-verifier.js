const { FileAccess } = require('../common/io/file-access');

class TrackVerifier {
    static isTrackOutOfDate(track) {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== FileAccess.getFileSizeInBytes(track.path)) {
            return true;
        }

        return track.dateFileModified !== FileAccess.getDateModifiedInTicks(track.path);
    }

    static doesTrackNeedIndexing(track) {
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
