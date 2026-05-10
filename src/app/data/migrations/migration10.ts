import { Migration } from '../migration';

export class Migration10 extends Migration {
    public id: number = 10;
    public name: string = 'Migration10';

    public up(): void {
        this.sql('ALTER TABLE Track ADD COLUMN ReplayGainTrackGain REAL;');
        this.sql('ALTER TABLE Track ADD COLUMN ReplayGainTrackPeak REAL;');
        this.sql('ALTER TABLE Track ADD COLUMN ReplayGainAlbumGain REAL;');
        this.sql('ALTER TABLE Track ADD COLUMN ReplayGainAlbumPeak REAL;');
    }
}
