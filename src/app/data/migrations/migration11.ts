import { Migration } from '../migration';

export class Migration11 extends Migration {
    public id: number = 11;
    public name: string = 'Migration11';

    public up(): void {
        this.sql('ALTER TABLE AlbumArtwork ADD COLUMN IsManuallySet INTEGER DEFAULT 0;');
    }
}
