const { QueryParts } = require('./query-parts');

class TrackRepository {
    constructor(databaseFactory) {
        this.databaseFactory = databaseFactory;
    }

    getNumberOfTracksThatNeedIndexing() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`SELECT COUNT(*) AS numberOfTracks FROM Track WHERE NeedsIndexing=?;`);
        const result = statement.get(1);

        return result.numberOfTracks;
    }

    getNumberOfTracks() {
        const database = this.databaseFactory.create();
        const statement = database.prepare('SELECT COUNT(*) AS numberOfTracks FROM Track;');
        const result = statement.get();

        return result.numberOfTracks;
    }

    getMaximumDateFileModified() {
        const database = this.databaseFactory.create();
        const statement = database.prepare('SELECT MAX(DateFileModified) AS maximumDateFileModified FROM Track;');
        const result = statement.get();

        return result.maximumDateFileModified;
    }

    getNumberOfTracksThatDoNotBelongFolders() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfTracks
        FROM Track WHERE TrackID IN (
            SELECT TrackID
            FROM FolderTrack
            WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`);

        const result = statement.get();

        return result.numberOfTracks;
    }

    deleteTracksThatDoNotBelongFolders() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(
            `DELETE FROM Track WHERE TrackID IN (
                SELECT TrackID
                FROM FolderTrack
                WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`,
        );

        const info = statement.run();

        return info.changes;
    }

    getAllTracks() {
        const database = this.databaseFactory.create();
        const statement = database.prepare(QueryParts.selectTracksQueryPart(false));

        return statement.all();
    }

    deleteTrack(trackId) {
        const database = this.databaseFactory.create();
        database.prepare('DELETE FROM Track WHERE TrackID = ?;').run(trackId);
    }

    updateTrack(track) {
        const database = DatabaseFactory.create();

        const statement = database.prepare(
            `UPDATE Track
                SET Artists=@artists,
                Genres=@genres,
                AlbumTitle=@albumTitle,
                AlbumArtists=@albumArtists,
                AlbumKey=@albumKey,
                Path=@path,
                SafePath=@safePath,
                FileName=@fileName,
                MimeType=@mimeType,
                FileSize=@fileSize,
                BitRate=@bitRate,
                SampleRate=@sampleRate,
                TrackTitle=@trackTitle,
                TrackNumber=@trackNumber,
                TrackCount=@trackCount,
                DiscNumber=@discNumber,
                DiscCount=@discCount,
                Duration=@duration,
                Year=@year,
                HasLyrics=@hasLyrics,
                DateAdded=@dateAdded,
                DateFileCreated=@dateFileCreated,
                DateLastSynced=@dateLastSynced,
                DateFileModified=@dateFileModified,
                NeedsIndexing=@needsIndexing,
                NeedsAlbumArtworkIndexing=@needsAlbumArtworkIndexing,
                IndexingSuccess=@indexingSuccess,
                IndexingFailureReason=@indexingFailureReason,
                Rating=@rating,
                Love=@love,
                PlayCount=@playCount,
                SkipCount=@skipCount,
                DateLastPlayed=@dateLastPlayed
                WHERE TrackID=@trackId;`,
        );

        statement.run({
            trackId: track.trackId,
            artists: track.artists,
            genres: track.genres,
            albumTitle: track.albumTitle,
            albumArtists: track.albumArtists,
            albumKey: track.albumKey,
            path: track.path,
            safePath: track.path.toLowerCase(),
            fileName: track.fileName,
            mimeType: track.mimeType,
            fileSize: track.fileSize,
            bitRate: track.bitRate,
            sampleRate: track.sampleRate,
            trackTitle: track.trackTitle,
            trackNumber: track.trackNumber,
            trackCount: track.trackCount,
            discNumber: track.discNumber,
            discCount: track.discCount,
            duration: track.duration,
            year: track.year,
            hasLyrics: track.hasLyrics,
            dateAdded: track.dateAdded,
            dateFileCreated: track.dateFileCreated,
            dateLastSynced: track.dateLastSynced,
            dateFileModified: track.dateFileModified,
            needsIndexing: track.needsIndexing,
            needsAlbumArtworkIndexing: track.needsAlbumArtworkIndexing,
            indexingSuccess: track.indexingSuccess,
            indexingFailureReason: track.indexingFailureReason,
            rating: track.rating,
            love: track.love,
            playCount: track.playCount,
            skipCount: track.skipCount,
            dateLastPlayed: track.dateLastPlayed,
        });
    }

    addTrack(track) {
        const database = this.databaseFactory.create();

        const statement = database.prepare(
            `INSERT INTO Track(
                    Artists,
                    Genres,
                    AlbumTitle,
                    AlbumArtists,
                    AlbumKey,
                    Path,
                    SafePath,
                    FileName,
                    MimeType,
                    FileSize,
                    BitRate,
                    SampleRate,
                    TrackTitle,
                    TrackNumber,
                    TrackCount,
                    DiscNumber,
                    DiscCount,
                    Duration,
                    Year,
                    HasLyrics,
                    DateAdded,
                    DateFileCreated,
                    DateLastSynced,
                    DateFileModified,
                    NeedsIndexing,
                    NeedsAlbumArtworkIndexing,
                    IndexingSuccess,
                    IndexingFailureReason,
                    Rating,
                    Love,
                    PlayCount,
                    SkipCount,
                    DateLastPlayed
                ) VALUES (
                    @artists,
                    @genres,
                    @albumTitle,
                    @albumArtists,
                    @albumKey,
                    @path,
                    @safePath,
                    @fileName,
                    @mimeType,
                    @fileSize,
                    @bitRate,
                    @sampleRate,
                    @trackTitle,
                    @trackNumber,
                    @trackCount,
                    @discNumber,
                    @discCount,
                    @duration,
                    @year,
                    @hasLyrics,
                    @dateAdded,
                    @dateFileCreated,
                    @dateLastSynced,
                    @dateFileModified,
                    @needsIndexing,
                    @needsAlbumArtworkIndexing,
                    @indexingSuccess,
                    @indexingFailureReason,
                    @rating,
                    @love,
                    @playCount,
                    @skipCount,
                    @dateLastPlayed
                );`,
        );

        statement.run({
            artists: track.artists,
            genres: track.genres,
            albumTitle: track.albumTitle,
            albumArtists: track.albumArtists,
            albumKey: track.albumKey,
            path: track.path,
            safePath: track.path.toLowerCase(),
            fileName: track.fileName,
            mimeType: track.mimeType,
            fileSize: track.fileSize,
            bitRate: track.bitRate,
            sampleRate: track.sampleRate,
            trackTitle: track.trackTitle,
            trackNumber: track.trackNumber,
            trackCount: track.trackCount,
            discNumber: track.discNumber,
            discCount: track.discCount,
            duration: track.duration,
            year: track.year,
            hasLyrics: track.hasLyrics,
            dateAdded: track.dateAdded,
            dateFileCreated: track.dateFileCreated,
            dateLastSynced: track.dateLastSynced,
            dateFileModified: track.dateFileModified,
            needsIndexing: track.needsIndexing,
            needsAlbumArtworkIndexing: track.needsAlbumArtworkIndexing,
            indexingSuccess: track.indexingSuccess,
            indexingFailureReason: track.indexingFailureReason,
            rating: track.rating,
            love: track.love,
            playCount: track.playCount,
            skipCount: track.skipCount,
            dateLastPlayed: track.dateLastPlayed,
        });
    }

    getTrackByPath(path) {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(false)} WHERE t.Path=?;`);
        return statement.get(path);
    }

    disableNeedsAlbumArtworkIndexing(albumKey) {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`UPDATE Track SET NeedsAlbumArtworkIndexing=0 WHERE AlbumKey=?;`);
        statement.run(albumKey);
    }

    getLastModifiedTrackForAlbumKeyAsync(albumKey) {
        const database = this.databaseFactory.create();
        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(false)} WHERE t.AlbumKey=?;`);
        return statement.get(albumKey);
    }

    getAlbumDataThatNeedsIndexing() {
        const database = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart(false)}
                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                AND (t.AlbumKey NOT IN (SELECT AlbumKey FROM AlbumArtwork) OR NeedsAlbumArtworkIndexing=1)
                GROUP BY t.AlbumKey;`,
        );

        return statement.all();
    }

    enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover) {
        const database = this.databaseFactory.create();
        let statement;

        if (onlyWhenHasNoCover) {
            statement = database.prepare(
                `UPDATE Track SET NeedsAlbumArtworkIndexing=1 WHERE AlbumKey NOT IN (SELECT AlbumKey FROM AlbumArtwork);`,
            );
        } else {
            statement = database.prepare(`UPDATE Track SET NeedsAlbumArtworkIndexing=1;`);
        }

        statement.run();
    }
}

exports.TrackRepository = TrackRepository;
