/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import { BaseFileAccess } from '../common/io/base-file-access';

@Injectable()
export class DatabaseFactory {
    public constructor(private fileAccess: BaseFileAccess) {}

    public create(): any {
        const databaseFile: string = this.fileAccess.combinePath([this.fileAccess.applicationDataDirectory(), 'Dopamine.db']);
        const database: any = new Database(databaseFile);

        return database;
    }
}
