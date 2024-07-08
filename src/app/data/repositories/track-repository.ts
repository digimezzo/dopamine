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

@Injectable()
export class TrackRepository implements TrackRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

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

    public getTracksForAlbums(albumKeyIndex: string, albumKeys: string[]): Track[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectTracksQueryPart(true)} AND ${ClauseCreator.createTextInClause(`t.AlbumKey${albumKeyIndex}`, albumKeys)}`,
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

    public getAlbumDataForAlbumKey(albumKey: string): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart('', false)}
                WHERE t.AlbumKey = '${albumKey}'
                GROUP BY t.AlbumKey;`,
        );

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAllAlbumData(albumKeyIndex: string): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)}
                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> '' 
                GROUP BY t.AlbumKey${albumKeyIndex};`,
        );

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForTrackArtists(albumKeyIndex: string, trackArtists: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (trackArtists != undefined && trackArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Artists', trackArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForAlbumArtists(albumKeyIndex: string, albumArtists: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (albumArtists != undefined && albumArtists.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.AlbumArtists', albumArtists, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
                                                AND t.AlbumKey IS NOT NULL AND t.AlbumKey <> ''
                                                GROUP BY t.AlbumKey;`);

        const albumData: AlbumData[] | undefined = statement.all();

        return albumData;
    }

    public getAlbumDataForGenres(albumKeyIndex: string, genres: string[]): AlbumData[] | undefined {
        const database: any = this.databaseFactory.create();

        let filterQuery: string = '';

        if (genres != undefined && genres.length > 0) {
            filterQuery = ` AND ${ClauseCreator.createOrLikeClause('t.Genres', genres, Constants.columnValueDelimiter)}`;
        }

        const statement = database.prepare(`${QueryParts.selectAlbumDataQueryPart(albumKeyIndex, true)} ${filterQuery}
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
