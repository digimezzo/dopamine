import { Migration } from '../migration';

export class Migration12 extends Migration {
    public id: number = 12;
    public name: string = 'Migration12';

    public up(): void {
        this.sql(`CREATE TABLE ArtistArtwork (
                            ArtistArtworkID	    INTEGER,
                            Artist	            TEXT,
                            ArtworkID	        TEXT,
                            PRIMARY KEY(ArtistArtworkID));`);

        this.sql('ALTER TABLE Track ADD ArtistsKey TEXT;');
    }
}
