const { DatabaseFactory } = require('../database-factory');

class AlbumArtworkRepository {
    static addAlbumArtwork(albumArtwork) {
        const database = DatabaseFactory.create();

        const statement = database.prepare('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);');
        statement.run(albumArtwork.albumKey, albumArtwork.artworkId);
    }

    static getAllAlbumArtwork() {
        const database = DatabaseFactory.create();

        const statement = database.prepare(
            `SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId
            FROM AlbumArtwork;`,
        );

        return statement.all();
    }

    static getNumberOfAlbumArtwork() {
        const database = DatabaseFactory.create();
        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork;`);
        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    static getNumberOfAlbumArtworkThatHasNoTrack() {
        const database = DatabaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfAlbumArtwork
            FROM AlbumArtwork
            WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);`,
        );

        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    static deleteAlbumArtworkThatHasNoTrack() {
        const database = DatabaseFactory.create();

        const statement = database.prepare('DELETE FROM AlbumArtwork WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);');

        const info = statement.run();

        return info.changes;
    }

    static getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        const database = DatabaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    static deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        const database = DatabaseFactory.create();

        const statement = database.prepare(`DELETE FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const info = statement.run();

        return info.changes;
    }
}

exports.AlbumArtworkRepository = AlbumArtworkRepository;
