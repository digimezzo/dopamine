import { Folder } from '../../common/data/entities/folder';

export class FolderModel {
    constructor(private folder: Folder) {}

    public get folderId(): number {
        return this.folder.folderId;
    }

    public get path(): string {
        return this.folder.path;
    }

    public get showInCollection(): boolean {
        return this.folder.showInCollection != undefined && this.folder.showInCollection === 1 ? true : false;
    }
    public set showInCollection(v: boolean) {
        this.folder.showInCollection = v ? 1 : 0;
    }
}
