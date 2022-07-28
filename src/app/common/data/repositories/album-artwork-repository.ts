import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { AlbumArtwork } from '../entities/album-artwork';
import { BaseAlbumArtworkRepository } from './base-album-artwork-repository';

@Injectable()
export class AlbumArtworkRepository implements BaseAlbumArtworkRepository {
    constructor(private databaseFactory: DatabaseFactory) {}

    public addAlbumArtwork(albumArtwork: AlbumArtwork): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);');
        statement.run(albumArtwork.albumKey, albumArtwork.artworkId);
    }

    public getArtworkId(albumKey: string): string {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT ArtworkID AS artworkId FROM AlbumArtwork WHERE AlbumKey=?;');

        const result: any = statement.get(albumKey);

        return result?.artworkId;
    }

    public getAllAlbumArtwork(): AlbumArtwork[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId
            FROM AlbumArtwork;`
        );

        const albumArtwork: AlbumArtwork[] = statement.all();

        return albumArtwork;
    }

    public getNumberOfAlbumArtwork(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork;`);

        const result: any = statement.get();

        return result.numberOfAlbumArtwork;
    }

    public getNumberOfAlbumArtworkThatHasNoTrack(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfAlbumArtwork
            FROM AlbumArtwork
            WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);`
        );

        const result: any = statement.get();

        return result.numberOfAlbumArtwork;
    }

    public deleteAlbumArtworkThatHasNoTrack(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM AlbumArtwork WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);');

        const info = statement.run();

        return info.changes;
    }

    public getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const result: any = statement.get();

        return result.numberOfAlbumArtwork;
    }

    public deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexing(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`DELETE FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        const info = statement.run();

        return info.changes;
    }
}
