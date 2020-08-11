import { Injectable } from '@angular/core';
import { AlbumData } from '../album-data';
import { DatabaseFactory } from '../database-factory';
import { Track } from '../entities/track';
import { QueryParts } from '../query-parts';
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
             WHERE NeedsIndexing=?;`);

        const result: any = statement.get(1);

        return result.numberOfTracksThatNeedIndexing;
    }

    public getNumberOfTracks(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT COUNT(*) AS numberOfTracks FROM Track;');

        const result: any = statement.get();

        return result.numberOfTracks;
    }

    public getMaximumDateFileModified(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT MAX(DateFileModified) AS maximumDateFileModified FROM Track;');

        const result: any = statement.get();

        return result.maximumDateFileModified;
    }

    public deleteTracksThatDoNotBelongFolders(): number {
        const database: any = this.databaseFactory.create();
        const statement: any = database.prepare(`DELETE FROM Track WHERE TrackID IN (
                                                 SELECT TrackID
                                                 FROM FolderTrack
                                                 WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`);

        const info = statement.run();

        return info.changes;
    }

    public deleteTrack(trackId: number): void {
        const database: any = this.databaseFactory.create();
        database.prepare('DELETE FROM Track WHERE TrackID = ?;').run(trackId);
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
                    FROM Track;`);

        const tracks: Track[] = statement.all();

        return tracks;
    }

    public updateTrack(track: Track): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `UPDATE Track
                SET Artists=@artists,
                Genres=@genres,
                AlbumTitle=@albumTitle,
                AlbumArtists=@albumArtists,
                AlbumKey=@albumKey,
                Path=@path,
                SafePath=@path,
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
                WHERE TrackID=@trackId;`);

        statement.run(
            {
                trackId: track.trackId,
                artists: track.artists,
                genres: track.genres,
                albumTitle: track.albumTitle,
                albumArtists: track.albumArtists,
                albumKey: track.albumKey,
                path: track.path,
                safePath: track.path,
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
                dateLastPlayed: track.dateLastPlayed
            });
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
                );`);

        statement.run(
            {
                artists: track.artists,
                genres: track.genres,
                albumTitle: track.albumTitle,
                albumArtists: track.albumArtists,
                albumKey: track.albumKey,
                path: track.path,
                safePath: track.path,
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
                dateLastPlayed: track.dateLastPlayed
            });
    }

    public getTrackByPath(path: string): Track {
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
                    FROM Track
                    WHERE Path=?;`);

        const track: Track = statement.get(path);

        return track;
    }

    public getAlbumDataThatNeedsIndexing(): AlbumData[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart()}
                WHERE AlbumKey NOT IN (SELECT AlbumKey FROM AlbumArtwork)
                AND AlbumKey IS NOT NULL AND AlbumKey <> ''
                AND NeedsAlbumArtworkIndexing=1 GROUP BY AlbumKey;`);

        const albumData: AlbumData[] = statement.all();

        return albumData;
    }
}
