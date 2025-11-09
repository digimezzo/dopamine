/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { QueuedTrackRepositoryBase } from './queued-track-repository.base';
import { DatabaseFactory } from '../database-factory';
import { QueuedTrack } from '../entities/queued-track';
import { PersistentDatabase } from '../persistent-database';
import { Folder } from '../entities/folder';

@Injectable()
export class QueuedTrackRepository implements QueuedTrackRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public async getSavedQueuedTracksAsync(): Promise<QueuedTrack[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<QueuedTrack>(
            `SELECT QueuedTrackID   as queuedTrackId,
                    Path            as path,
                    IsPlaying       as isPlaying,
                    ProgressSeconds as progressSeconds,
                    OrderID         as orderId
             FROM QueuedTrack
             ORDER BY QueuedTrackID;`,
        );
    }

    public async saveQueuedTracksAsync(tracks: QueuedTrack[]): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        database.beginTransaction();

        // First, clear old queued tracks.
        database.run('DELETE FROM QueuedTrack;');

        // Then, insert new queued tracks.
        for (const track of tracks) {
            database.run('INSERT INTO QueuedTrack (Path, SafePath, IsPlaying, ProgressSeconds, OrderID) VALUES (?, ?, ?, ?, ?);', [
                track.path,
                track.path.toLowerCase(),
                track.isPlaying,
                track.progressSeconds,
                track.orderId,
            ]);
        }

        database.commit();
    }
}
