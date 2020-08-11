import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
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
}
