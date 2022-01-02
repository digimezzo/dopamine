import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { PlaylistImagePathCreator } from './playlist-image-path-creator';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistModelFactory {
    constructor(private fileSystem: FileSystem, private playlistImagePathCreator: PlaylistImagePathCreator) {}

    public create(playlistPath: string): PlaylistModel {
        return new PlaylistModel(this.getPlaylistName(playlistPath), playlistPath, this.getPlaylistImage(playlistPath));
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileSystem.getFileName(playlistPath);
    }

    private getPlaylistImage(playlistPath: string): string {
        for (const playlistImageExtension of FileFormats.supportedPlaylistImageExtensions) {
            const playlistImagePath: string = this.playlistImagePathCreator.createPlaylistImagePath(playlistPath, playlistImageExtension);

            if (this.fileSystem.pathExists(playlistImagePath)) {
                return playlistImagePath;
            }
        }

        return Constants.emptyImage;
    }
}
