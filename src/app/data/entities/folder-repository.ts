import { Injectable } from '@angular/core';
import LinvoDB from 'linvodb3';
import * as Bluebird from 'bluebird';
import { Folder } from './folder';

@Injectable({
    providedIn: 'root'
})
export class FolderRepository {
    private folderModel: any;

    constructor() {
        LinvoDB.defaults.store = { db: require('level-js') };
        // LinvoDB.dbPath = remote.app.getPath("userData"); // This is ignored when using level-js
        this.folderModel = new LinvoDB('folders', {});

        // Examples of promosification: https://github.com/Ivshti/linvodb3/issues/38
        Bluebird.promisifyAll(this.folderModel);
    }

    public async addFolderAsync(folderPath: string): Promise<void> {
        const folder: Folder = new Folder(folderPath);
        await this.folderModel.saveAsync(folder);
    }

    public async getFoldersAsync(): Promise<Folder[]> {
        const folders: Folder[] = await this.folderModel.findAsync({});

        return folders;
    }

    public async getFolderAsync(folderPath: string): Promise<Folder> {
        const folder: Folder = await this.folderModel.findOneAsync({ path: folderPath });

        return folder;
    }

    public async deleteFolderAsync(folderPath: string): Promise<void> {
        const folder: Folder = await this.getFolderAsync(folderPath);
        await this.folderModel.removeAsync(folder);
    }
}
