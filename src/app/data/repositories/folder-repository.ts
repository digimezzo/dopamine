import { Injectable } from '@angular/core';
import { Folder } from '../entities/folder';
import { DatabaseFactory } from '../database-factory';
import { BaseFolderRepository } from './base-folder-repository';

@Injectable({
    providedIn: 'root'
})
export class FolderRepository implements BaseFolderRepository {
    private folderModel: any;

    constructor(private databaseFactory: DatabaseFactory) {
    }

    public addFolder(folderPath: string): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO Folder (Path, SafePath, ShowInCollection) VALUES (?, ?, ?)');
        statement.run(folderPath, folderPath, 1);
    }

    public getFolders(): Folder[] {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder`);

        const folders: Folder[] = statement.all();

        return folders;
    }

    public getFolder(folderPath: string): Folder {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder
            WHERE Path=?`);

        const folder: Folder = statement.get(folderPath);

        return folder;
    }

    public deleteFolder(folderId: number): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('DELETE FROM Folder WHERE FolderID=?');
        statement.run(folderId);
    }
}
