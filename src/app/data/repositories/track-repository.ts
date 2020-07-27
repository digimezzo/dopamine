import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { Track } from '../entities/track';
import { BaseTrackRepository } from './base-track-repository';

@Injectable({
    providedIn: 'root'
})
export class TrackRepository implements BaseTrackRepository {
    constructor(private databaseFactory: DatabaseFactory) {
    }

    public getNumberOfTracksThatNeedIndexing(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfTracksThatNeedIndexing
             FROM Track
             WHERE NeedsIndexing=?`);

        const result: any = statement.get(1);

        return result.numberOfTracksThatNeedIndexing;
    }

    public getNumberOfTracks(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT COUNT(*) AS numberOfTracks FROM Track');

        const result: any = statement.get();

        return result.numberOfTracks;
    }

    public getMaximumDateFileModified(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT MAX(DateFileModified) AS maximumDateFileModified FROM Track');

        const result: any = statement.get();

        return result.maximumDateFileModified;
    }

    public deleteTracksThatDoNotBelongFolders(): number {
        const database: any = this.databaseFactory.create();
        const statement: any = database.prepare(`DELETE FROM Track WHERE TrackID NOT IN (
                                                 SELECT TrackID
                                                 FROM FolderTrack
                                                 WHERE FolderID NOT IN (SELECT FolderID FROM Folder))`);

        const info = statement.run();

        return info.changes;
    }

    public deleteTrack(trackId: number): void {
        const database: any = this.databaseFactory.create();
        database.prepare('DELETE FROM Track WHERE TrackID = ?').run(trackId);
    }

    public getTracks(): Track[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT TrackID AS trackId,
                    Artists AS artists,
                    Genres AS genres,
                    AlbumTitle AS albumTitle,
                    AlbumArtists AS albumArtists,
                    AlbumKey AS albumKey,
                    Path AS path,
                    FileName AS fileName,
                    MimeType AS mimeType,
                    FileSize AS fileSize,
                    BitRate AS bitRate,
                    SampleRate AS sampleRate,
                    TrackTitle AS trackTitle,
                    TrackNumber AS trackNumber,
                    TrackCount AS trackCount,
                    DiscNumber AS discNumber,
                    DiscCount AS discCount,
                    Duration AS duration,
                    Year AS year,
                    HasLyrics AS hasLyrics,
                    DateAdded AS dateAdded,
                    DateFileCreated AS dateFileCreated,
                    DateLastSynced AS dateLastSynced,
                    DateFileModified AS dateFileModified,
                    NeedsIndexing AS needsIndexing,
                    NeedsAlbumArtworkIndexing AS needsAlbumArtworkIndexing,
                    IndexingSuccess AS indexingSuccess,
                    IndexingFailureReason AS indexingFailureReason,
                    Rating AS rating,
                    Love AS love,
                    PlayCount AS playCount,
                    SkipCount AS skipCount,
                    DateLastPlayed AS dateLastPlayed
                    FROM Track`);

        const tracks: Track[] = statement.all();

        return tracks;
    }

    public updateTrack(track: Track): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `UPDATE Track
                SET Artists='${track.artists}',
                Genres='${track.genres}',
                AlbumTitle='${track.albumTitle}',
                AlbumArtists='${track.albumArtists}',
                AlbumKey='${track.albumKey}',
                Path='${track.path}',
                FileName='${track.fileName}',
                MimeType='${track.mimeType}',
                FileSize=${track.fileSize},
                BitRate=${track.bitRate},
                SampleRate=${track.sampleRate},
                TrackTitle='${track.trackTitle}',
                TrackNumber=${track.trackNumber},
                TrackCount=${track.trackCount},
                DiscNumber=${track.discNumber},
                DiscCount=${track.discCount},
                Duration=${track.duration},
                Year=${track.year},
                HasLyrics=${track.hasLyrics},
                DateAdded=${track.dateAdded},
                DateFileCreated=${track.dateFileCreated},
                DateLastSynced=${track.dateLastSynced},
                DateFileModified=${track.dateFileModified},
                NeedsIndexing=${track.needsIndexing},
                NeedsAlbumArtworkIndexing=${track.needsAlbumArtworkIndexing},
                IndexingSuccess=${track.indexingSuccess},
                IndexingFailureReason='${track.indexingFailureReason}',
                Rating=${track.rating},
                Love=${track.love},
                PlayCount=${track.playCount},
                SkipCount=${track.skipCount},
                DateLastPlayed=${track.dateLastPlayed}
                WHERE TrackID=?`);

        statement.run(track.trackId);
    }

    public addTrack(track: Track): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `INSERT INTO Track(
                    Artists,
                    Genres,
                    AlbumTitle,
                    AlbumArtists,
                    AlbumKey,
                    Path,
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
                    SkipCountSkipCount,
                    DateLastPlayed
                ) VALUES (
                    '${track.artists}',
                    '${track.genres}',
                    '${track.albumTitle}',
                    '${track.albumArtists}',
                    '${track.albumKey}',
                    '${track.path}',
                    '${track.fileName}',
                    '${track.mimeType}',
                    ${track.fileSize},
                    ${track.bitRate},
                    ${track.sampleRate},
                    '${track.trackTitle}',
                    ${track.trackNumber},
                    ${track.trackCount},
                    ${track.discNumber},
                    ${track.discCount},
                    ${track.duration},
                    ${track.year},
                    ${track.hasLyrics},
                    ${track.dateAdded},
                    ${track.dateFileCreated},
                    ${track.dateLastSynced},
                    ${track.dateFileModified},
                    ${track.needsIndexing},
                    ${track.needsAlbumArtworkIndexing},
                    ${track.indexingSuccess},
                    '${track.indexingFailureReason}',
                    ${track.rating},
                    ${track.love},
                    ${track.playCount},
                    ${track.skipCount},
                    ${track.dateLastPlayed}
                )`);

        statement.run();
    }
}
