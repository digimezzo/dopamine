import { Injectable } from '@angular/core';
import { DatabaseFactory } from './database-factory';
import { Migration } from './migration';
import { FileSystem } from '../core/file-system';
import { Logger } from '../core/logger';
import { InitialMigration } from './migrations/001-initial';

@Injectable({
    providedIn: 'root'
})
export class DatabaseMigrator {
    private migrations: Migration[] = [new InitialMigration()];

    constructor(private databaseFactory: DatabaseFactory, private fileSystem: FileSystem, private logger: Logger) {
    }

    public async migrateAsync(): Promise<void> {
        const database: any = this.databaseFactory.create();

        const migrationsSortedById: Migration[] = this.migrations.sort((a, b) => a.id > b.id ? 1 : 0);

        this.logger.info(
            `Found migrations: ${migrationsSortedById.map(x => x.name).toString()}`,
            'DatabaseMigrator',
            'getMigrationsAsync');

        for (const migration of migrationsSortedById) {
            try {
                this.logger.error(`Executing migration ${migration.name}`, 'DatabaseMigrator', 'migrateAsync');
                database.prepare(migration.up).run();
                database.prepare('PRAGMA user_version = ?;').run(migration.id);
                this.logger.error(`Migration ${migration.name} success`, 'DatabaseMigrator', 'migrateAsync');
            } catch (error) {
                this.logger.error(`Could not execute migration: ${migration.name}. Error: ${error}`, 'DatabaseMigrator', 'migrateAsync');
            }
        }
    }
}
