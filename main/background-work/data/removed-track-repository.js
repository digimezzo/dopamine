class RemovedTrackRepository {
    constructor(databaseFactory) {
        this.databaseFactory = databaseFactory;
    }

    addRemovedTrack(removedTrack) {
        const database = this.databaseFactory.create();
        const statement = database.prepare('INSERT INTO RemovedTrack (TrackID, Path, SafePath, DateRemoved) VALUES (?, ?, ?, ?);');
        statement.run(removedTrack.trackId, removedTrack.path, removedTrack.path.toLowerCase(), removedTrack.dateRemoved);
    }

    deleteRemovedTrackByTrackId(trackId) {
        const database = this.databaseFactory.create();
        const statement = database.prepare('DELETE FROM RemovedTrack WHERE TrackID=?;');
        statement.run(trackId);
    }

    getRemovedTracks() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`SELECT TrackID as trackId, Path as path, DateRemoved as dateRemoved FROM RemovedTrack;`);
        return statement.all();
    }
}

exports.RemovedTrackRepository = RemovedTrackRepository;
