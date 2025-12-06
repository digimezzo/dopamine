import { Migration } from '../migration';

export class Migration8 extends Migration {
    public id: number = 8;
    public name: string = 'Migration8';

    public up(): void {
        this.sql('ALTER TABLE Track ADD COLUMN NewRating INT;');
        this.sql('UPDATE Track SET NewRating = Rating*2;');
    }
}
