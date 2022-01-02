import { Injectable } from '@angular/core';
import { FileSystem } from '../../common/io/file-system';

@Injectable()
export class PlaylistImagePathCreator {
    constructor(private fileSystem: FileSystem) {}

    public createPlaylistImagePath(playlistPath: string, playlistImageExtension: string): string {
        const directory: string = this.fileSystem.getDirectoryPath(playlistPath);
        const fileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(playlistPath);
        const imageFileName: string = `${fileNameWithoutExtension}${playlistImageExtension}`;

        const playlistImagePath: string = this.fileSystem.combinePath([directory, imageFileName]);

        return playlistImagePath;
    }
}
