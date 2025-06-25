import { Migration } from '../migration';

export class Migration7 extends Migration {
    public id: number = 7;
    public name: string = 'Migration7';

    public up(): void {
        this.sql('UPDATE Track SET NeedsIndexing=1;');
    }

    public down(): void {
        // Nothing to do
    }
}
