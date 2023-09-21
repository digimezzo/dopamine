import Database from 'better-sqlite3';

export class TypedDatabase {
    private database: any;

    public constructor(private databaseFile: string) {
        this.database = new Database(this.databaseFile);
    }

    public deleteQuery(query: string): number {
        const statement = this.database.prepare(query);
        const result = statement.run();

        return result.changes;
    }
}
