import { Injectable } from '@angular/core';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistFolderModel } from './playlist-folder-model';

@Injectable()
export class PlaylistFolderModelFactory {
    constructor(private fileSystem: FileSystem) {}

    public create(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(this.fileSystem.getDirectoryName(path), path);
    }
}
