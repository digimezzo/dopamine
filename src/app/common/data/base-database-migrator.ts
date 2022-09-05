export abstract class BaseDatabaseMigrator {
    public abstract migrateAsync(): Promise<void>;
}
