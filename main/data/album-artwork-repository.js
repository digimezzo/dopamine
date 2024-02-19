class AlbumArtworkRepository {
    constructor(databaseFactory) {
        this.databaseFactory = databaseFactory;
    }

    addAlbumArtwork(albumArtwork) {
        const database = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);');
        statement.run(albumArtwork.albumKey, albumArtwork.artworkId);
    }

    getAllAlbumArtwork() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId
            FROM AlbumArtwork;`,
        );

        return statement.all();
    }

    getNumberOfAlbumArtwork() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork;`);
        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    getNumberOfAlbumArtworkThatHasNoTrack() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfAlbumArtwork
            FROM AlbumArtwork
            WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);`,
        );

        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    deleteAlbumArtworkThatHasNoTrack() {
        const database = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM AlbumArtwork WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);');

        const info = statement.run();

        return info.changes;
    }

    getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const result = statement.get();

        return result.numberOfAlbumArtwork;
    }

    deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(`DELETE FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const info = statement.run();

        return info.changes;
    }
}

exports.AlbumArtworkRepository = AlbumArtworkRepository;
