/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { ClauseCreator } from '../clause-creator';
import { DatabaseFactory } from '../database-factory';
import { AlbumData } from '../entities/album-data';
import { ArtistData } from '../entities/artist-data';
import { GenreData } from '../entities/genre-data';
import { Track } from '../entities/track';
import { QueryParts } from '../query-parts';
import { BaseTrackRepository } from './base-track-repository';
import { Constants } from '../../common/application/constants';

@Injectable()
export class TrackRepository implements BaseTrackRepository {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public getNumberOfTracksThatNeedIndexing(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfTracks
             FROM Track
             WHERE NeedsIndexing=?;`,
        );

        const result: any = statement.get(1);

        return result.numberOfTracks;
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

    public getNumberOfTracksThatDoNotBelongFolders(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfTracks
        FROM Track WHERE TrackID IN (
            SELECT TrackID
            FROM FolderTrack
            WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`);

        const result: any = statement.get();

        return result.numberOfTracks;
    }

    public deleteTracksThatDoNotBelongFolders(): number {
        const database: any = this.databaseFactory.create();
        const statement: any = database.prepare(
            `DELETE FROM Track WHERE TrackID IN (
                SELECT TrackID
                FROM FolderTrack
                WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`,
        );

        const info = statement.run();

        return info.changes;
    }

    public deleteTrack(trackId: number): void {
        const database: any = this.databaseFactory.create();
        database.prepare('DELETE FROM Track WHERE TrackID = ?;').run(trackId);
    }

    public deleteTracks(trackIds: number[]): void {
        const database: any = this.databaseFactory.create();
        database.prepare(`DELETE FROM Track WHERE ${ClauseCreator.createNumericInClause('TrackID', trackIds)};`).run();
    }

    public getVisibleTracks(): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(QueryParts.selectTracksQueryPart(true));

        const tracks: Track[] | undefined = statement.all();

        return tracks;
    }

    public getAllTracks(): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(QueryParts.selectTracksQueryPart(false));

        const tracks: Track[] | undefined = statement.all();

        return tracks;
    }

    public getTracksForAlbums(albumKeys: string[]): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectTracksQueryPart(true)} AND ${ClauseCreator.createTextInClause('t.AlbumKey', albumKeys)}`,
        );

        const tracks: Track[] | undefined = statement.all();

        return tracks;
    }

    public getTracksForTrackArtists(trackArtists: string[]): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (trackArtists != undefined && trackArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Artists', trackArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);

        const tracks: Track[] | undefined = statement.all();

        return tracks;
    }

    public getTracksForAlbumArtists(albumArtists: string[]): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (albumArtists != undefined && albumArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.AlbumArtists', albumArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);

        const tracks: Track[] | undefined = statement.all();

        return tracks;
    }

    public getTracksForGenres(genres: string[]): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (genres != undefined && genres.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Genres', genres, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);

        const tracks: Track[] | undefined = statement.all();

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

    public getTrackByPath(path: string): Track | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(false)} WHERE t.Path=?;`);

        const track: Track | undefined = statement.get(path);

        return track;
    }

    public getAlbumDataThatNeedsIndexing(): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart(false)}
                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                AND (t.AlbumKey NOT IN (SELECT AlbumKey FROM AlbumArtwork) OR NeedsAlbumArtworkIndexing=1)
                GROUP BY t.AlbumKey;`,
        );

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForAlbumKey(albumKey: string): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart(false)}
                WHERE t.AlbumKey = '${albumKey}'
                GROUP BY t.AlbumKey;`,
        );

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAllAlbumData(): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart(true)}
                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> '' 
                GROUP BY t.AlbumKey;`,
        );

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForTrackArtists(trackArtists: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (trackArtists != undefined && trackArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Artists', trackArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForAlbumArtists(albumArtists: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (albumArtists != undefined && albumArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.AlbumArtists', albumArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForGenres(genres: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (genres != undefined && genres.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Genres', genres, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> '' 
                                                GROUP BY t.AlbumKey;`);

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getTrackArtistData(): ArtistData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(QueryParts.selectTrackArtistsQueryPart(true));

        const trackArtistData: ArtistData[] | undefined = statement.all();

        return trackArtistData;
    }

    public getAlbumArtistData(): ArtistData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(QueryParts.selectAlbumArtistsQueryPart(true));

        const albumArtistsData: ArtistData[] | undefined = statement.all();

        return albumArtistsData;
    }

    public getGenreData(): GenreData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(QueryParts.selectGenresQueryPart(true));

        const genres: GenreData[] | undefined = statement.all();

        return genres;
    }

    public getLastModifiedTrackForAlbumKeyAsync(albumKey: string): Track | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`${QueryParts.selectTracksQueryPart(false)} WHERE t.AlbumKey=?;`);

        const track: Track | undefined = statement.get(albumKey);

        return track;
    }

    public disableNeedsAlbumArtworkIndexing(albumKey: string): void {
        const database: any = this.databaseFactory.create();
        const statement: any = database.prepare(`UPDATE Track SET NeedsAlbumArtworkIndexing=0 WHERE AlbumKey=?;`);

        statement.run(albumKey);
    }

    public enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover: boolean): void {
        const database: any = this.databaseFactory.create();
        let statement: any;

        if (onlyWhenHasNoCover) {
            statement = database.prepare(
                `UPDATE Track SET NeedsAlbumArtworkIndexing=1 WHERE AlbumKey NOT IN (SELECT AlbumKey FROM AlbumArtwork);`,
            );
        } else {
            statement = database.prepare(`UPDATE Track SET NeedsAlbumArtworkIndexing=1;`);
        }

        statement.run();
    }

    public updatePlayCountAndDateLastPlayed(trackId: number, playCount: number, dateLastPlayedInTicks: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `UPDATE Track SET PlayCount=@playCount, DateLastPlayed=@dateLastPlayedInTicks WHERE TrackID=@trackId;`,
        );

        statement.run({
            trackId: trackId,
            playCount: playCount,
            dateLastPlayedInTicks: dateLastPlayedInTicks,
        });
    }

    public updateSkipCount(trackId: number, skipCount: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`UPDATE Track SET SkipCount=@skipCount WHERE TrackID=@trackId;`);

        statement.run({
            trackId: trackId,
            skipCount: skipCount,
        });
    }

    public updateRating(trackId: number, rating: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`UPDATE Track SET Rating=@rating WHERE TrackID=@trackId;`);

        statement.run({
            trackId: trackId,
            rating: rating,
        });
    }

    public updateLove(trackId: number, love: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`UPDATE Track SET Love=@love WHERE TrackID=@trackId;`);

        statement.run({
            trackId: trackId,
            love: love,
        });
    }
}
