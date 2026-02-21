import { Migration } from '../migration';

export class Migration5 extends Migration {
    public id: number = 5;
    public name: string = 'Migration5';

    public up(): void {
        this.sql('UPDATE Track SET NeedsIndexing=1;');
    }
}
