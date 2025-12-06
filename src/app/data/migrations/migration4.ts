import { Migration } from '../migration';

export class Migration4 extends Migration {
    public id: number = 4;
    public name: string = 'Migration4';

    public up(): void {
        this.sql('ALTER TABLE Track ADD AlbumKey2 TEXT;');
        this.sql('ALTER TABLE Track ADD AlbumKey3 TEXT;');
    }
}
