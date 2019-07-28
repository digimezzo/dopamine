import * as loki from 'lokijs';
import { Utils } from '../core/utils';

export class CollectionLoader {
    private isDatabaseLoaded: boolean;
    private databaseFile: string;
    private database: loki;
    private collectionNames: string[] = [];
    private collections: Map<string, any> = new Map<string, any>();

    constructor(databaseFile: string, collectionNames: string[]) {
        this.databaseFile = this.databaseFile;
        this.collectionNames = collectionNames;
        this.loadDatabase();
    }

    public async getCollectionAsync(collectionName: string): Promise<any> {
        while (!this.isDatabaseLoaded) {
            // Wait until the database is loaded
            Utils.sleep(50);
        }

        return this.collections.get(collectionName);
    }

    private loadDatabase(): void {
        this.isDatabaseLoaded = false;

        this.database = new loki(this.databaseFile, {
            autoload: true,
            autoloadCallback: this.databaseLoaded.bind(this)
        });
    }

    private databaseLoaded(): void {
        let mustSaveDatabase: boolean = false;

        // Load all collections
        for (let collectionName of this.collectionNames) {
            if (!this.collections.has(collectionName)) {
                this.collections.set(collectionName, this.database.addCollection(collectionName));
                mustSaveDatabase = true;
            }
        }

        if (mustSaveDatabase) {
            this.database.saveDatabase();
        }

        this.isDatabaseLoaded = true;
    }
}