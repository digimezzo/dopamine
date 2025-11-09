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
import { Constants } from '../../common/application/constants';
import { TrackRepositoryBase } from './track-repository.base';
import { PersistentDatabase } from '../persistent-database';
import { AlbumArtwork } from '../entities/album-artwork';
import { Statement } from 'sql.js';
import { Folder } from '../entities/folder';

@Injectable()
export class TrackRepository implements TrackRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public async getNumberOfTracksThatDoNotBelongFoldersAsync(): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        const result = database.query<{ numberOfTracks: number }>(`SELECT COUNT(*) AS numberOfTracks
                                                                   FROM Track
                                                                   WHERE TrackID IN (SELECT TrackID
                                                                                     FROM FolderTrack
                                                                                     WHERE FolderID NOT IN (SELECT FolderID FROM Folder));`);

        return result[0]?.numberOfTracks ?? 0;
    }

    public async deleteTracksAsync(trackIds: number[]): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run(
            `DELETE
                 FROM Track
                 WHERE ${ClauseCreator.createNumericInClause('TrackID', trackIds)};`,
        );
    }

    public async getVisibleTracksAsync(): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<Track>(QueryParts.selectTracksQueryPart(true));
    }

    public async getTracksForAlbumsAsync(albumKeyIndex: string, albumKeys: string[]): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<Track>(
            `${QueryParts.selectTracksQueryPart(true)} AND ${ClauseCreator.createTextInClause(`t.AlbumKey${albumKeyIndex}`, albumKeys)}`,
        );
    }

    public async getTracksForTrackArtistsAsync(trackArtists: string[]): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (trackArtists != undefined && trackArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Artists', trackArtists, Constants.columnValueDelimiter)}`;
        }

        return database.query<Track>(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);
    }

    public async getTracksForAlbumArtistsAsync(albumArtists: string[]): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (albumArtists != undefined && albumArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.AlbumArtists', albumArtists, Constants.columnValueDelimiter)}`;
        }

        return database.query<Track>(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);
    }

    public async getTracksForGenresAsync(genres: string[]): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (genres != undefined && genres.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Genres', genres, Constants.columnValueDelimiter)}`;
        }

        return database.query<Track>(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);
    }

    public async getTracksForPathsAsync(paths: string[]): Promise<Track[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (paths != undefined && paths.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createTextInClause('t.Path', paths)}`;
        }

        return database.query<Track>(`${QueryParts.selectTracksQueryPart(true)} ${filterQuery};`);
    }

    public async getAlbumDataThatNeedsIndexingAsync(albumKeyIndex: string): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, false)}
                WHERE (t.AlbumKey${albumKeyIndex} IS NOT NULL AND t.AlbumKey${albumKeyIndex} <> ''
                AND t.AlbumKey${albumKeyIndex} NOT IN (SELECT AlbumKey FROM AlbumArtwork)) OR NeedsAlbumArtworkIndexing=1
                GROUP BY t.AlbumKey${albumKeyIndex};`);
    }

    public async getAlbumDataForAlbumKeyAsync(albumKeyIndex: string, albumKey: string): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, false)}
                WHERE t.AlbumKey${albumKeyIndex} = '${albumKey}'
                GROUP BY t.AlbumKey${albumKeyIndex};`);
    }

    public async getAllAlbumDataAsync(albumKeyIndex: string): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)}
                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> '' 
                GROUP BY t.AlbumKey${albumKeyIndex};`);
    }

    public async getAlbumDataForTrackArtistsAsync(albumKeyIndex: string, trackArtists: string[]): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (trackArtists != undefined && trackArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Artists', trackArtists, Constants.columnValueDelimiter)}`;
        }

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);
    }

    public async getAlbumDataForAlbumArtistsAsync(albumKeyIndex: string, albumArtists: string[]): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (albumArtists != undefined && albumArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.AlbumArtists', albumArtists, Constants.columnValueDelimiter)}`;
        }

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);
    }

    public async getAlbumDataForGenresAsync(albumKeyIndex: string, genres: string[]): Promise<AlbumData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        let filterQuery: string = '';

        if (genres != undefined && genres.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Genres', genres, Constants.columnValueDelimiter)}`;
        }

        return database.query<AlbumData>(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> '' 
                                                GROUP BY t.AlbumKey;`);
    }

    public async getTrackArtistDataAsync(): Promise<ArtistData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<ArtistData>(QueryParts.selectTrackArtistsQueryPart(true));
    }

    public async getAlbumArtistDataAsync(): Promise<ArtistData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<ArtistData>(QueryParts.selectAlbumArtistsQueryPart(true));
    }

    public async getGenreDataAsync(): Promise<GenreData[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<GenreData>(QueryParts.selectGenresQueryPart(true));
    }

    public async updatePlayCountAndDateLastPlayedAsync(trackId: number, playCount: number, dateLastPlayedInTicks: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const statement: Statement = database.prepare(
            'UPDATE Track SET PlayCount=@playCount, DateLastPlayed=@dateLastPlayedInTicks WHERE TrackID = @trackId;',
        );

        statement.run({
            trackId: trackId,
            playCount: playCount,
            dateLastPlayedInTicks: dateLastPlayedInTicks,
        });

        statement.free();
    }

    public async updateSkipCountAsync(trackId: number, skipCount: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const statement: Statement = database.prepare('UPDATE Track SET SkipCount=@skipCount WHERE TrackID = @trackId;');

        statement.run({
            trackId: trackId,
            skipCount: skipCount,
        });

        statement.free();
    }

    public async updateRatingAsync(trackId: number, rating: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const statement: Statement = database.prepare('UPDATE Track SET Rating=@rating WHERE TrackID = @trackId;');

        statement.run({
            trackId: trackId,
            rating: rating,
        });

        statement.free();
    }

    public async updateLoveAsync(trackId: number, love: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const statement: Statement = database.prepare('UPDATE Track SET Love=@love WHERE TrackID = @trackId;');

        statement.run({
            trackId: trackId,
            love: love,
        });

        statement.free();
    }

    public async getLastModifiedTrackForAlbumKeyAsync(albumKeyIndex: string, albumKey: string): Promise<Track | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const track: Track[] = database.query<Track>(`${QueryParts.selectTracksQueryPart(false)} WHERE t.AlbumKey${albumKeyIndex}=?;`);

        return track[0] ?? undefined;
    }

    public async disableNeedsAlbumArtworkIndexingAsync(albumKey: string): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        const statement: any = database.prepare('UPDATE Track SET NeedsAlbumArtworkIndexing=0 WHERE AlbumKey = ?;');

        statement.run(albumKey);
        statement.free();
    }

    public async updateTrackAsync(track: Track): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const statement: Statement = database.prepare(
            `UPDATE Track
             SET Artists=@artists,
                 Genres=@genres,
                 AlbumTitle=@albumTitle,
                 AlbumArtists=@albumArtists,
                 AlbumKey=@albumKey,
                 AlbumKey2=@albumKey2,
                 AlbumKey3=@albumKey3,
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
             WHERE TrackID = @trackId;`,
        );

        statement.run({
            trackId: track.trackId,
            artists: track.artists,
            genres: track.genres,
            albumTitle: track.albumTitle,
            albumArtists: track.albumArtists,
            albumKey: track.albumKey,
            albumKey2: track.albumKey2,
            albumKey3: track.albumKey3,
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

        statement.free();
    }
}
