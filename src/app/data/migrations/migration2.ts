import { Migration } from '../migration';

export class Migration2 extends Migration {
    public id: number = 2;
    public name: string = 'Migration2';

    public up(): void {
        this.sql('UPDATE Track SET NeedsAlbumArtworkIndexing=1;');
    }

    public down(): void {
        // Nothing to do
    }
}
