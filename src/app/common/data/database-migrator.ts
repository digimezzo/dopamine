import { Injectable } from '@angular/core';
import { Logger } from '../logger';
import { BaseDatabaseMigrator } from './base-database-migrator';
import { DatabaseFactory } from './database-factory';
import { Migration } from './migration';
import { Migration1 } from './migrations/migration1';
import { Migration2 } from './migrations/migration2';
import { Migration3 } from './migrations/migration3';

@Injectable()
export class DatabaseMigrator implements BaseDatabaseMigrator {
    private migrations: Migration[] = [new Migration1(), new Migration2(), new Migration3()];

    constructor(private databaseFactory: DatabaseFactory, private logger: Logger) {}

    public async migrateAsync(): Promise<void> {
        const databaseVersion: number = this.getDatabaseVersion();
        const mostRecentMigration: number = this.getMostRecentMigration();
        let migrationsToApply: Migration[] = [];
        let mustRevert: boolean = false;

        if (mostRecentMigration === databaseVersion) {
            this.logger.info('The database is up to date. No migrations to perform.', 'DatabaseMigrator', 'migrateAsync');
        } else if (mostRecentMigration > databaseVersion) {
            this.logger.info('Database is too old. Applying migrations.', 'DatabaseMigrator', 'migrateAsync');
            migrationsToApply = this.getMigrationsToApply(databaseVersion, false);
        } else if (mostRecentMigration < databaseVersion) {
            this.logger.info('Database is too new. Reverting migrations.', 'DatabaseMigrator', 'migrateAsync');
            mustRevert = true;
            migrationsToApply = this.getMigrationsToApply(databaseVersion, true);
        }

        const database: any = this.databaseFactory.create();

        if (migrationsToApply.length > 0) {
            this.logger.info(
                `Found migrations: ${migrationsToApply.map((x) => x.name).toString()}`,
                'DatabaseMigrator',
                'getMigrationsAsync'
            );
        }

        for (const migration of migrationsToApply) {
            try {
                let newDatabaseVersion: number = migration.id;
                let migrationAction: string = 'Applying migration';

                if (mustRevert) {
                    migration.down();
                    newDatabaseVersion = migration.id - 1;
                    migrationAction = 'Reverting migration';
                } else {
                    migration.up();
                }

                this.logger.info(`${migrationAction} ${migration.name}`, 'DatabaseMigrator', 'migrateAsync');

                database.prepare('BEGIN TRANSACTION;').run();

                for (const statement of migration.statements) {
                    database.prepare(statement).run();
                }

                database.prepare(`PRAGMA user_version = ${newDatabaseVersion};`).run();
                database.prepare('COMMIT;').run();

                this.logger.info(`Migration ${migration.name} success`, 'DatabaseMigrator', 'migrateAsync');
            } catch (e) {
                this.logger.error(
                    `Could not perform migration: ${migration.name}. Error: ${e.message}`,
                    'DatabaseMigrator',
                    'migrateAsync'
                );

                database.prepare('ROLLBACK;').run();
            }
        }
    }

    private getMigrationsToApply(databaseVersion: number, inDescendingOrder: boolean): Migration[] {
        let sortedMigrations: Migration[] = [];

        if (inDescendingOrder) {
            const migrations: Migration[] = this.migrations.filter((x) => x.id < databaseVersion);
            sortedMigrations = migrations.sort((a, b) => (a.id > b.id ? -1 : 1));
        } else {
            const migrations: Migration[] = this.migrations.filter((x) => x.id > databaseVersion);
            sortedMigrations = migrations.sort((a, b) => (a.id > b.id ? 1 : -1));
        }

        return sortedMigrations;
    }

    private getDatabaseVersion(): number {
        const database: any = this.databaseFactory.create();
        const result = database.prepare('PRAGMA user_version').get();

        return result.user_version;
    }

    private getMostRecentMigration(): number {
        if (this.migrations.length === 0) {
            return 0;
        }

        const migrationsSortedByIdDescending: Migration[] = this.migrations.sort((a, b) => (a.id > b.id ? -1 : 1));

        return migrationsSortedByIdDescending[0].id;
    }
}
