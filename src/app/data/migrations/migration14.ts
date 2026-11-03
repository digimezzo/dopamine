import { Migration } from '../migration';

export class Migration14 extends Migration {
    public id: number = 14;
    public name: string = 'Migration14';

    public up(): void {
        this.sql('CREATE TABLE PlaylistSession (' + 'PlaylistPath TEXT PRIMARY KEY, ' + 'LoopMode INTEGER, ' + 'IsShuffled INTEGER);');
        this.sql(
            'CREATE TABLE PlaylistSessionTrack (' +
                'PlaylistPath TEXT, ' +
                'Path TEXT, ' +
                'OrderID INTEGER, ' +
                'IsPlayed INTEGER, ' +
                'FOREIGN KEY (PlaylistPath) REFERENCES PlaylistSession(PlaylistPath) ON DELETE CASCADE);',
        );
        this.sql('CREATE INDEX PlaylistSessionTrackPlaylistPathIndex ON PlaylistSessionTrack(PlaylistPath);');
    }
}
