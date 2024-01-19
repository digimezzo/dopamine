const { DatabaseFactory } = require('./database.factory');

class FolderTrackRepository {
    static addFolderTrack(folderTrack) {
        const database = DatabaseFactory.create();
        const statement = database.prepare('INSERT INTO FolderTrack (FolderID, TrackID) VALUES (?, ?);');
        statement.run(folderTrack.folderId, folderTrack.trackId);
    }

    static getNumberOfFolderTracksForInexistingTracks() {
        const database = DatabaseFactory.create();

        const statement = database.prepare(
            'SELECT COUNT(*) AS numberOfFolderTracks FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);',
        );

        const result = statement.get();

        return result.numberOfFolderTracks;
    }

    static deleteFolderTracksForInexistingTracks() {
        const database = DatabaseFactory.create();
        const statement = database.prepare('DELETE FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);');
        const info = statement.run();

        return info.changes;
    }
}

exports.FolderTrackRepository = FolderTrackRepository;
