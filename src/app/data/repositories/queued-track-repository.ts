/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { QueuedTrackRepositoryBase } from './queued-track-repository.base';
import { DatabaseFactory } from '../database-factory';
import { QueuedTrack } from '../entities/queued-track';

@Injectable()
export class QueuedTrackRepository implements QueuedTrackRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public getPlayingTrack(): QueuedTrack | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT QueuedTrackID   as queuedTrackId,
                    Path            as path,
                    IsPlaying       as isPlaying,
                    ProgressSeconds as progressSeconds,
                    OrderID         as orderId
             FROM QueuedTrack
             WHERE IsPlaying = 1;`,
        );

        const queuedTrack: QueuedTrack | undefined = statement.get();

        return queuedTrack;
    }

    public getSavedQueuedTracks(): QueuedTrack[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT QueuedTrackID   as queuedTrackId,
                    Path            as path,
                    IsPlaying       as isPlaying,
                    ProgressSeconds as progressSeconds,
                    OrderID         as orderId
             FROM QueuedTrack
             ORDER BY OrderID;`,
        );

        const queuedTracks: QueuedTrack[] | undefined = statement.all();

        return queuedTracks;
    }

    public saveQueuedTracks(tracks: QueuedTrack[]): void {
        const database: any = this.databaseFactory.create();

        database.exec('BEGIN TRANSACTION;');

        // First, clear old queued tracks.
        database.exec('DELETE FROM QueuedTrack;');

        // Then, insert new queued tracks.
        for (const track of tracks) {
            const statement = database.prepare(
                'INSERT INTO QueuedTrack (Path, SafePath, IsPlaying, ProgressSeconds, OrderID) VALUES (?, ?, ?, ?, ?);',
            );
            statement.run(track.path, track.path.toLowerCase(), track.isPlaying, track.progressSeconds, track.orderId);
        }

        database.exec('COMMIT;');
    }
}
