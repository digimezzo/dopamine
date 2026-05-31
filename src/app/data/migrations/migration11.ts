import { Migration } from '../migration';

export class Migration11 extends Migration {
    public id: number = 10;
    public name: string = 'Migration10';

    public up(): void {
        this.sql(`CREATE TABLE ArtistArtwork (
                        ArtistArtworkID	    INTEGER,
                        Artist	            TEXT,
                        ArtworkID	        TEXT,
                        PRIMARY KEY(ArtistArtworkID));`);

        this.sql('ALTER TABLE Track ADD ArtistsKey TEXT;');
    }
}
