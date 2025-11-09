import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { AlbumArtwork } from '../entities/album-artwork';
import { AlbumArtworkRepositoryBase } from './album-artwork-repository.base';
import { PersistentDatabase } from '../persistent-database';

@Injectable()
export class AlbumArtworkRepository implements AlbumArtworkRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public async addAlbumArtworkAsync(albumArtwork: AlbumArtwork): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);', [albumArtwork.albumKey, albumArtwork.artworkId]);
    }

    public async getAllAlbumArtworkAsync(): Promise<AlbumArtwork[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<AlbumArtwork>(
            'SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId FROM AlbumArtwork;',
        );
    }

    public async getNumberOfAlbumArtworkAsync(): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        const result = database.query<{ numberOfAlbumArtwork: number }>('SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork;');

        return result[0]?.numberOfAlbumArtwork ?? 0;
    }

    public async getNumberOfAlbumArtworkThatHasNoTrackAsync(albumKeyIndex: string): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        const result = database.query<{ numberOfAlbumArtwork: number }>(
            `SELECT COUNT(*) AS numberOfAlbumArtwork
             FROM AlbumArtwork
             WHERE AlbumKey NOT IN (SELECT AlbumKey${albumKeyIndex} FROM Track);`,
        );

        return result[0]?.numberOfAlbumArtwork ?? 0;
    }

    public async deleteAlbumArtworkThatHasNoTrackAsync(albumKeyIndex: string): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('DELETE FROM AlbumArtwork WHERE AlbumKey NOT IN (SELECT AlbumKey${albumKeyIndex} FROM Track);');

        return database.getRowsModified();
    }

    public async getNumberOfAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(albumKeyIndex: string): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        const result = database.query<{ numberOfAlbumArtwork: number }>(`SELECT COUNT(*) AS numberOfAlbumArtwork FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey${albumKeyIndex} FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        return result[0]?.numberOfAlbumArtwork ?? 0;
    }

    public async deleteAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(albumKeyIndex: string): Promise<number> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run(`DELETE FROM AlbumArtwork
        WHERE AlbumKey IN (SELECT AlbumKey${albumKeyIndex} FROM Track WHERE NeedsAlbumArtworkIndexing = 1);`);

        return database.getRowsModified();
    }
}
