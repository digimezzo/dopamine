/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { Folder } from '../entities/folder';
import { FolderRepositoryBase } from './folder-repository.base';

@Injectable()
export class FolderRepository implements FolderRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public addFolder(folder: Folder): void {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare('INSERT INTO Folder (Path, SafePath, ShowInCollection) VALUES (?, ?, 1);');
        statement.run(folder.path, folder.path.toLowerCase());
    }

    public getFolders(): Folder[] | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder;`,
        );

        const folders: Folder[] | undefined = statement.all();

        return folders;
    }

    public getFolderByPath(folderPath: string): Folder | undefined {
        const database: any = this.databaseFactory.create();

        const statement = database.prepare(
            `SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection
            FROM Folder
            WHERE Path=?;`,
        );

        const folder: Folder | undefined = statement.get(folderPath);

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
