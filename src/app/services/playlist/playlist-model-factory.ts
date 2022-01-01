import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistModelFactory {
    constructor(private fileSystem: FileSystem) {}

    public create(playlistPath: string): PlaylistModel {
        return new PlaylistModel(this.getPlaylistName(playlistPath), playlistPath, this.getPlaylistImage(playlistPath));
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileSystem.getFileName(playlistPath);
    }

    private getPlaylistImage(playlistPath: string): string {
        for (const playlistImageExtension of FileFormats.supportedPlaylistImageExtensions) {
            const playlistImagePath: string = this.createPlaylistImagePath(playlistPath, playlistImageExtension);

            if (this.fileSystem.pathExists(playlistImagePath)) {
                return 'file:///' + playlistImagePath;
            }
        }

        return Constants.emptyImage;
    }

    private createPlaylistImagePath(playlistPath: string, playlistImageExtension: string): string {
        const directory: string = this.fileSystem.getDirectoryPath(playlistPath);
        const fileNameWithoutExtension: string = this.fileSystem.getFileNameWithoutExtension(playlistPath);
        const imageFileName: string = `${fileNameWithoutExtension}${playlistImageExtension}`;

        const playlistImagePath: string = this.fileSystem.combinePath([directory, imageFileName]);

        return playlistImagePath;
    }
}
