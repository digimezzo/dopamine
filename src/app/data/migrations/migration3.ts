import { Migration } from '../migration';

export class Migration3 extends Migration {
    public id: number = 3;
    public name: string = 'Migration3';

    public up(): void {
        this.sql('UPDATE Track SET NeedsAlbumArtworkIndexing=1;');
    }

    public down(): void {
        // Nothing to do
    }
}
