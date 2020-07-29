import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { FolderTrack } from '../entities/folder-track';
import { BaseFolderTrackRepository } from './base-folder-track-repository';

@Injectable({
    providedIn: 'root'
})
export class FolderTrackRepository implements BaseFolderTrackRepository {
    private folderModel: any;

    constructor(private databaseFactory: DatabaseFactory) {
    }

    public addFolderTrack(folderTrack: FolderTrack): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO FolderTrack (FolderID, TrackID) VALUES (?, ?)');
        statement.run(folderTrack.folderId, folderTrack.trackId);
    }

    public deleteFolderTrackByFolderId(folderId: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM FolderTrack WHERE FolderID=?');
        statement.run(folderId);
    }

    public deleteOrphanedFolderTracks(): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);');
        statement.run();
    }
}
