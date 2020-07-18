import { Injectable } from '@angular/core';
import { DatabaseFactory } from './database-factory';

@Injectable({
    providedIn: 'root'
})
export class DatabaseMigrator {
    constructor(private databaseFactory: DatabaseFactory) {
    }

    public createDatabaseIfNotExists(): any {
        const database: any = this.databaseFactory.create();

        const createFoldersTable: any = database.prepare(
            `CREATE TABLE IF NOT EXISTS Folder (
            FolderID	         INTEGER PRIMARY KEY AUTOINCREMENT,
            Path	             TEXT,
            SafePath	         TEXT,
            ShowInCollection     INTEGER);`
            );

            createFoldersTable.run();
    }
}
