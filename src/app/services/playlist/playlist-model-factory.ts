import { Injectable } from '@angular/core';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistModelFactory {
    constructor(private fileSystem: FileSystem) {}

    public create(path: string): PlaylistModel {
        return new PlaylistModel(this.fileSystem.getFileName(path), path);
    }
}
