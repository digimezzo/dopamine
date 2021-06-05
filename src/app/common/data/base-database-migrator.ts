export abstract class BaseDatabaseMigrator {
    public abstract async migrateAsync(): Promise<void>;
}
