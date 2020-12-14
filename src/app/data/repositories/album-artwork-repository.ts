import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { AlbumArtwork } from '../entities/album-artwork';
import { BaseAlbumArtworkRepository } from './base-album-artwork-repository';

@Injectable({
    providedIn: 'root'
})
export class AlbumArtworkRepository implements BaseAlbumArtworkRepository {
    constructor(private databaseFactory: DatabaseFactory) {
    }

    public deleteAlbumArtwork(albumKey: string): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM AlbumArtwork WHERE AlbumKey=?;');
        statement.run(albumKey);
    }

    public addAlbumArtwork(albumArtwork: AlbumArtwork): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO AlbumArtwork (AlbumKey, ArtworkID) VALUES (?, ?);');
        statement.run(albumArtwork.albumKey, albumArtwork.artworkId);
    }

    public getArtworkId(albumKey: string): string {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT ArtworkID FROM AlbumArtwork WHERE AlbumKey=?;');

        const artworkId: string = statement.get(albumKey);

        return artworkId;
    }

    public getAlbumArtworksThatHaveNoTrack(): AlbumArtwork[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT AlbumArtworkID as albumArtworkId, AlbumKey as albumKey, ArtworkID as artworkId
            FROM AlbumArtwork
            WHERE AlbumKey NOT IN (SELECT AlbumKey FROM Track);`);

        const albumArtwork: AlbumArtwork[] = statement.get();

        return albumArtwork;
    }
}
