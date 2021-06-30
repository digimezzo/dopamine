import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { Folder } from '../entities/folder';
import { BaseFolderRepository } from './base-folder-repository';

@Injectable()
export class FolderRepository implements BaseFolderRepository {
    constructor(private databaseFactory: DatabaseFactory) {}

    public addFolder(folder: Folder): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO Folder (Path, SafePath, ShowInCollection) VALUES (?, ?, 1);');
        statement.run(folder.path, folder.path.toLowerCase());
    }

    public getFolders(): Folder[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder;`
        );

        const folders: Folder[] = statement.all();

        return folders;
    }

    public getFolderByPath(folderPath: string): Folder {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder
            WHERE Path=?;`
        );

        const folder: Folder = statement.get(folderPath);

        return folder;
    }

    public deleteFolder(folderId: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM Folder WHERE FolderID=?;');
        statement.run(folderId);
    }

    public setFolderShowInCollection(folderId: number, showInCollection: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('UPDATE Folder SET ShowInCollection=? WHERE FolderID=?;');
        statement.run(showInCollection, folderId);
    }

    public setAllFoldersShowInCollection(showInCollection: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('UPDATE Folder SET ShowInCollection=?;');
        statement.run(showInCollection);
    }
}
