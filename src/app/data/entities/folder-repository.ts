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

        Bluebird.promisifyAll(this.folderModel);
    }

    public async addFolderAsync(path: string): Promise<void> {
        const folder: Folder = new Folder('/my/path5');
        this.folderModel.saveAsync(folder);
    }
}
