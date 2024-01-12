const { DatabaseFactory } = require('./database-factory');

class RemovedTrackRepository {
    static addRemovedTrack(removedTrack) {
        const database = DatabaseFactory.create();
        const statement = database.prepare('INSERT INTO RemovedTrack (TrackID, Path, SafePath, DateRemoved) VALUES (?, ?, ?, ?);');
        statement.run(removedTrack.trackId, removedTrack.path, removedTrack.path.toLowerCase(), removedTrack.dateRemoved);
    }

    static deleteRemovedTrackByTrackId(trackId) {
        const database = DatabaseFactory.create();
        const statement = database.prepare('DELETE FROM RemovedTrack WHERE TrackID=?;');
        statement.run(trackId);
    }

    static getRemovedTracks() {
        const database = DatabaseFactory.create();
        const statement = database.prepare(`SELECT TrackID as trackId, Path as path, DateRemoved as dateRemoved FROM RemovedTrack;`);
        return statement.all();
    }
}

exports.RemovedTrackRepository = RemovedTrackRepository;
