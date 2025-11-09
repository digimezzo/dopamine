import { Injectable } from '@angular/core';
import { DatabaseFactory } from '../database-factory';
import { Folder } from '../entities/folder';
import { FolderRepositoryBase } from './folder-repository.base';
import { PersistentDatabase } from '../persistent-database';

@Injectable()
export class FolderRepository implements FolderRepositoryBase {
    public constructor(private databaseFactory: DatabaseFactory) {}

    public async addFolderAsync(folder: Folder): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('INSERT INTO Folder (Path, SafePath, ShowInCollection) VALUES (?, ?, 1);', [folder.path, folder.path.toLowerCase()]);
    }

    public async getFoldersAsync(): Promise<Folder[] | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        return database.query<Folder>('SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection FROM Folder;');
    }

    public async getFolderByPathAsync(folderPath: string): Promise<Folder | undefined> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();

        const folder: Folder[] = database.query<Folder>(
            'SELECT FolderID as folderId, Path as path, ShowInCollection as showInCollection FROM Folder WHERE Path=?;',
            [folderPath],
        );

        return folder[0] ?? undefined;
    }

    public async deleteFolderAsync(folderId: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('DELETE FROM Folder WHERE FolderID=?;', [folderId]);
    }

    public async setFolderShowInCollectionAsync(folderId: number, showInCollection: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('UPDATE Folder SET ShowInCollection=? WHERE FolderID=?;', [showInCollection, folderId]);
    }

    public async setAllFoldersShowInCollectionAsync(showInCollection: number): Promise<void> {
        const database: PersistentDatabase = await this.databaseFactory.createAsync();
        database.run('UPDATE Folder SET ShowInCollection=?;', [showInCollection]);
    }
}
