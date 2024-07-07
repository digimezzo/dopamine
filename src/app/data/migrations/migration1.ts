import { Migration } from '../migration';

export class Migration1 extends Migration {
    public id: number = 1;
    public name: string = 'Migration1';

    public up(): void {
        this.sql(`CREATE TABLE Folder (
                        FolderID            INTEGER PRIMARY KEY AUTOINCREMENT,
                        Path                TEXT,
                        SafePath            TEXT,
                        ShowInCollection    INTEGER);`);

        this.sql(`CREATE TABLE Track (
                        TrackID	                    INTEGER,
                        Artists	                    TEXT,
                        Genres	                    TEXT,
                        AlbumTitle	                TEXT,
                        AlbumArtists	            TEXT,
                        AlbumKey	                TEXT,
                        Path	                    TEXT,
                        SafePath	                TEXT,
                        FileName	                TEXT,
                        MimeType	                TEXT,
                        FileSize	                INTEGER,
                        BitRate	                    INTEGER,
                        SampleRate	                INTEGER,
                        TrackTitle	                TEXT,
                        TrackNumber	                INTEGER,
                        TrackCount	                INTEGER,
                        DiscNumber	                INTEGER,
                        DiscCount	                INTEGER,
                        Duration	                INTEGER,
                        Year	                    INTEGER,
                        HasLyrics	                INTEGER,
                        DateAdded  	                INTEGER,
                        DateFileCreated  	        INTEGER,
                        DateLastSynced	            INTEGER,
                        DateFileModified	        INTEGER,
                        NeedsIndexing 	            INTEGER,
                        NeedsAlbumArtworkIndexing   INTEGER,
                        IndexingSuccess             INTEGER,
                        IndexingFailureReason       TEXT,
                        Rating                      INTEGER,
                        Love                        INTEGER,
                        PlayCount                   INTEGER,
                        SkipCount                   INTEGER,
                        DateLastPlayed              INTEGER,
                        PRIMARY KEY(TrackID));`);

        this.sql('CREATE INDEX TrackPathIndex ON Track(Path);');
        this.sql('CREATE INDEX TrackSafePathIndex ON Track(SafePath);');

        this.sql(`CREATE TABLE AlbumArtwork (
                        AlbumArtworkID	    INTEGER,
                        AlbumKey	        TEXT,
                        ArtworkID	        TEXT,
                        PRIMARY KEY(AlbumArtworkID));`);

        this.sql(`CREATE TABLE FolderTrack (
                        FolderTrackID      INTEGER PRIMARY KEY AUTOINCREMENT,
                        FolderID	        INTEGER,
                        TrackID	            INTEGER);`);

        this.sql(`CREATE TABLE RemovedTrack (
                        TrackID	            INTEGER,
                        Path	            TEXT,
                        SafePath	        TEXT,
                        DateRemoved         INTEGER,
                        PRIMARY KEY(TrackID));`);

        this.sql(`CREATE TABLE QueuedTrack (
                        QueuedTrackID       INTEGER,
                        Path	            TEXT,
                        SafePath	        TEXT,
                        IsPlaying           INTEGER,
                        ProgressSeconds     INTEGER,
                        OrderID             INTEGER,
                        PRIMARY KEY(QueuedTrackID));`);

        this.sql(`CREATE TABLE TrackStatistic (
                        TrackStatisticID	INTEGER PRIMARY KEY AUTOINCREMENT,
                        Path	            TEXT,
                        SafePath	        TEXT,
                        Rating	            INTEGER,
                        Love	            INTEGER,
                        PlayCount	        INTEGER,
                        SkipCount	        INTEGER,
                        DateLastPlayed      INTEGER);`);

        this.sql('CREATE INDEX TrackStatisticSafePathIndex ON TrackStatistic(SafePath);');
    }

    public down(): void {
        this.sql('DROP TABLE Folder;');
        this.sql('DROP TABLE Track;');
        this.sql('DROP INDEX TrackPathIndex;');
        this.sql('DROP INDEX TrackSafePathIndex;');
        this.sql('DROP TABLE AlbumArtwork;');
        this.sql('DROP TABLE FolderTrack;');
        this.sql('DROP TABLE RemovedTrack;');
        this.sql('DROP TABLE QueuedTrack;');
        this.sql('DROP TABLE TrackStatistic;');
        this.sql('DROP INDEX TrackStatisticSafePathIndex;');
    }
}
