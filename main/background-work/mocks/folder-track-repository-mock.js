class FolderTrackRepositoryMock {
    addFolderTrackCalls = [];

    getNumberOfFolderTracksForInexistingTracksCalls = 0;
    getNumberOfFolderTracksForInexistingTracksReturnValue = undefined;

    deleteFolderTracksForInexistingTracksCalls = 0;
    deleteFolderTracksForInexistingTracksReturnValue = 0;

    addFolderTrack(folderTrack) {
        this.addFolderTrackCalls.push(`${folderTrack.folderId};${folderTrack.trackId}`);
    }

    getNumberOfFolderTracksForInexistingTracks() {
        this.getNumberOfFolderTracksForInexistingTracksCalls++;
        return this.getNumberOfFolderTracksForInexistingTracksReturnValue;
    }

    deleteFolderTracksForInexistingTracks() {
        this.deleteFolderTracksForInexistingTracksCalls++;
        return this.deleteFolderTracksForInexistingTracksReturnValue;
    }
}

exports.FolderTrackRepositoryMock = FolderTrackRepositoryMock;
