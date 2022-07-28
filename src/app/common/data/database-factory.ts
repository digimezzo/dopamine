import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import { BaseFileSystem } from '../io/base-file-system';

@Injectable()
export class DatabaseFactory {
    constructor(private fileSystem: BaseFileSystem) {}

    public create(): any {
        const databaseFile: string = this.fileSystem.combinePath([this.fileSystem.applicationDataDirectory(), 'Dopamine.db']);
        const database: any = new Database(databaseFile);

        return database;
    }
}
