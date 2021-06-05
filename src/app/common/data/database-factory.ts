import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import * as path from 'path';
import { FileSystem } from '../io/file-system';

@Injectable()
export class DatabaseFactory {
    constructor(private fileSystem: FileSystem) {}

    public create(): any {
        const databaseFile: string = path.join(this.fileSystem.applicationDataDirectory(), 'Dopamine.db');
        const database: any = new Database(databaseFile);

        return database;
    }
}
