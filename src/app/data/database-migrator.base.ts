export abstract class DatabaseMigratorBase {
    public abstract migrateAsync(): Promise<void>;
}
