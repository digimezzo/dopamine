import { Migration } from '../migration';

export class InitialMigration implements Migration {
    public id: number = 1;
    public name: string = '001-initial';

    public up: string = `CREATE TABLE Folder (
                            FolderID	         INTEGER PRIMARY KEY AUTOINCREMENT,
                            Path	             TEXT,
                            SafePath	         TEXT,
                            ShowInCollection   INTEGER);`;

    public down: string = `DROP TABLE Folder;`;
}
