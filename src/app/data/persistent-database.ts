import fs from 'fs-extra';
import initSqlJs, { Database, SqlJsStatic, Statement } from 'sql.js';
import path from 'path';

/**
 * A persistent SQLite wrapper around sql.js (WASM).
 * Keeps the DB in memory for speed and periodically saves it to disk.
 */
export class PersistentDatabase {
    private static SQL: SqlJsStatic | null = null;
    private db: Database;
    private readonly filePath: string;
    private readonly saveIntervalMs: number;
    private saveTimeout: NodeJS.Timeout | null = null;

    private constructor(filePath: string, db: Database, saveIntervalMs: number) {
        this.filePath = filePath;
        this.db = db;
        this.saveIntervalMs = saveIntervalMs;
    }

    /**
     * Initializes and returns a SqlJsPersistentDB instance.
     * @param filePath Path to the SQLite database file.
     * @param saveIntervalMs Debounce interval for auto-saving (default: 10s).
     */
    public static async createAsync(filePath: string, saveIntervalMs = 10000): Promise<PersistentDatabase> {
        if (!this.SQL) {
            this.SQL = await initSqlJs({
                locateFile: () => path.join(__dirname, 'sql-wasm.wasm'),
            });
        }

        let db: Database;
        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            db = new this.SQL.Database(fileBuffer);
        } else {
            db = new this.SQL.Database();
        }

        return new PersistentDatabase(filePath, db, saveIntervalMs);
    }

    /**
     * Executes a SQL statement that doesn’t return rows (e.g. INSERT, UPDATE, DELETE).
     */
    public run(sql: string, params?: initSqlJs.BindParams | undefined): void {
        this.db.run(sql, params);
        this.scheduleSave();
    }

    /**
     * Returns the number of rows affected by the most recent
     * INSERT, UPDATE, or DELETE statement executed on this database.
     */
    public getRowsModified(): number {
        return this.db.getRowsModified();
    }

    /**
     * Prepares a raw SQL statement (caller must handle stmt.free()).
     */
    public prepare(sql: string): Statement {
        return this.db.prepare(sql);
    }

    /**
     * Executes a SQL query and returns all rows as objects.
     */
    public query<T = Record<string, unknown>>(sql: string, params?: initSqlJs.BindParams | undefined): T[] {
        const stmt = this.db.prepare(sql, params);
        const results: T[] = [];

        while (stmt.step()) {
            results.push(stmt.getAsObject() as T);
        }

        stmt.free();
        return results;
    }

    /**
     * Immediately saves the in-memory DB to disk.
     */
    public save(): void {
        const data = this.db.export();
        fs.writeFileSync(this.filePath, Buffer.from(data));
    }

    /**
     * Closes the database and ensures data is persisted.
     */
    public close(): void {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.save();
        this.db.close();
    }

    /**
     * Begins a new SQL transaction.
     */
    public beginTransaction(): void {
        this.db.exec('BEGIN TRANSACTION;');
    }

    /**
     * Commits the current SQL transaction.
     */
    public commit(): void {
        this.db.exec('COMMIT;');
        this.scheduleSave();
    }

    /**
     * Rolls back the current SQL transaction.
     */
    public rollback(): void {
        this.db.exec('ROLLBACK;');
    }

    /**
     * Returns the current SQLite user_version from the database.
     */
    public getUserVersion(): number {
        const stmt = this.db.prepare('PRAGMA user_version');
        const row = stmt.step() ? (stmt.getAsObject() as { user_version: number }) : { user_version: 0 };
        stmt.free();
        return row.user_version;
    }

    /**
     * Schedules a debounced save to disk.
     */
    private scheduleSave(): void {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.save(), this.saveIntervalMs);
    }
}
