import { Migration } from '../migration';

export class Migration13 extends Migration {
    public id: number = 13;
    public name: string = 'Migration13';

    public up(): void {
        this.sql('ALTER TABLE ArtistArtwork ADD COLUMN IsManuallySet INTEGER DEFAULT 0;');
    }
}
