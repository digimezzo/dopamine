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

    public createDefault(): PlaylistModel {
        return new PlaylistModel('', '', Constants.emptyImage);
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileSystem.getFileName(playlistPath);
    }

    private getPlaylistImage(playlistPath: string): string {
        for (const playlistImageExtension of FileFormats.supportedPlaylistImageExtensions) {
            const playlistImagePath: string = this.fileSystem.changeFileExtension(playlistPath, playlistImageExtension);

            if (this.fileSystem.pathExists(playlistImagePath)) {
                return playlistImagePath;
            }
        }

        return Constants.emptyImage;
    }
}
