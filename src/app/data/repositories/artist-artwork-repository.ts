/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { ArtistArtwork } from '../entities/artist-artwork';
import { ArtistArtworkRepositoryBase } from './artist-artwork-repository.base';
import { ArtistArtworkCacheId } from '../../services/artist-artwork-cache/artist-artwork-cache-id';
import { Constants } from '../../common/application/constants';

@Injectable()
export class ArtistArtworkRepository implements ArtistArtworkRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public addArtistArtwork(artistArtwork: ArtistArtwork): void {
        const statement = this.database.prepare('INSERT INTO ArtistArtwork (Artist, ArtworkID) VALUES (?, ?);');
        statement.run(artistArtwork.artist.toLowerCase(), artistArtwork.artworkId);
    }

    public getAllArtistArtwork(): ArtistArtwork[] | undefined {
        const statement = this.database.prepare(
            `SELECT ArtistArtworkID AS artistArtworkId, 
                    Artist AS artist, 
                    ArtworkID AS artworkId 
            FROM ArtistArtwork;`,
        );

        return statement.all();
    }

    public getArtistArtworkForArtist(artist: string): ArtistArtwork | undefined {
        const statement = this.database.prepare(
            `SELECT ArtistArtworkID AS artistArtworkId, 
                    Artist AS artist, 
                    ArtworkID AS artworkId 
            FROM ArtistArtwork
            WHERE Artist=?;`,
        );

        return statement.get(artist.toLowerCase());
    }

    public getNumberOfArtistArtwork(): number {
        const statement = this.database.prepare(`SELECT COUNT(*) AS numberOfArtistArtwork FROM ArtistArtwork;`);
        const result: any = statement.get();
        return result.numberOfArtistArtwork;
    }

    public getNumberOfArtistArtworkThatHasNoTrack(): number {
        const statement = this.database.prepare(
            `SELECT COUNT(*) AS numberOfArtistArtwork
            FROM ArtistArtwork AS a
            WHERE NOT EXISTS (
                SELECT 1 FROM Track AS t
                WHERE t.ArtistsKey LIKE '%${Constants.columnValueDelimiter}' || a.Artist || '${Constants.columnValueDelimiter}%'
            );`,
        );

        const result: any = statement.get();
        return result.numberOfArtistArtwork;
    }

    public deleteArtistArtworkThatHasNoTrack(): number {
        const statement = this.database.prepare(
            `DELETE FROM ArtistArtwork AS a 
             WHERE NOT EXISTS (
                SELECT 1 FROM Track AS t
                WHERE t.ArtistsKey LIKE '%${Constants.columnValueDelimiter}' || a.Artist || '${Constants.columnValueDelimiter}%'
             );`,
        );

        const info = statement.run();
        return info.changes;
    }

    public deleteAllArtistArtwork(): number {
        const statement = this.database.prepare(`DELETE FROM ArtistArtwork WHERE 1=1;`);
        const info = statement.run();
        return info.changes;
    }

    public deleteArtistArtworkWithDefaultId(): number {
        const statement = this.database.prepare(`DELETE FROM ArtistArtwork WHERE ArtworkID=?`);
        const info = statement.run(ArtistArtworkCacheId.defaultArtworkId);
        return info.changes;
    }

    private get database(): any {
        return this.databaseFactory.create();
    }
}
