class TrackFillerMock {
    addFileMetadataToTrackCalls = [];
    addFileMetadataToTrackReturnValues = {};

    addFileMetadataToTrack(track, fillOnlyEssentialMetadata) {
        this.addFileMetadataToTrackCalls.push(`${track.path};${fillOnlyEssentialMetadata}`);
        return this.addFileMetadataToTrackReturnValues[`${track.path};${fillOnlyEssentialMetadata}`];
    }
}

exports.TrackFillerMock = TrackFillerMock;
