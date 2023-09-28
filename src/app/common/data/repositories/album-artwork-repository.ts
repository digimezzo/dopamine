import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { AlbumArtwork } from '../entities/album-artwork';
import { BaseAlbumArtworkRepository } from './base-album-artwork-repository';

@Injectable()
export class AlbumArtworkRepository implements BaseAlbumArtworkRepository {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public addAlbumArtwork(albumArtwork: AlbumArtwork): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);');
        statement.run(albumArtwork.albumKey, albumArtwork.artworkId);
    }

    public getAllAlbumArtwork(): AlbumArtwork[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId
            FROM AlbumArtwork;`
        );

        const albumArtwork: AlbumArtwork[] | undefined = statement.all();

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
