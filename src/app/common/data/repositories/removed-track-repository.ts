/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { RemovedTrack } from '../entities/removed-track';
import { BaseRemovedTrackRepository } from './base-removed-track-repository';

@Injectable()
export class RemovedTrackRepository implements BaseRemovedTrackRepository {
    private folderModel: any;

    public constructor(private databaseFactory: DatabaseFactory) {}

    public addRemovedTrack(removedTrack: RemovedTrack): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO RemovedTrack (TrackID, Path, SafePath, DateRemoved) VALUES (?, ?, ?, ?);');
        statement.run(removedTrack.trackId, removedTrack.path, removedTrack.path.toLowerCase(), removedTrack.dateRemoved);
    }

    public deleteRemovedTrackByTrackId(trackId: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM RemovedTrack WHERE TrackID=?;');
        statement.run(trackId);
    }

    public getRemovedTracks(): RemovedTrack[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(`SELECT TrackID as trackId, Path as path, DateRemoved as dateRemoved FROM RemovedTrack;`);

        const removedTracks: RemovedTrack[] | undefined = statement.all();

        return removedTracks;
    }
}
