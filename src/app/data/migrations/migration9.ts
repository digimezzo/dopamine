import { Migration } from '../migration';

export class Migration9 extends Migration {
    public id: number = 9;
    public name: string = 'Migration9';

    public up(): void {
        this.sql('ALTER TABLE Track ADD COLUMN Composers TEXT;');
        this.sql('ALTER TABLE Track ADD COLUMN Conductor TEXT;');
        this.sql('ALTER TABLE Track ADD COLUMN BeatsPerMinute INT;');
        this.sql('UPDATE Track SET NeedsIndexing=1;');
    }
}
