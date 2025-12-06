import { Migration } from '../migration';

export class Migration6 extends Migration {
    public id: number = 6;
    public name: string = 'Migration6';

    public up(): void {
        this.sql('UPDATE Track SET NeedsIndexing=1;');
    }
}
