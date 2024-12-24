class FolderTrackRepository {
    constructor(databaseFactory) {
        this.databaseFactory = databaseFactory;
    }

    addFolderTrack(folderTrack) {
        const database = this.databaseFactory.create();
        const statement = database.prepare('INSERT INTO FolderTrack (FolderID, TrackID) VALUES (?, ?);');
        statement.run(folderTrack.folderId, folderTrack.trackId);
    }

    getNumberOfFolderTracksForInexistingTracks() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(
            'SELECT COUNT(*) AS numberOfFolderTracks FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);',
        );

        const result = statement.get();

        return result.numberOfFolderTracks;
    }

    deleteFolderTracksForInexistingTracks() {
        const database = this.databaseFactory.create();
        const statement = database.prepare('DELETE FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);');
        const info = statement.run();

        return info.changes;
    }
}

exports.FolderTrackRepository = FolderTrackRepository;
