import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import { BaseFileAccess } from '../io/base-file-access';

@Injectable()
export class DatabaseFactory {
    constructor(private fileAccess: BaseFileAccess) {}

    public create(): any {
        const databaseFile: string = this.fileAccess.combinePath([this.fileAccess.applicationDataDirectory(), 'Dopamine.db']);
        const database: any = new Database(databaseFile);

        return database;
    }
}
