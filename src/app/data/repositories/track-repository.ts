import { Injectable } from '@angular/core';
import { BaseTrackRepository } from './base-track-repository';
import { DatabaseFactory } from '../database-factory';

@Injectable({
    providedIn: 'root'
})
export class TrackRepository implements BaseTrackRepository {
    constructor(private databaseFactory: DatabaseFactory) {
    }

    public getNumberOfTracksThatNeedIndexing(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT COUNT(*) AS numberOfTracksThatNeedIndexing
            FROM Track
            WHERE NeedsIndexing=?`);

        const result: any = statement.get(1);

        return result.numberOfTracksThatNeedIndexing;
    }

    public getNumberOfTracks(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT COUNT(*) AS numberOfTracks FROM Track');

        const result: any = statement.get();

        return result.numberOfTracks;
    }

    public getMaximumDateFileModified(): number {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('SELECT MAX(DateFileModified) AS maximumDateFileModified FROM Track');

        const result: any = statement.get();

        return result.maximumDateFileModified;
    }
}
