import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { FolderTrack } from '../entities/folder-track';
import { BaseFolderTrackRepository } from './base-folder-track-repository';

@Injectable()
export class FolderTrackRepository implements BaseFolderTrackRepository {
    constructor(private databaseFactory: DatabaseFactory) {}

    public addFolderTrack(folderTrack: FolderTrack): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO FolderTrack (FolderID, TrackID) VALUES (?, ?);');
        statement.run(folderTrack.folderId, folderTrack.trackId);
    }

    public getNumberOfFolderTracksForInexistingTracks(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfFolderTracks
            FROM FolderTrack
            WHERE TrackID NOT IN (SELECT TrackID FROM Track);`
        );

        const result: any = statement.get();

        return result.numberOfFolderTracks;
    }

    public deleteFolderTracksForInexistingTracks(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM FolderTrack WHERE TrackID NOT IN (SELECT TrackID FROM Track);');
        const info = statement.run();

        return info.changes;
    }
}
